'use strict'

import { criarPostagem, editarPostagem } from '../../utils/apiUtils.js'

const params = new URLSearchParams(window.location.search)
const idPostagemParaEditar = params.get('idPostagem')

let modoEdicao = false
let postagemOriginal = null


const inputTitulo = document.getElementById('inputTitulo')
const inputDescricao = document.getElementById('inputDescricao')

const inputImagem = document.getElementById('foto')
const previewImagem = document.getElementById('preview-image')

const selectPaises = document.getElementById('paises')
const divPaisesEscolhidos = document.getElementById('paisesEscolhidos')

const selectCategoria = document.getElementById('categoria')
const divCategoriasEscolhidas = document.getElementById('categoriasEscolhidas')

const inputData = document.getElementById('inputData')

const inputPublico = document.getElementById('publico')

const botaoSalvar = document.getElementById('salvar')
const botaoCancelar = document.getElementById('cancelar')


async function carregarCategorias() {
    const resposta = await fetch('http://localhost:3003/categoria')
    const lista = await resposta.json()

    lista.forEach(categoria => {
        const option = document.createElement('option')
        option.value = categoria.id
        option.textContent = categoria.nome
        selectCategoria.appendChild(option)
    })
}

async function carregarPaises() {
    const resposta = await fetch('http://localhost:3003/localizacao')
    const lista = await resposta.json()

    lista.forEach(localizacao => {
        const option = document.createElement('option')
        option.value = localizacao.id
        option.textContent = localizacao.pais
        selectPaises.appendChild(option)
    })
}


let midias = []
let locais = []
let categorias = []

// Espera tudo carregar para fazer
window.addEventListener('DOMContentLoaded', async () => {
    await carregarCategorias()
    await carregarPaises()

    if (idPostagemParaEditar) {
        modoEdicao = true
        carregarPostagemParaEditar(idPostagemParaEditar)
    }
})

inputImagem.addEventListener('change', () => {
    const arquivo = inputImagem.files[0]
    if (!arquivo) return

    const url = URL.createObjectURL(arquivo)

    if (midias.includes(url)) {
        midias = []
        previewImagem.src = './img/preview-icon.png'
        return
    }

    midias = [url]
    previewImagem.src = url
})


selectPaises.addEventListener('change', () => {
    const id = Number(selectPaises.value)
    if (!id) return

    if (locais.includes(id)) {
        locais = locais.filter(l => l !== id)
    } else {
        locais.push(id)
    }

    atualizarPaises()
})

function atualizarPaises() {
    divPaisesEscolhidos.innerHTML = ''

    locais.forEach(id => {
        const option = selectPaises.querySelector(`option[value='${id}']`)
        if (!option) return
        const nome = option.textContent

        const span = document.createElement('span')
        span.textContent = nome
        span.classList.add('pais-item')

        span.addEventListener('click', () => {
            locais = locais.filter(l => l !== id)
            atualizarPaises()
        })

        divPaisesEscolhidos.appendChild(span)
    })
}

selectCategoria.addEventListener('change', () => {
    const id = Number(selectCategoria.value)
    if (!id) return

    if (categorias.includes(id)) {
        categorias = categorias.filter(c => c !== id)
    } else {
        categorias.push(id)
    }

    atualizarCategorias()
})

function atualizarCategorias() {
    divCategoriasEscolhidas.innerHTML = ''

    categorias.forEach(id => {
        const option = selectCategoria.querySelector(`option[value='${id}']`)
        if (!option) return
        const nome = option.textContent

        const span = document.createElement('span')
        span.textContent = nome
        span.classList.add('categoriaEscolhida')

        span.addEventListener('click', () => {
            categorias = categorias.filter(c => c !== id)
            atualizarCategorias()
        })

        divCategoriasEscolhidas.appendChild(span)
    })
}

botaoSalvar.addEventListener('click', async () => {
    const postagem = {
        titulo: inputTitulo.value,
        descricao: inputDescricao.value,
        data_postagem: inputData.value,
        publico: inputPublico.checked,
        midia: midias,
        categoria: categorias,
        localizacao: locais,
        id_usuario: Number(localStorage.getItem('idUsuarioLogado'))
    }

    // EDITAR
    if (modoEdicao) {
        const atualizado = editarPostagem(postagem)
        if (atualizado) {
            alert('Postagem atualizada!')
            window.location.href = `../postagem/postagem.html?id=${idPostagemParaEditar}`
        } else {
            alert('Erro ao atualizar postagem.')
        }
        return
    }

    // CRIAR
    const criado = criarPostagem(postagem)
    if (criado) {
        alert('Postagem criada com sucesso!')
        window.location.reload()
    } else {
        alert('Erro ao criar postagem!')
    }
})

//Botão cancelar
botaoCancelar.addEventListener('click', () => {
    window.location.href = '../feed/feed.html'
})

// Se estiver editando
async function carregarPostagemParaEditar(id) {
    const resposta = await fetch(`http://localhost:3003/postagem/${id}`)
    postagemOriginal = await resposta.json()

    inputTitulo.value = postagemOriginal.titulo
    inputDescricao.value = postagemOriginal.descricao
    inputData.value = postagemOriginal.data_postagem
    inputPublico.checked = postagemOriginal.publico

    // IMAGEM
    if (postagemOriginal.midia?.length > 0) {
        previewImagem.src = postagemOriginal.midia[0]
        midias = [...postagemOriginal.midia]
    }

    // PAISES
    locais = [...postagemOriginal.localizacao]

    locais.forEach(id => {
        const option = selectPaises.querySelector(`option[value='${id}']`)
        if (option) option.selected = true
    })

    atualizarPaises()

    // CATEGORIAS
    categorias = [...postagemOriginal.categoria]

    categorias.forEach(id => {
        const option = selectCategoria.querySelector(`option[value='${id}']`)
        if (option) option.selected = true
    })

    atualizarCategorias()
}
