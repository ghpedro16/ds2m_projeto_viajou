'use strict'

import { verificarDono, podeVerPostagem } from '../../utils/authUtils.js'
import { atualizarPerfil } from '../../utils/apiUtils.js'

//Vai vir do localStorage futuramente
const idUsuarioLogado = localStorage.getItem('idUsuarioLogado');

const params = new URLSearchParams(window.location.search)
const idPerfilParaExibir = params.get("id")

async function carregarPerfil(id) {
    const url = `http://localhost:8080/v1/viajou/usuario/${id}`

    try {
        const resposta = await fetch(url)
        const dadosAPI = await resposta.json()
        const usuario = dadosAPI.itens.usuario[0]

        criarPerfil(usuario, idUsuarioLogado)

    } catch (erro) {
        console.error('Erro ao carregar perfil:', erro)
    }
}

async function criarPerfil(user, idUsuarioLogado) {

    //Verificaão se o id do usuario é igual o do usuario logado
    const donoDoPerfil = Number(user.id) == Number(idUsuarioLogado)

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

    if (donoDoPerfil) {
        // PERFIL PRÓPRIO: Mostra o botão "Editar"
        const btnEditar = document.createElement('button')
        btnEditar.textContent = 'Editar'
        divBotao.appendChild(btnEditar)

        btnEditar.addEventListener('click', () => {
            abrirModalEditar(user)
        })
    } else {
        // PERFIL DE TERCEIRO: Mostra o botão "Seguir"
        const btnSeguir = document.createElement('button')
        btnSeguir.textContent = 'Seguir'

        divBotao.appendChild(btnSeguir)
    }

    // Adicionndo no div principal
    dadosPerfil.appendChild(imagemPerfil)
    dadosPerfil.appendChild(alinhamento)
    dadosPerfil.appendChild(divBotao)
}
carregarPerfil(idPerfilParaExibir)

//Variavel que guarda todas as postagens
let todasPostagens = []

// CARREGAR TODAS AS POSTAGENS
async function carregarPostagem() {
    const url = 'http://localhost:3003/postagem'

    try {
        const resposta = await fetch(url)
        todasPostagens = await resposta.json()

        todasPostagens.forEach(post => {
            criarPostagem(post, idUsuarioLogado)
        })

        //Botao popular
        const buttonPopular = document.getElementById('popular')
        buttonPopular.addEventListener('click', () => {
            const postagensPorLike = filtroPopular(todasPostagens)

            const conjuntoPostagens = document.getElementById("conjuntoPostagens")
            conjuntoPostagens.innerHTML = ''

            postagensPorLike.forEach(post => {
                criarPostagem(post, idUsuarioLogado)
            })
        })

    } catch (erro) {
        console.error("Erro ao carregar postagens:", erro)
    }
}


// criando a postagem
function criarPostagem(dadosPostagem, idUsuarioLogado) {

    if (!podeVerPostagem(dadosPostagem, idUsuarioLogado)) {
        return;
    }

    const donoDoPost = verificarDono(dadosPostagem.id_usuario, idUsuarioLogado)

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

    if (dadosPostagem.publico === false && donoDoPost) {
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
        const { id, ...usuarioSemId } = user
        const dados = {
            ...usuarioSemId,
            nome: inputNome.value,
            nome_usuario: inputNomeUsuario.value,
            biografia: inputBiografia.value,

            //Correção do formato das datas
            data_nascimento: usuarioSemId.data_nascimento.split("T")[0], //Isso separa a data em um array, deixando a data no modelo correto
            data_cadastro: usuarioSemId.data_cadastro.split("T")[0] //["2000-05-12", "00:00:00.000Z"]
        }

        const atualizado = atualizarPerfil(id, dados)
        if (atualizado) {
            fecharModal()
            window.location.reload();
        } else {
            alert('Erro ao atualizar dados!')
        }
    })
}

// Fechar modal
function fecharModal() {
    document.getElementById('fundoModal').style.display = 'none'
}

//Filtros
function filtroPopular(todasPostagens) {
    const postagemFiltrada = [...todasPostagens] //os 3 pontos é para fazer uma copia, não modificando o original

    postagemFiltrada.sort((a, b) => b.quantidade_curtidas - a.quantidade_curtidas);
    //.sort utilizado para ordernar o array
    //verifica se o resultado de b for positivo ele vem antes do a, se for negativo o a vem na frente

    return postagemFiltrada;
}