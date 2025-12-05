'use strict'

let todosUsuarios = []

async function carregarUsuarios() {
    try {
        const resposta = await fetch("http://localhost:3003/usuario")
        todosUsuarios = await resposta.json()
    } catch (erro) {
        console.error("Erro ao carregar usuários:", erro)
    }
}

carregarUsuarios()

const inputPesquisa = document.getElementById("campoPesquisa")
const resultadoPesquisa = document.getElementById("resultadoPesquisa")
const cardsPostagens = document.querySelectorAll(".postagem")

//Input aciona com cada letra digitada, assim conseguindo limpar as postagens
inputPesquisa.addEventListener("input", pesquisa)

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

    const card = document.createElement("div")
    card.classList.add("cardUsuario")

    // foto
    const fotoUsuario = document.createElement("img")
    fotoUsuario.src = user.url_foto

    // div que guarda nomes
    const divNomes = document.createElement("div")
    divNomes.classList.add('divNomes')

    // nome exibido
    const nome = document.createElement("strong")
    nome.textContent = user.nome

    // nome de usuário
    const nomeUsuario = document.createElement("span")
    nomeUsuario.textContent = user.nome_usuario

    // adicionando filhos
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
        resultadoPesquisa.innerHTML = "<p>Nenhum usuário encontrado...</p>"
        return
    }

    lista.forEach(user => {
        const card = criarCardUsuario(user)
        resultadoPesquisa.appendChild(card)
    })
}


function limparResultado() {
    resultadoPesquisa.innerHTML = ""
}

function esconderPostagens() {
    const container = document.getElementById("listaPostagens")
    container.style.display = "none"
}

function mostrarPostagens() {
        const container = document.getElementById("listaPostagens")
    container.style.display = "flex"
}



let usuarios = []
let postagens = []

async function carregarDados() {
    try {
        const respostaUsuarios = await fetch("http://localhost:3003/usuario")
        usuarios = await respostaUsuarios.json()

        const respostaPostagens = await fetch("http://localhost:3003/postagem")
        postagens = await respostaPostagens.json()

        montarFeed()

    } catch (erro) {
        console.error("Erro ao carregar dados:", erro)
    }
}

function montarFeed() {
    const container = document.getElementById("listaPostagens")
    container.innerHTML = ""

    postagens.forEach(post => {
        const usuario = usuarios.find(usuario => Number(usuario.id) === Number(post.id_usuario))

        if (!usuario) return

        const elemento = criarPostagem(post, usuario)
        container.appendChild(elemento)
    })
}

function criarPostagem(post, user) {

    const div = document.createElement("div")
    div.classList.add("postagem")

    // ======= PARTE SUPERIOR =======
    const topo = document.createElement("div")
    topo.classList.add("superiorPostagem")

    const imgPerfil = document.createElement("img")
    imgPerfil.src = user.url_foto
    imgPerfil.classList.add("imagemPerfil")
    imgPerfil.onerror = () => {
        imgPerfil.src = '../img/no_image.jpg';
    };

    const nome = document.createElement("span")
    nome.classList.add("nome")
    nome.textContent = user.nome

    const data = document.createElement("span")
    data.classList.add("data")
    data.textContent = formatarData(post.data_postagem)

    topo.append(imgPerfil, nome, data)

    const midia = document.createElement("img")
    midia.src = post.midia[0]
    midia.classList.add("imagemPostagem")
    midia.onerror = () => {
        midia.src = '../img/no_image.jpg';
    };


    // ======= PARTE INFERIOR =======
    const inferior = document.createElement("div")
    inferior.classList.add("inferiorPostagem")

    const desc = document.createElement("p")
    desc.classList.add("descricao")
    desc.textContent = post.descricao

    const like = document.createElement("img")
    like.src = "../img/CoracaoVazio.svg"
    like.classList.add("interacaoPostagem")

    const chat = document.createElement("img")
    chat.src = "../img/Chat.svg"
    chat.classList.add("interacaoPostagem")

    const save = document.createElement("img")
    save.src = "../img/FavoritoVazio.svg"
    save.classList.add("interacaoPostagem")

    inferior.append(desc, like, chat, save)

    // juntar tudo
    div.append(topo, midia, inferior)
    return div
}

function formatarData(data) {
    return new Date(data).toLocaleDateString("pt-BR")
}

carregarDados()