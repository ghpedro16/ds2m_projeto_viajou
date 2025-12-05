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
    cardsPostagens.forEach(card => card.style.display = "none")
}

function mostrarPostagens() {
    cardsPostagens.forEach(card => card.style.display = "flex")
}