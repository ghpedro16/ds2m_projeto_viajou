'use strict'

import { verificarDono } from '../../utils/authUtils.js'

// Pegando o ID da URL
const params = new URLSearchParams(window.location.search)
const idPostagem = params.get("id")

let usuario = null
let postagem = null


export async function carregarDadosPostagem() {
    try {
        if (!idPostagem) {
            console.error("Nenhum ID de postagem encontrado")
            return
        }

        // pegando a postagem
        const respostaPost = await fetch(`http://localhost:8080/v1/viajou/postagem/${idPostagem}`)
        const dadosPost = await respostaPost.json()

        postagem = dadosPost.itens.postagem[0]

        // pegando o usuario
        const respostaUsuario = await fetch(`http://localhost:8080/v1/viajou/usuario/${postagem.id_usuario}`)
        const dadosUsuario = await respostaUsuario.json()

        usuario = dadosUsuario.itens.usuario[0]

        criarTela(postagem, usuario)

    } catch (erro) {
        console.error('Erro ao carregar dados:', erro)
    }
}

function criarTela(post, user) {

    const id = post.id

    // Div principal
    const div = document.createElement('div')
    div.classList.add('postagem')

    // Parte superior
    const divSuperior = document.createElement('div')
    divSuperior.classList.add('superiorPostagem')

    // Imagem perfil
    const imgPerfil = document.createElement('img')
    imgPerfil.src = user.url_foto
    imgPerfil.classList.add('imagemPerfil')
    imgPerfil.onerror = () => imgPerfil.src = '../img/no_image.jpg'

    const nomeData = document.createElement('div')
    nomeData.classList.add('divNomedata')

    const nome = document.createElement('strong')
    nome.classList.add('nome')
    nome.textContent = user.nome

    const data = document.createElement('span')
    data.classList.add('data')
    data.textContent = formatarData(post.data_postagem.split('T')[0])

    nomeData.append(nome, data)
    divSuperior.append(imgPerfil, nomeData)

    // Div juntando o título e botão
    const divTituloBotao = document.createElement('div')
    divTituloBotao.classList.add('divTituloBotao')

    // Título
    const titulo = document.createElement('p')
    titulo.classList.add('titulo')
    titulo.textContent = post.titulo

    divTituloBotao.appendChild(titulo)

    // Verificação se é dono
    const idUsuarioLogado = localStorage.getItem('idUsuarioLogado')
    const donoDaPostagem = verificarDono(Number(user.id), Number(idUsuarioLogado))

    if (donoDaPostagem) {
        const editar = document.createElement('button')
        editar.classList.add('botaoEditar')
        editar.textContent = 'Editar'

        editar.addEventListener('click', () => {
            window.location.href = `../criarPostagem/criarPostagem.html?idPostagem=${id}`
        })

        divTituloBotao.appendChild(editar)
    }

    const carrossel = document.createElement('div')
    carrossel.classList.add('carrossel')

    let indice = 0

    const btnVoltar = document.createElement('button')
    btnVoltar.textContent = '<'
    btnVoltar.classList.add('carrossel-btn', 'left')

    const imgCarrossel = document.createElement('img')
    imgCarrossel.classList.add('imagemPostagem')
    imgCarrossel.src = post.midia[0].url
    imgCarrossel.onerror = () => imgCarrossel.src = '../img/no_image.jpg'

    const btnAvancar = document.createElement('button')
    btnAvancar.textContent = '>'
    btnAvancar.classList.add('carrossel-btn', 'right')

    btnAvancar.addEventListener('click', () => {
        indice = (indice + 1) % post.midia.length
        imgCarrossel.src = post.midia[indice].url
    })

    btnVoltar.addEventListener('click', () => {
        indice = (indice - 1 + post.midia.length) % post.midia.length
        imgCarrossel.src = post.midia[indice].url
    })

    carrossel.append(btnVoltar, imgCarrossel, btnAvancar)

    //Div inferior
    const divInferior = document.createElement('div')
    divInferior.classList.add('inferiorPostagem')

    const descricao = document.createElement('p')
    descricao.classList.add('descricao')
    descricao.textContent = post.descricao

    const icons = document.createElement('div')
    icons.classList.add('divIcons')

    const like = document.createElement('img')
    like.src = '../img/CoracaoVazio.svg'

    const chat = document.createElement('img')
    chat.src = '../img/Chat.svg'

    const favorito = document.createElement('img')
    favorito.src = '../img/FavoritoVazio.svg'

    icons.append(like, chat, favorito)

    divInferior.append(descricao, icons)


    //Localizações
    const divLocalizacao = document.createElement('div')
    divLocalizacao.classList.add('localizacao')

    const lblLocal = document.createElement('strong')
    lblLocal.textContent = 'Localizações'

    const conjuntoLocalizacoes = document.createElement('div')
    conjuntoLocalizacoes.classList.add('conjuntoLocalizacao')

    post.localizacao.forEach(loc => {
        const nomePais = document.createElement('span')
        nomePais.classList.add('pais-item')
        nomePais.textContent = loc.pais  // <--- CORRETO
        conjuntoLocalizacoes.appendChild(nomePais)
    })

    divLocalizacao.append(lblLocal, conjuntoLocalizacoes)

    // Categorias
    const divCategoria = document.createElement('div')
    divCategoria.classList.add('categoria')

    const lblCategoria = document.createElement('strong')
    lblCategoria.textContent = 'Categorias'

    const conjuntoCategorias = document.createElement('div')
    conjuntoCategorias.classList.add('conjuntoCategoria')

    post.categoria.forEach(cat => {
        const nomeCategoria = document.createElement('span')
        nomeCategoria.classList.add('categoria-item')
        nomeCategoria.textContent = cat.nome   // <--- CORRETO
        conjuntoCategorias.appendChild(nomeCategoria)
    })

    divCategoria.append(lblCategoria, conjuntoCategorias)

    div.append(
        divSuperior,
        divTituloBotao,
        carrossel,
        divInferior,
        divLocalizacao,
        divCategoria
    )

    document.getElementById('postagem').appendChild(div)
}

function formatarData(data) {
    return new Date(data + "T00:00:00").toLocaleDateString('pt-BR')
}

carregarDadosPostagem()
