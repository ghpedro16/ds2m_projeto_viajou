'use strict'

import { verificarDono, podeVerPostagem } from '../../utils/authUtils.js'
import { atualizarPerfil } from '../../utils/apiUtils.js'
import { seguirUsuario } from '../../utils/apiUtils.js'

//Vai vir do localStorage futuramente
const idUsuarioLogado = localStorage.getItem('idUsuarioLogado')

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

    const dadosPerfil = document.getElementById('dadosPerfil')

    // Foto
    const imagemPerfil = document.createElement('img')
    imagemPerfil.src = user.url_foto
    imagemPerfil.onerror = () => {
        imagemPerfil.src = '../img/icon_perfil.webp';
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

    //Verificaão se o id do usuario é igual o do usuario logado
    const donoDoPerfil = verificarDono(Number(user.id), Number(idUsuarioLogado))

    if (donoDoPerfil) {
        // proprio perfil Mostra o botão Sair e Editar

        const btnSair = document.createElement('button')
        btnSair.textContent = 'Sair'
        divBotao.appendChild(btnSair)

        btnSair.addEventListener('click', () => {
            //Chamar função de deslogar a conta
            window.location.href = "../login/login.html";
        })

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

        btnSeguir.addEventListener('click', seguindoUsuario)
    }

    // Adicionndo no div principal
    dadosPerfil.appendChild(imagemPerfil)
    dadosPerfil.appendChild(alinhamento)
    dadosPerfil.appendChild(divBotao)
}

//Variavel que guarda todas as postagens
let todasPostagens = []

// CARREGAR TODAS AS POSTAGENS
async function carregarPostagem(idPerfilParaExibir) {

    const url = `http://localhost:8080/v1/viajou/postagem/usuario/${idPerfilParaExibir}`

    try {
        const resposta = await fetch(url)
        const dadosPostagens = await resposta.json()
        todasPostagens = dadosPostagens.itens.postagens

        todasPostagens.forEach(post => {
            criarPostagem(post, idUsuarioLogado)
        })

        //Botao popular
        const buttonPopular = document.getElementById('popular')
        buttonPopular.addEventListener('click', () => {
            buttonPopular.classList.toggle("ativo")
            filtrarPostagens()
        })

    } catch (erro) {
        console.error("Erro ao carregar postagens:", erro)
    }
}



// criando a postagem
function criarPostagem(dadosPostagem, idUsuarioLogado) {

    if (!podeVerPostagem(dadosPostagem, idUsuarioLogado)) {
        return
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
    imagem.src = dadosPostagem.midia[0].url   // primeira imagem da lista
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

    if (dadosPostagem.publico === 0 && donoDoPost) {
        //Imagem do cadeado
        const imagemCadeado = document.createElement('img')
        imagemCadeado.classList.add('cadeado')
        imagemCadeado.src = '../img/lock.svg'

        postagem.appendChild(imagemCadeado)
    }

    postagem.appendChild(imagemContainer)
    postagem.appendChild(inferior)

    conjuntoPostagens.appendChild(postagem)

    postagem.addEventListener('click', () => {
        window.location.href = `../postagem/postagem.html?id=${dadosPostagem.id}`
    })
}

//Verificando id dos dados para carregar
if (!idPerfilParaExibir) {
    let proprioPerfil = idUsuarioLogado
    carregarPerfil(proprioPerfil)
    carregarPostagem(proprioPerfil)
} else {
    carregarPerfil(idPerfilParaExibir)
    carregarPostagem(idPerfilParaExibir)
}

//Editando o perfil
// Abrir modal preenchendo com os dados do usuário
function abrirModalEditar(user) {

    document.getElementById('fundoModal').style.display = 'flex'

    // Pegando os inputs (não os valores)
    const inputNome = document.getElementById('inputNome')
    const inputNomeUsuario = document.getElementById('inputUser')
    const inputBiografia = document.getElementById('inputBiografia')
    const inputImagem = document.getElementById('foto')
    const previewImagem = document.getElementById('preview-image')

    let midia = []

    // Preenchendo o modal com os dados atuais
    inputNome.value = user.nome
    inputNomeUsuario.value = user.nome_usuario
    inputBiografia.value = user.biografia

    //Pegar imagem
    inputImagem.addEventListener('change', () => {
        const arquivo = inputImagem.files[0]
        if (!arquivo) return

        const url = URL.createObjectURL(arquivo)
        midia = [url]
        previewImagem.src = url
    })

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
            url_foto: inputImagem.value,

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
const selectPaises = document.getElementById('paises')

const selectCategoria = document.getElementById('categoria')

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


//Faz carregar só depois de tudo estar carregado
window.addEventListener('DOMContentLoaded', async () => {

    await carregarCategorias()
    await carregarPaises()

    selectCategoria.addEventListener('change', filtrarPostagens)
    selectPaises.addEventListener('change', filtrarPostagens)

    // FIltro e data
    const btnFiltroData = document.getElementById("btnFiltroData")

    const filtroDataContainer = document.getElementById("filtroDataContainer")

    const btnBuscarData = document.getElementById("btnBuscarData")


    btnFiltroData.addEventListener("click", () => {
        filtroDataContainer.style.display = "none"

        if (filtroDataContainer.style.display === "none") {
            filtroDataContainer.style.display = "flex" // mostrar
        } else {
            filtroDataContainer.style.display = "none" // escondee
        }
    })

    btnBuscarData.addEventListener("click", () => {
        const inicio = document.getElementById("dataInicio").value
        const fim = document.getElementById("dataFinal").value

        filtrarPostagensPorData(inicio, fim)

        // Fecha a tela
        filtroDataContainer.style.display = "none"
    })

    if (idPostagemParaEditar) {
        modoEdicao = true
        carregarPostagemParaEditar(idPostagemParaEditar)
    }
})



function filtrarPostagens() {
    const idCategoria = selectCategoria.value
    const idPais = selectPaises.value

    const conjuntoPostagens = document.getElementById('conjuntoPostagens')
    conjuntoPostagens.innerHTML = ''

    let filtradas = todasPostagens.filter(post => {

        const categoriaDaPostagem = post.categoria?.[0]?.id //o ? serve para devolver undefined se
        const localDaPostagem = post.localizacao?.[0]?.id   //der erro para não quebrar o código

        const categoriaOk =
            idCategoria === "" || categoriaDaPostagem == idCategoria

        const paisOk =
            idPais === "" || localDaPostagem == idPais

        return categoriaOk && paisOk
    })

    // Popular
    const popularSelecionado = document.getElementById("popular")?.classList.contains("ativo")
    if (popularSelecionado) {
        filtradas.sort((a, b) => b.quantidade_curtidas - a.quantidade_curtidas)
    }

    // criando postagem
    filtradas.forEach(post => {
        criarPostagem(post, idUsuarioLogado)
    })
}

// filtar por data
function filtrarPostagensPorData(dataInicio, dataFim) {

    const conjuntoPostagens = document.getElementById('conjuntoPostagens')
    conjuntoPostagens.innerHTML = ''

    // Converter datas para comparar
    let inicio = null;
    let fim = null;

    if (dataInicio) {
        inicio = new Date(dataInicio);
    }

    if (dataFim) {
        fim = new Date(dataFim);
    }

    let filtradas = todasPostagens.filter(post => {

        const dataPost = new Date(post.data_postagem);

        let inicioOk = true;
        let fimOk = true;

        if (inicio !== null) {
            if (!(dataPost >= inicio)) {
                inicioOk = false;
            }
        }

        if (fim !== null) {
            if (!(dataPost <= fim)) {
                fimOk = false;
            }
        }

        if (inicioOk && fimOk) {
            return true;
        } else {
            return false;
        }
    });


    //juntando categoria e pais
    const idCategoria = selectCategoria.value
    const idPais = selectPaises.value

    filtradas = filtradas.filter(post => {
        const categoriaDaPostagem = post.categoria?.[0]?.id
        const localDaPostagem = post.localizacao?.[0]?.id

        const categoriaOk =
            idCategoria === "" || categoriaDaPostagem == idCategoria

        const paisOk =
            idPais === "" || localDaPostagem == idPais

        return categoriaOk && paisOk
    })

    // popular
    const popularSelecionado =
        document.getElementById("popular")?.classList.contains("ativo")

    if (popularSelecionado) {
        filtradas.sort((a, b) => b.quantidade_curtidas - a.quantidade_curtidas)
    }

    // recriando as postagens
    filtradas.forEach(post => {
        criarPostagem(post, idUsuarioLogado)
    })
}

async function seguindoUsuario(){
    const seguindo = {
        id_usuario_seguindo: idUsuarioLogado,
        id_usuario_seguidor: idPerfilParaExibir
    }
    
    let seguindoCriado = seguirUsuario(seguindo)
    
    if (seguindoCriado) {
        alert('Usuário seguido com sucesso!')
    } else {
        alert('Erro ao seguir usuário!')
    }
}