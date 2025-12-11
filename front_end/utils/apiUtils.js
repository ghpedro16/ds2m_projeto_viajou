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

export async function criarUsuario(dados) {
    const url = "http://localhost:8080/v1/viajou/usuario"
    console.log(dados)
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

export async function seguirUsuario(dados) {
    const url = "http://localhost:8080/v1/viajou/usuario/seguindo"
    console.log(dados)
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

export async function uploadImageToAzure(uploadParams) {
    const {storageAccount, containerName, file, sasToken} = uploadParams
    const fileName = `${Date.now()}-${file.name}`

    const baseUrl = `https://${storageAccount}.blob.core.windows.net/${containerName}/${fileName}`
    const uploadUrl = `${baseUrl}?${sasToken}`

    const options = {
        method: 'PUT',
        headers: {
            'x-ms-blob-type':'blockBlob',
            'Content-Type': 'application/octet-stream'
        },
        body: file
    }

    const response = await fetch (uploadUrl, options)
    if (response.ok) {
        return baseUrl
    } else {
        return response.ok
    }
}

export async function deletarImagemAzure({ storageAccount, containerName, file, sasToken }) {

    const deleteUrl = `https://${storageAccount}.blob.core.windows.net/${containerName}/${file}?${sasToken}`;

    const response = await fetch(deleteUrl, {
        method: 'DELETE'
    })

    return response.ok;
}
