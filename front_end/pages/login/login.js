import { criarUsuario } from '../../utils/apiUtils.js'

const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');
const enterBtn = document.getElementById('enter');
const createBtn = document.getElementById('create');

//Import dos inputs de cadastro
const inputNome = document.getElementById('nome');
const inputUsername = document.getElementById('username');
const inputEmail = document.getElementById('email');
const inputSenha = document.getElementById('nova-senha');
const inputDataNasc = document.getElementById('data-nascimento');

registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});

loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});

async function usuarioLogin(event){
    event.preventDefault();

    let usuario = document.getElementById('usuario').value;
    let senha = document.getElementById('senha').value;

    try {
        const resposta = await fetch(`http://localhost:8080/v1/viajou/login/usuario?usuario=${usuario}&senha=${senha}`);

        if (!resposta.ok) {
            alert("Usuário ou senha inválidos.");
            return;
        }

        const dados = await resposta.json();

        const id = dados.itens.usuario[0].id;
        console.log("Login bem-sucedido", id);

        localStorage.setItem('idUsuarioLogado', id);
        window.location.href = "../feed/feed.html";

    } catch (erro) {
        console.error("Erro na requisição:", erro);
        alert("Erro ao conectar com o servidor.");
    }
}

enterBtn.addEventListener('click', usuarioLogin);



createBtn.addEventListener('click', async () =>{

    const usuario = {
        nome: inputNome.value,
        email: inputEmail.value,
        nome_usuario: inputUsername.value,
        data_nascimento: inputDataNasc.value,
        senha: inputSenha.value,
        biografia: "",
        url_foto: ""
    }

    let usuarioCriado = criarUsuario(usuario)

    if (usuarioCriado) {
        alert('Usuário criado com sucesso!')
    } else {
        alert('Erro ao criar usuário!')
    }
})