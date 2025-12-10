'use strict'

export async function atualizarPerfil(id, dados) {
    const url = `http://localhost:8080/v1/viajou/usuario/${id}`

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

export async function criarPostagem(dados) {
    const url = "http://localhost:8080/v1/viajou/postagem"
    const options = {
        method: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify(dados)
    }

    const response = await fetch(url, options)


    return response.ok
}

export async function editarPostagem(postagem, id_postagem) {
    const url = `http://localhost:8080/v1/viajou/postagem/${id_postagem}`

    const options = {
        method: "PUT",
        headers: {
            "content-Type": "application/json"
        },
        body: JSON.stringify(postagem)
    }

    const response = await fetch(url, options)


    return response.ok
}

export async function deletarPostagem (id_postagem) {
    const url = `http://localhost:8080/v1/viajou/postagem/${id_postagem}`

    const options = {
        method: 'DELETE'
    }

    const response = await fetch(url, options)

    return response.ok
}