const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');
const enterBtn = document.getElementById('enter')

registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});

loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});

async function usuarioLogin(event){
    event.preventDefault(); // impede recarregamento do formulário

    let usuario = document.getElementById('usuario').value;
    let senha = document.getElementById('senha').value;

    try {
        const resposta = await fetch(`http://localhost:8080/v1/viajou/login/usuario?usuario=${usuario}&senha=${senha}`);

        if (!resposta.ok) {
            alert("Usuário ou senha inválidos.");
            return;
        }

        const dados = await resposta.json(); // <- aqui sim vem o JSON

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

