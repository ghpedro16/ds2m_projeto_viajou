'use strict'

// usuario logado
const idUsuarioLogado = localStorage.getItem('idUsuarioLogado')

const linkPerfil = document.getElementById('linkPerfil')
linkPerfil.addEventListener('click', () => {
    window.location.href = `../perfil/perfil.html?id=${idUsuarioLogado}`
})

let todosUsuarios = []
let usuarios = []
let postagens = []

// carregando usuarios para a pesquisa
async function carregarUsuarios() {
    try {
        const resposta = await fetch('http://localhost:8080/v1/viajou/usuario')
        const dados = await resposta.json()
        todosUsuarios = dados.itens.usuarios
    } catch (erro) {
        console.error('Erro ao carregar usuários:', erro)
    }
}

carregarUsuarios()

const inputPesquisa = document.getElementById('campoPesquisa')
const resultadoPesquisa = document.getElementById('resultadoPesquisa')
const cardsPostagens = document.querySelectorAll('.postagem')

inputPesquisa.addEventListener('input', pesquisa)

function pesquisa() {
    const texto = inputPesquisa.value.trim().toLowerCase()

    if (texto === "") {
        mostrarPostagens()
        limparResultado()
        return
    }

    esconderPostagens()
    const filtrados = filtrarUsuarios(texto)
    renderizarUsuarios(filtrados)
}

function filtrarUsuarios(texto) {
    return todosUsuarios.filter(user =>
        user.nome.toLowerCase().includes(texto) ||
        user.nome_usuario.toLowerCase().includes(texto)
    )
}

function criarCardUsuario(user) {
    const id_usuario = Number(user.id)

    const card = document.createElement('div')
    card.classList.add('cardUsuario')

    const fotoUsuario = document.createElement('img')
    fotoUsuario.src = user.url_foto
    fotoUsuario.onerror = () => fotoUsuario.src = '../img/icon_perfil.png'

    const divNomes = document.createElement('div')
    divNomes.classList.add('divNomes')

    const nome = document.createElement('strong')
    nome.textContent = user.nome

    const nomeUsuario = document.createElement('span')
    nomeUsuario.textContent = user.nome_usuario

    divNomes.append(nome, nomeUsuario)
    card.append(fotoUsuario, divNomes)

    card.addEventListener('click', () => {
        window.location.href = `../perfil/perfil.html?id=${id_usuario}`
    })

    return card
}

function renderizarUsuarios(lista) {
    limparResultado()

    if (lista.length === 0) {
        resultadoPesquisa.innerHTML = '<p>Nenhum usuário encontrado...</p>'
        return
    }

    lista.forEach(user => {
        resultadoPesquisa.appendChild(criarCardUsuario(user))
    })
}

function limparResultado() {
    resultadoPesquisa.innerHTML = ''
}

function esconderPostagens() {
    document.getElementById('listaPostagens').style.display = 'none'
}

function mostrarPostagens() {
    document.getElementById('listaPostagens').style.display = 'flex'
}

async function carregarDados() {
    try {
        const respostaUsuarios = await fetch('http://localhost:8080/v1/viajou/usuario')
        const dadosUsuarios = await respostaUsuarios.json()
        usuarios = dadosUsuarios.itens.usuarios

        const respostaPostagens = await fetch('http://localhost:8080/v1/viajou/postagem')
        const dadosPostagens = await respostaPostagens.json()
        postagens = dadosPostagens.itens.postagens

        montarFeed()

    } catch (erro) {
        console.error('Erro ao carregar dados:', erro)
    }
}

function montarFeed() {
    const container = document.getElementById('listaPostagens')
    container.innerHTML = ''

    postagens.forEach(post => {
        if (post.publico === 0) return

        const usuario = usuarios.find(u => Number(u.id) === Number(post.id_usuario))
        if (!usuario) return

        container.appendChild(criarPostagem(post, usuario))
    })
}

function criarPostagem(post, user) {

    const div = document.createElement('div')
    div.classList.add('postagem')

    // Superior Postagem
    const topo = document.createElement('div')
    topo.classList.add('superiorPostagem')

    const imgPerfil = document.createElement('img')
    imgPerfil.src = user.url_foto
    imgPerfil.classList.add('imagemPerfil')
    imgPerfil.onerror = () => imgPerfil.src = '../img/icon_perfil.png'

    const divNomedata = document.createElement('div')
    divNomedata.classList.add('divNomedata')

    const nome = document.createElement('span')
    nome.classList.add('nome')
    nome.textContent = user.nome

    const data = document.createElement('span')
    data.classList.add('data')
    data.textContent = formatarData(post.data_postagem.split('T')[0])

    divNomedata.append(nome, data)
    topo.append(imgPerfil, divNomedata)

    //Imagem
    const midia = document.createElement('img')
    midia.classList.add('imagemPostagem')
    midia.src = post.midia?.[0]?.url || '../img/no_image.png'
    midia.onerror = () => midia.src = '../img/no_image.png'

    //Inferior
    const inferior = document.createElement('div')
    inferior.classList.add('inferiorPostagem')

    const titulo = document.createElement('p')
    titulo.classList.add('titulo')
    titulo.textContent = post.titulo

    const icons = document.createElement('div')
    icons.classList.add('divIcons')

    const like = document.createElement('img')
    like.src = '../img/CoracaoVazio.svg'
    like.classList.add('interacaoPostagem')

    const chat = document.createElement('img')
    chat.src = '../img/Chat.svg'
    chat.classList.add('interacaoPostagem')

    const favorito = document.createElement('img')
    favorito.src = '../img/FavoritoVazio.svg'
    favorito.classList.add('interacaoPostagem')

    icons.append(like, chat, favorito)

    inferior.append(titulo, icons)

    div.append(topo, midia, inferior)

    div.addEventListener('click', () => {
        window.location.href = `../postagem/postagem.html?id=${post.id}`
    })

    return div
}

function formatarData(data) {
    return new Date(data + 'T00:00:00').toLocaleDateString('pt-BR')
}

carregarDados()
