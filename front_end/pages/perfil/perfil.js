'use strict'

async function carregarPerfil() {
    //No futuro quando tiver usuario logado, pegar o id dele do localStorage e passar na url
    const url = 'http://localhost:3003/usuario'

    try {
        const resposta = await fetch(url)
        const usuarios = await resposta.json()

        const usuario = usuarios[0] //provisório usando o primeiro usuario
        criarPerfil(usuario)

    } catch (erro) {
        console.error('Erro ao carregar perfil:', erro)
    }
}

function criarPerfil(user) {
    const dadosPerfil = document.getElementById('dadosPerfil')

    // Foto
    const imagemPerfil = document.createElement('img')
    imagemPerfil.src = user.url_foto
    imagemPerfil.onerror = () => {
        imagemPerfil.src = '../img/no_image.jpg';
    };

    // Div somente de alinhamento
    const alinhamento = document.createElement('div')
    alinhamento.classList.add('alinhamento')

    // Nomes
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

    // Interações
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

    // Biografia
    const biografia = document.createElement('div')
    biografia.classList.add('biografia')
    biografia.textContent = user.biografia

    // Adicionando na div de alinhamento
    alinhamento.appendChild(nomes)
    alinhamento.appendChild(interacoes)
    alinhamento.appendChild(biografia)

    // Botão
    const divBotao = document.createElement('div')
    divBotao.classList.add('botoes')

    const btnEditar = document.createElement('button')
    btnEditar.textContent = 'Editar'
    btnEditar.addEventListener('click', () => {
        abrirModalEditar(user)
    })

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

    const url = 'http://localhost:3003/postagem'

    try {
        const resposta = await fetch(url)
        todasPostagens = await resposta.json()

        todasPostagens.forEach(post => {
            criarPostagem(post)
        })

    } catch (erro) {
        console.error("Erro ao carregar postagens:", erro)
    }
}


// criando a postagem
function criarPostagem(dadosPostagem) {
    const conjuntoPostagens = document.getElementById("conjuntoPostagens")

    // div principal
    const postagem = document.createElement('div')
    postagem.classList.add('postagem')

    //div da imagem mais do overlay
    const imagemContainer = document.createElement("div")
    imagemContainer.classList.add("imagemContainer")

    // Imagem
    const imagem = document.createElement('img')
    imagem.classList.add('imagemPostagem')
    imagem.src = dadosPostagem.midia[0]   // primeira imagem da lista
    imagem.alt = "Imagem da postagem"
    imagem.onerror = () => {
        imagem.src = '../img/no_image.jpg';
    };

    // Parte inferior
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

    if (dadosPostagem.publico == false) {
        //Imagem do cadeado
        const imagemCadeado = document.createElement('img')
        imagemCadeado.classList.add('cadeado')
        imagemCadeado.src = '../img/lock.svg'

        postagem.appendChild(imagemCadeado)
    }

    postagem.appendChild(imagemContainer)
    postagem.appendChild(inferior)

    conjuntoPostagens.appendChild(postagem)
}
carregarPostagem()


//Editando o perfil
// Abrir modal preenchendo com os dados do usuário
function abrirModalEditar(user) {

    document.getElementById('fundoModal').style.display = 'flex'

    // Pegando os inputs (não os valores)
    const inputNome = document.getElementById('inputNome')
    const inputNomeUsuario = document.getElementById('inputUser')
    const inputBiografia = document.getElementById('inputBiografia')

    // Preenchendo o modal com os dados atuais
    inputNome.value = user.nome
    inputNomeUsuario.value = user.nome_usuario
    inputBiografia.value = user.biografia

    // Botões
    const botaoCancelar = document.getElementById('botaoCancelar')
    botaoCancelar.addEventListener('click', fecharModal)

    const botaoSalvar = document.getElementById('botaoSalvar')
    botaoSalvar.addEventListener('click', () => {
        const id = user.id
        const dados = {
            ...user,
            nome: inputNome.value,
            nome_usuario: inputNomeUsuario.value,
            biografia: inputBiografia.value
        }

        const atualizado = atualizarPerfil(id, dados)
        if(atualizado) {
            fecharModal()
        } else {
            alert('Erro ao atualizar dados!')
        }
    })
}

// Fechar modal
function fecharModal() {
    document.getElementById('fundoModal').style.display = 'none'
}

async function atualizarPerfil(id, dados) {
    const url = `http://localhost:3003/usuario/${id}`

    const options = {
        method: "PUT",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify(dados)
    }

    const response = await fetch(url, options)


    return response.ok
}