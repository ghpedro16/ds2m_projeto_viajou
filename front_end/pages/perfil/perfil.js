'use strict'

async function carregarPerfil() {
    //No futuro quando tiver usuario logado, pegar o id dele do localStorage e passar na url
    const API_URL = 'http://localhost:3003/usuario'

    try {
        const resposta = await fetch(API_URL)
        const usuarios = await resposta.json()

        const usuario = usuarios[0] //provisório usando o primeiro usuario
        criarPerfil(usuario)

    } catch (erro) {
        console.error('Erro ao carregar perfil:', erro)
    }
}

function criarPerfil(user) {
    const dadosPerfil = document.querySelector('.dadosPerfil')

    // FOTO
    const img = document.createElement('img')
    img.src = user.url_foto

    // DIV PARA ALINHAMENTO
    const alinhamento = document.createElement('div')
    alinhamento.classList.add('alinhamento')

    // NOMES
    const nomes = document.createElement('div')
    nomes.classList.add('nomes')

    const nomeExibicao = document.createElement('span')
    nomeExibicao.classList.add('nomeExibicao')
    nomeExibicao.textContent = user.nome

    const nomeUsuario = document.createElement('span')
    nomeUsuario.classList.add('nomeUsuario')
    nomeUsuario.textContent = user.nome_usuario

    nomes.appendChild(nomeExibicao)
    nomes.appendChild(nomeUsuario)

    // INTERAÇÕES
    const interacoes = document.createElement('div')
    interacoes.classList.add('interacoes')

    const seguidores = document.createElement('span')
    seguidores.textContent = `Seguidores ${user.quantidade_seguidores}`

    const seguindo = document.createElement('span')
    seguindo.textContent = `Seguindo ${user.quantidade_seguindos}`

    const viagens = document.createElement('span')
    viagens.textContent = `Viagens ${user.quantidade_postagens}`

    interacoes.appendChild(seguidores)
    interacoes.appendChild(seguindo)
    interacoes.appendChild(viagens)

    // BIOGRAFIA
    const biografia = document.createElement('div')
    biografia.classList.add('biografia')
    biografia.textContent = user.biografia

    // Adicionando na div de alinhamento
    alinhamento.appendChild(nomes)
    alinhamento.appendChild(interacoes)
    alinhamento.appendChild(biografia)

    // BOTÃO
    const divBotao = document.createElement('div')
    divBotao.classList.add('botoes')

    const btnEditar = document.createElement('button')
    btnEditar.textContent = 'editar'

    divBotao.appendChild(btnEditar)

    // Adicionndo no div principal
    dadosPerfil.appendChild(img)
    dadosPerfil.appendChild(alinhamento)
    dadosPerfil.appendChild(divBotao)
}

carregarPerfil()

// async function carregarPostagem() {

//     const API_URL = 'http://localhost:3003/postagem'

//     try {
//         const resposta = await fetch(API_URL)
//         const postagens = await resposta.json()

//         const postagem = postagens[0] //Provisório
//         criarPostagem(postagem)
//     } catch (error) {
//         console.error("Erro ao carregar postagens:", erro)
//     }
// }

// function criarPostagem(postagem) {
//     const conjuntoPostagem = document.getElementById("conjuntoPostagens")

//     //div postagem
//     const postagem = document.createElement('div')
//     postagem.classList.add('conjuntoPostagens')

//     //imagem
//     const imagem
// }







