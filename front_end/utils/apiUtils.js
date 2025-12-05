'use strict'

export async function atualizarPerfil(id, dados) {
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