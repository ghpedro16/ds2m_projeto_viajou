'use strict'

// Pegando o ID da URL
const params = new URLSearchParams(window.location.search);
const idPostagem = params.get("id")

let usuario = null;
let postagem = null;

export async function carregarDadosPostagem() {
    try {

        if (!idPostagem) {
            console.error("Nenhum ID de postagem encontrado")
            return;
        }

        // ====== PEGAR A POSTAGEM PELO ID ======
        const respostaPost = await fetch(`http://localhost:3003/postagem/${idPostagem}`);
        postagem = await respostaPost.json()

        // ====== PEGAR O USUÁRIO DONO DA POSTAGEM ======
        const respostaUsuario = await fetch(`http://localhost:8080/v1/viajou/usuario/${postagem.id_usuario}`);
        const dadosCompletosUsuario = await respostaUsuario.json()
        usuario = dadosCompletosUsuario.itens.usuario[0]

        criarTela(postagem, usuario)

    } catch (erro) {
        console.error('Erro ao carregar dados:', erro)
    }
}

function criarTela(post, user) {

    // Div principal
    const div = document.createElement('div')
    div.classList.add('postagem')

    // parte superior
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
    nome.textContent = user.nome;

    const data = document.createElement('span')
    data.classList.add('data')
    data.textContent = formatarData(post.data_postagem)

    nomeData.append(nome, data)
    divSuperior.append(imgPerfil, nomeData)

    // Div juntando o titulo e o botão
    const divtituloBotao = document.createElement('div')
    divtituloBotao.classList.add('divTituloBotao')
    
    // Titulo
    const titulo = document.createElement('p')
    titulo.classList.add('titulo')
    titulo.textContent = post.titulo

        // Botão editar
    const editar = document.createElement('button')
    editar.classList.add('botaoEditar')
    editar.textContent = 'Editar'

    // Imagem
    const imagem = document.createElement('img')
    imagem.src = post.midia[0]
    imagem.classList.add('imagemPostagem')
    imagem.onerror = () => imagem.src = '../img/no_image.jpg'

    //DIV Inferior Postagem
    const divInferior = document.createElement('div')
    divInferior.classList.add('inferiorPostagem')

    // Descrição
    const descricao = document.createElement('p')
    descricao.classList.add('descricao')
    descricao.textContent = post.descricao

    const like = document.createElement('img');
    like.src = '../img/CoracaoVazio.svg'

    const chat = document.createElement('img')
    chat.src = '../img/Chat.svg'

    const save = document.createElement('img')
    save.src = '../img/FavoritoVazio.svg'

    //Adiciona na divTituloBotao
    divtituloBotao.append(titulo, editar)

    // adiciona na div inferior
    divInferior.append(descricao, like, chat, save)

    // adiciona no container
    div.append(divSuperior, divtituloBotao, imagem, divInferior);

    // adiciona na tela
    document.getElementById('postagem').appendChild(div);
}

function formatarData(data) {
    return new Date(data).toLocaleDateString('pt-BR');
}

// Rodar ao abrir a página
carregarDadosPostagem();
