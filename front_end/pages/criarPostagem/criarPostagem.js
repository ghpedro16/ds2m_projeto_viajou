'use strict'

import { criarPostagem, editarPostagem, deletarPostagem } from '../../utils/apiUtils.js'

const params = new URLSearchParams(window.location.search)
const idPostagemParaEditar = params.get('idPostagem')

let modoEdicao = false
let postagemOriginal = null

const inputTitulo = document.getElementById('inputTitulo')
const inputDescricao = document.getElementById('inputDescricao')

const inputImagem = document.getElementById('foto')
const previewImagem = document.getElementById('preview-image')
const divImagensEscolhidas = document.getElementById('imagensEscolhidas')

const selectPaises = document.getElementById('paises')
const divPaisesEscolhidos = document.getElementById('paisesEscolhidos')

const selectCategoria = document.getElementById('categoria')
const divCategoriasEscolhidas = document.getElementById('categoriasEscolhidas')

const inputPublico = document.getElementById('publico')

const botaoSalvar = document.getElementById('salvar')
const botaoCancelar = document.getElementById('cancelar')
const botaoExcluir = document.getElementById('excluir')

let midias = []
let locais = []
let categorias = []

// Carregar categorias
async function carregarCategorias() {
    const resposta = await fetch('http://localhost:8080/v1/viajou/categoria')
    const json = await resposta.json()
    const lista = json.itens.categoria

    lista.forEach(categoria => {
        const option = document.createElement('option')
        option.value = categoria.id
        option.textContent = categoria.nome
        selectCategoria.appendChild(option)
    })
}

// Carregar paises
async function carregarPaises() {
    const resposta = await fetch('http://localhost:8080/v1/viajou/localizacao')
    const json = await resposta.json()
    const lista = json.itens.localizacao

    lista.forEach(localizacao => {
        const option = document.createElement('option')
        option.value = localizacao.id
        option.textContent = localizacao.pais
        selectPaises.appendChild(option)
    })
}

// Faz carregar só depois de tudo estar carregado
window.addEventListener('DOMContentLoaded', async () => {
    await carregarCategorias()
    await carregarPaises()

    if (idPostagemParaEditar) {
        modoEdicao = true
        carregarPostagemParaEditar(idPostagemParaEditar)
    }
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

inputImagem.addEventListener('change', () => {
    const arquivos = Array.from(inputImagem.files)

    arquivos.forEach(file => {
        const url = URL.createObjectURL(file)

        midias.push({
            url: url,
            file: file,
            tipo: file.type.startsWith('video') ? 'video' : 'image'
        })
    })

    atualizarArquivos()
    atualizarPreviewPrincipal()
})

function atualizarPreviewPrincipal() {
    const container = document.getElementById('preview-container')

    // Pausa vídeo e limpa div
    const oldVideo = container.querySelector('video')
    if (oldVideo) {
        oldVideo.pause()
        oldVideo.src = ''
    }

    container.innerHTML = ''

    // Recriando o label
    const label = document.createElement('label')
    label.classList.add('preview-label')
    label.setAttribute('for', 'foto')
    label.style.zIndex = 999
    container.appendChild(label)

    // Caso não tenha arquivos
    if (midias.length === 0) {
        const img = document.createElement('img')
        img.src = './img/preview-icon.png'
        img.classList.add('preview-image')
        container.appendChild(img)
        return
    }

    const ultima = midias[midias.length - 1]

    if (ultima.tipo === 'image') {
        const img = document.createElement('img')
        img.src = ultima.url
        img.classList.add('preview-image')
        container.appendChild(img)
    } else {
        const video = document.createElement('video')
        video.src = ultima.url
        video.controls = true
        video.loop = true
        video.classList.add('preview-video')

        label.style.height = '70%'
        container.appendChild(video)
    }
}

function atualizarArquivos() {
    divImagensEscolhidas.innerHTML = ''

    midias.forEach((midia, index) => {
        let elemento

        if (midia.tipo === 'image') {
            elemento = document.createElement('img')
            elemento.src = midia.url
            elemento.classList.add('escolhidoImagem')
        } else {
            elemento = document.createElement('video')
            elemento.src = midia.url
            elemento.classList.add('escolhidoVideo')
        }

        elemento.addEventListener('click', () => {
            midias.splice(index, 1)
            atualizarArquivos()
            atualizarPreviewPrincipal() // <<< ATUALIZA O QUADRADO GRANDE
        })

        divImagensEscolhidas.appendChild(elemento)
    })
}

function atualizarPaises() {
    divPaisesEscolhidos.innerHTML = ''

    locais.forEach(id => {
        const option = selectPaises.querySelector(`option[value='${id}']`)
        if (!option) return

        const span = document.createElement('span')
        span.textContent = option.textContent
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

        const span = document.createElement('span')
        span.textContent = option.textContent
        span.classList.add('categoriaEscolhida')

        span.addEventListener('click', () => {
            categorias = categorias.filter(c => c !== id)
            atualizarCategorias()
        })

        divCategoriasEscolhidas.appendChild(span)
    })
}

// Salvar
botaoSalvar.addEventListener('click', async () => {
    const postagem = {
        titulo: inputTitulo.value,
        descricao: inputDescricao.value,
        publico: inputPublico.checked ? 1 : 0,
        midia: midias.map(m => ({ url: m.url })),
        categoria: categorias.map(id => ({ id })),
        localizacao: locais.map(id => ({ id })),
        id_usuario: Number(localStorage.getItem('idUsuarioLogado'))
    }

    if (modoEdicao) {
        if (
            postagem.titulo != '' &&
            postagem.descricao != '' &&
            postagem.midia.length > 0 &&
            postagem.categoria.length > 0 &&
            postagem.localizacao.length > 0
        ) {
            const atualizado = await editarPostagem(postagem, idPostagemParaEditar)

            if (atualizado) {
                alert('Postagem atualizada!')
                window.location.href = `../postagem/postagem.html?id=${idPostagemParaEditar}`
            } else {
                alert('Erro ao atualizar postagem.')
            }
            return
        } else {
            alert('Alguns dados não foram passados')
        }
    }

    if (
        postagem.titulo != '' &&
        postagem.descricao != '' &&
        postagem.midia.length > 0 &&
        postagem.categoria.length > 0 &&
        postagem.localizacao.length > 0
    ) {
        const criado = await criarPostagem(postagem)
        if (criado) {
            alert('Postagem criada com sucesso!')
            window.location.href = '../perfil/perfil.html'
        } else {
            alert('Erro ao criar postagem!')
        }
    } else {
        alert('Alguns dados não foram passados')
    }
})

// botão cancelar
botaoCancelar.addEventListener('click', () => {
    window.location.href = '../feed/feed.html'
})

// carregar a postagem
async function carregarPostagemParaEditar(id) {
    const resposta = await fetch(`http://localhost:8080/v1/viajou/postagem/${id}`)
    const json = await resposta.json()

    postagemOriginal = json.itens.postagem[0]

    inputTitulo.value = postagemOriginal.titulo
    inputDescricao.value = postagemOriginal.descricao
    inputPublico.checked = postagemOriginal.publico === 1

    // midias
    midias = postagemOriginal.midia.map(m => m.url)
    if (midias.length > 0) previewImagem.src = midias[0]

    // localização
    locais = postagemOriginal.localizacao.map(l => l.id)
    locais.forEach(id => {
        const option = selectPaises.querySelector(`option[value='${id}']`)
        if (option) option.selected = true
    })
    atualizarPaises()

    // categorias
    categorias = postagemOriginal.categoria.map(c => c.id)
    categorias.forEach(id => {
        const option = selectCategoria.querySelector(`option[value='${id}']`)
        if (option) option.selected = true
    })

    botaoExcluir.style.visibility = 'visible'
    botaoExcluir.addEventListener('click', () => {
        const excluido = deletarPostagem(id)
        if (excluido) {
            alert('Postagem excluida!')
            window.location.href = '../perfil/perfil.html'
        } else {
            alert('Erro ao atualizar postagem.')
        }
        return
    })

    atualizarCategorias()
}
