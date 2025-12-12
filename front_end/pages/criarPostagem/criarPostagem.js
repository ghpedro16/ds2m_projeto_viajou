'use strict'

import { criarPostagem, editarPostagem, deletarPostagem, uploadImageToAzure, deletarImagemAzure } from '../../utils/apiUtils.js'

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
            atualizarPreviewPrincipal()
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

async function processarMidiasDaPostagem(midias, midiasOriginais = []) {

    const midiasNovas = []
    const midiasMantidas = []

    // separando quais midias existem e quais são novas
    for (const m of midias) {
        if (m.file) {
            midiasNovas.push(m) //midias novas
        } else {
            midiasMantidas.push(m) //midias que já existem
        }
    }

    // Verificando mídias removidas
    if (midiasOriginais.length > 0) {
        const midiasRemovidas = midiasOriginais.filter(old =>
            !midiasMantidas.some(nova => nova.url === old.url)
        )

        // deletar as removidas
        for (const removida of midiasRemovidas) {
            const nomeArquivo = removida.url.split('/').pop()

            try {
                await deletarImagemAzure({
                    storageAccount: 'midias',
                    containerName: 'midias',
                    file: nomeArquivo,
                    sasToken: 'sp=cwd&st=2025-12-12T11:14:11Z&se=2025-12-18T02:50:00Z&sv=2024-11-04&sr=c&sig=40p7voflKqBTtYHPWNxDoVMqyaFwDGhE7fqBwUeW3Gs%3D'
                })
            } catch (erro) {
                console.warn('Erro ao apagar imagem removida:', erro)
            }
        }
    }

    // Upload das mídias novas
    for (const nova of midiasNovas) {

        const uploadParams = {
            storageAccount: 'midias',
            containerName: 'midias',
            file: nova.file,
            sasToken: 'sp=cwd&st=2025-12-12T11:14:11Z&se=2025-12-18T02:50:00Z&sv=2024-11-04&sr=c&sig=40p7voflKqBTtYHPWNxDoVMqyaFwDGhE7fqBwUeW3Gs%3D'
        }

        try {
            const uploadedUrl = await uploadImageToAzure(uploadParams)
            nova.url = uploadedUrl // pega a url da azure
        } catch (erro) {
            console.error('Erro ao subir imagem:', erro)
        }
    }

    // Retornar lista final
    return [
        ...midiasMantidas.map(m => ({ url: m.url })), // já existiam
        ...midiasNovas.map(m => ({ url: m.url }))     // agora com URL da azure
    ]
}



// Salvar
botaoSalvar.addEventListener('click', async () => {
    try {
        let ok = false

        if (modoEdicao) {

            // processa usando as mídias originais
            const midiasFinal = await processarMidiasDaPostagem(
                midias,
                postagemOriginal.midia
            )

            const dadosEdicao = {
                titulo: inputTitulo.value,
                descricao: inputDescricao.value,
                publico: inputPublico.checked ? 1 : 0,
                categoria: categorias.map(id => ({ id })),
                localizacao: locais.map(id => ({ id })),
                midia: midiasFinal
            }

            ok = await editarPostagem(dadosEdicao, idPostagemParaEditar)

            if (ok) {
                alert('Post atualizado com sucesso!')
                window.location.href = `../postagem/postagem.html?idPostagem=${idPostagemParaEditar}`
            } else {
                alert('Erro ao atualizar postagem.')
            }

        } else {

            // processa sem mídias originais
            const midiasFinal = await processarMidiasDaPostagem(midias, [])

            const dados = {
                titulo: inputTitulo.value,
                descricao: inputDescricao.value,
                publico: inputPublico.checked ? 1 : 0,
                id_usuario: Number(localStorage.getItem('idUsuarioLogado')),
                categoria: categorias.map(id => ({ id })),
                localizacao: locais.map(id => ({ id })),
                midia: midiasFinal
            }

            ok = await criarPostagem(dados)

            if (ok) {
                alert('Post criado com sucesso!')
                window.location.href = '../perfil/perfil.html'
            } else {
                alert('Erro ao criar postagem.')
            }
        }

    } catch (error) {
        console.error('Erro:', error)
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
    midias = postagemOriginal.midia.map(m => ({
        url: m.url,
        file: null, // null porque já existe no servidor
        tipo: m.url.endsWith('.mp4') ? 'video' : 'image'
    }))

    atualizarArquivos()
    atualizarPreviewPrincipal()

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
    botaoExcluir.onclick = async () => {
        if (!confirm('Tem certeza que deseja excluir esta postagem?')) return

        // apagar mídias da Azure
        for (const m of postagemOriginal.midia) {
            const nomeArquivo = m.url.split('/').pop().split('?')[0]

            try {
                await deletarImagemAzure({
                    storageAccount: 'midias',
                    containerName: 'midias',
                    file: nomeArquivo,
                    sasToken: 'sp=cwd&st=2025-12-12T11:14:11Z&se=2025-12-18T02:50:00Z&sv=2024-11-04&sr=c&sig=40p7voflKqBTtYHPWNxDoVMqyaFwDGhE7fqBwUeW3Gs%3D'
                })
            } catch (error) {
                console.warn('Erro ao excluir imagem da Azure:', error)
            }
        }

        // excluir no backend
        const excluido = await deletarPostagem(idPostagemParaEditar)

        if (excluido) {
            alert('Postagem excluída!')
            window.location.href = '../perfil/perfil.html'
        } else {
            alert('Erro ao excluir postagem.')
        }
    }

    atualizarCategorias()
}