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
    const imagemPerfil = document.createElement('img')
    imagemPerfil.src = user.url_foto
    imagemPerfil.onerror = () => {
        imagemPerfil.src = '../img/no_image.jpg';
    };

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
    dadosPerfil.appendChild(imagemPerfil)
    dadosPerfil.appendChild(alinhamento)
    dadosPerfil.appendChild(divBotao)
}

carregarPerfil()

//Variavel que guarda todas as postagens
let todasPostagens = []

// CARREGAR TODAS AS POSTAGENS
async function carregarPostagem() {

    const API_URL = 'http://localhost:3003/postagem'

    try {
        const resposta = await fetch(API_URL)
        todasPostagens = await resposta.json()

        todasPostagens.forEach(post => {
            criarPostagem(post)
        })

    } catch (erro) {
        console.error("Erro ao carregar postagens:", erro)
    }
}


// CRIAR UMA POSTAGEM
function criarPostagem(dadosPostagem) {
    const conjuntoPostagens = document.getElementById("conjuntoPostagens")

    // DIV PRINCIPAL
    const postagem = document.createElement('div')
    postagem.classList.add('postagem')

    //DIV da imagem mais do overlay
    const imagemContainer = document.createElement("div")
    imagemContainer.classList.add("imagemContainer")

    // IMAGEM
    const imagem = document.createElement('img')
    imagem.classList.add('imagemPostagem')
    imagem.src = dadosPostagem.midia[0]   // primeira imagem da lista
    imagem.alt = "Imagem da postagem"
    imagem.onerror = () => {
        imagem.src = '../img/no_image.jpg';
    };

    // PARTE INFERIOR
    const inferior = document.createElement('div')
    inferior.classList.add('inferiorPostagem')

    const descricao = document.createElement('p')
    descricao.classList.add('descricao')
    descricao.textContent = dadosPostagem.titulo

    const like = document.createElement('img')
    like.src = "../img/CoracaoVazio.svg"
    like.classList.add('interacaoPostagem')

    const chat = document.createElement('img')
    chat.src = "../img/Chat.svg"
    chat.classList.add('interacaoPostagem')

    const favorito = document.createElement('img')
    favorito.src = "../img/FavoritoVazio.svg"
    favorito.classList.add('interacaoPostagem')

    const overlay = document.createElement("div")
    overlay.classList.add("overlayPostagem")
    overlay.textContent = "Clique para ver mais"

    // Adicionando
    inferior.appendChild(descricao)
    inferior.appendChild(like)
    inferior.appendChild(chat)
    inferior.appendChild(favorito)

    imagemContainer.appendChild(imagem)
    imagemContainer.appendChild(overlay)

    postagem.appendChild(imagemContainer)
    postagem.appendChild(inferior)

    conjuntoPostagens.appendChild(postagem)
}

// CHAMAR FUNÇÃO
carregarPostagem()


//Editando o perfil
