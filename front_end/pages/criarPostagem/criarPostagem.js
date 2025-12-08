'use strict'

import { criarPostagem } from '../../utils/apiUtils.js'

// ----------------------
// ELEMENTOS
// ----------------------
const inputTitulo = document.getElementById('inputTitulo');
const inputDescricao = document.getElementById('inputDescricao');

const inputImagem = document.getElementById('foto');
const previewImagem = document.getElementById('preview-image');

const selectPaises = document.getElementById('paises');
const divPaisesEscolhidos = document.getElementById('paisesEscolhidos');

const selectCategoria = document.getElementById('categoria');
const divCategoriasEscolhidas = document.getElementById('categoriasEscolhidas');

const inputData = document.getElementById('inputData');

const inputPublico = document.getElementById('publico');

const botaoSalvar = document.getElementById('salvar');
const botaoCancelar = document.getElementById('cancelar');

async function carregarCategorias() {
    const resposta = await fetch(`http://localhost:3003/categoria`);
    const lista = await resposta.json();


    lista.forEach(categoria => {
        const option = document.createElement("option");
        option.value = categoria.id;
        option.textContent = categoria.nome;
        selectCategoria.appendChild(option);
    });
}

async function carregarPaises() {
    const resposta = await fetch(`http://localhost:3003/localizacao`);
    const lista = await resposta.json();

    lista.forEach(localizacao => {
        const option = document.createElement("option");
        option.value = localizacao.id;
        option.textContent = localizacao.pais;
        selectPaises.appendChild(option);
    });
}

let midias = [];
let locais = [];
let categorias = [];

window.addEventListener("DOMContentLoaded", () => {
    carregarCategorias();
    carregarPaises();
});


// ----------------------
// PREVIEW IMAGEM
// ----------------------
inputImagem.addEventListener("change", () => {
    const arquivo = inputImagem.files[0];
    if (!arquivo) return;

    const url = URL.createObjectURL(arquivo);

    // alternar imagem (clica 2x → some)
    if (midias.includes(url)) {
        midias = [];
        previewImagem.src = "./img/preview-icon.png";
        return;
    }

    midias = [url];
    previewImagem.src = url;
});


// ----------------------
// LOCAIS (CRIADOS PELO JS)
// ----------------------
selectPaises.addEventListener("change", () => {
    const id = Number(selectPaises.value);
    if (!id) return;

    if (locais.includes(id)) {
        locais = locais.filter(l => l !== id);
    } else {
        locais.push(id);
    }

    atualizarPaises();
});

function atualizarPaises() {
    divPaisesEscolhidos.innerHTML = "";

    locais.forEach(id => {
        const nome = selectPaises.querySelector(`option[value="${id}"]`).textContent;

        const span = document.createElement("span");
        span.textContent = nome;
        span.classList.add("pais-item");

        span.addEventListener("click", () => {
            locais = locais.filter(l => l !== id);
            atualizarPaises();
        });

        divPaisesEscolhidos.appendChild(span);
    });
}


// ----------------------
// CATEGORIAS (CRIADAS PELO JS)
// ----------------------
selectCategoria.addEventListener("change", () => {
    const id = Number(selectCategoria.value);
    if (!id) return;

    if (categorias.includes(id)) {
        categorias = categorias.filter(c => c !== id);
    } else {
        categorias.push(id);
    }

    atualizarCategorias();
});

function atualizarCategorias() {
    divCategoriasEscolhidas.innerHTML = "";

    categorias.forEach(id => {
        const nome = selectCategoria.querySelector(`option[value="${id}"]`).textContent;

        const span = document.createElement("span");
        span.textContent = nome;
        span.classList.add("categoriaEscolhida");

        span.addEventListener("click", () => {
            categorias = categorias.filter(c => c !== id);
            atualizarCategorias();
        });

        divCategoriasEscolhidas.appendChild(span);
    });
}


// ----------------------
// SALVAR POSTAGEM
// ----------------------
botaoSalvar.addEventListener("click", async () => {
    const postagem = {
        titulo: inputTitulo.value,
        descricao: inputDescricao.value,
        data_postagem: inputData.value,
        publico: inputPublico.checked,
        midia: midias, //Funcionando mais ou menos
        categoria: categorias,
        localizacao: locais,
        id_usuario: Number(localStorage.getItem("idUsuarioLogado"))
    };

    const criado = criarPostagem(postagem)
    if (criado) {
        alert('Postagem criada com sucesso!')
        window.location.reload();
    } else {
        alert('Erro ao criar postagem!')
    }
});


// ----------------------
// CANCELAR
// ----------------------
botaoCancelar.addEventListener("click", () => {
    window.location.href = "../feed/feed.html";
});
