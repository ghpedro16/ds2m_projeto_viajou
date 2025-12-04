/**************************************************************************************************
* Objetivo: Arquivo responsavel pela manipulacao de dado entre o app e a model para o CRUD do projeto Viajou!
* Data: 26/11/2025
* Autor: Gustavo Mathias
* Versao: 1.0 (CRUD do projeto Viajou!, sem as relações com outras tabelas)

* Autor: Guilherme Moreira
* OBS: Corrigindo bugs da função de deletar
***************************************************************************************************/

//Import da MODEL do DAO 
const categoriaDAO = require('../../model/DAO/categoria.js')

//Import do arquivo de mensagens
const DEFAULT_MESSAGES = require('../modulo/config_messages.js')

//Retorna uma lista de todas categorias
const listaCategoria = async () => {
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        let resultCategoria = await categoriaDAO.getSelectAllCategorias()

        if (resultCategoria) {
            if (resultCategoria.length > 0) {

                MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCCESS_REQUEST.status
                MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCCESS_REQUEST.status_code
                MESSAGES.DEFAULT_HEADER.itens.categoria = resultCategoria

                return MESSAGES.DEFAULT_HEADER
            } else {
                return MESSAGES.ERROR_NOT_FOUND
            }
        } else {
            return MESSAGES.ERROR_INTERNAL_SERVER_MODEL
        }
    } catch (error) {
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

//Retorna uma categoria filtrada pelo ID 
const buscarCategoriaId = async function (id) {

    let messages = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        if (!isNaN(id)) {

            let resultCategoria = await categoriaDAO.getSelectCategoriaById(Number(id))

            if (resultCategoria) {
                if (resultCategoria.length > 0) {
                    messages.DEFAULT_HEADER.status = messages.SUCCESS_REQUEST.status
                    messages.DEFAULT_HEADER.status_code = messages.SUCCESS_REQUEST.status_code
                    messages.DEFAULT_HEADER.itens.categoria = resultCategoria
                    return messages.DEFAULT_HEADER

                } else {
                    return messages.ERROR_NOT_FOUND
                }

            } else {
                return messages.ERROR_INTERNAL_SERVER_MODEL
            }

        } else {
            return messages.ERROR_REQUIRED_FIELDS
        }
    } catch (error) {
        return messages.ERROR_INTERNAL_SERVER_CONTROLLER

    }
}

//Inserir uma nova categoria 
const inserirCategoria = async function (categoria, contentType) {

    let messages = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {

        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            let validar = await validarDadosCategoria(categoria)

            if (!validar) {

                let resultCategoria = await categoriaDAO.setInsertCategoria(categoria)

                if (resultCategoria) {
                    let lastID = await categoriaDAO.getSelectLastID()

                    if (lastID) {

                        categoria.id = lastID

                        messages.DEFAULT_HEADER.status = messages.SUCCESS_CREATE_ITEM.status
                        messages.DEFAULT_HEADER.status_code = messages.SUCCESS_CREATE_ITEM.status_code
                        messages.DEFAULT_HEADER.message = messages.SUCCESS_CREATE_ITEM.message
                        messages.DEFAULT_HEADER.itens.categoria = categoria
                        return messages.DEFAULT_HEADER

                    } else {
                        return messages.ERROR_INTERNAL_SERVER_MODEL
                    }
                } else {
                    return messages.ERROR_INTERNAL_SERVER_MODEL
                }
            } else {
                return validar
            }
        } else {
            return messages.ERROR_CONTENT_TYPE
        }
    } catch (error) {
        return messages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

//Atualiza uma categoria 
const atualizarCategoria = async function (categoria, id, contentType) {

    let messages = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {

        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            let validar = await validarDadosCategoria(categoria)

            if (!validar) {

                let validarID = await buscarCategoriaId(id)

                if (validarID.status_code == 200) {

                    categoria.id = Number(id)

                    let resultCategoria = await categoriaDAO.setUpdadeCategoria(categoria)

                    if (resultCategoria) {
                        messages.DEFAULT_HEADER.status = messages.SUCCESS_UPDATE_ITEM.status
                        messages.DEFAULT_HEADER.status_code = messages.SUCCESS_UPDATE_ITEM.status_code
                        messages.DEFAULT_HEADER.message = messages.SUCCESS_UPDATE_ITEM.message
                        messages.DEFAULT_HEADER.itens.categoria = categoria
                        return messages.DEFAULT_HEADER

                    } else {
                        return messages.ERROR_INTERNAL_SERVER_MODEL
                    }
                } else {
                    return validarID
                }
            } else {
                return validar
            }
        } else {
            return messages.ERROR_CONTENT_TYPE
        }
    } catch (error) {
        return messages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

// Excluir Categoria
const excluirCategoria = async function (id) {

    let messages = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        //Validação da chegada do ID 
        if (!isNaN(id) && id != '' && id != null && id > 0) {

            let validarID = await buscarCategoriaId(id)
            console.log("VALIDAR ID =>", validarID)

            if (validarID.status_code == 200) {

                let resultCategoria = await categoriaDAO.setDeleteCategoria(Number(id))

                if (resultCategoria) {

                    messages.DEFAULT_HEADER.status = messages.SUCCESS_DELETED_ITEM.status
                    messages.DEFAULT_HEADER.status_code = messages.SUCCESS_DELETED_ITEM.status_code
                    messages.DEFAULT_HEADER.message = messages.SUCCESS_DELETED_ITEM.message

                    messages.DEFAULT_HEADER.itens = {}
                    delete messages.DEFAULT_HEADER.itens

                    return messages.DEFAULT_HEADER

                } else {
                    return messages.ERROR_INTERNAL_SERVER_MODEL
                }
            } else {
                return messages.ERROR_NOT_FOUND
            }
        } else {
            messages.ERROR_REQUIRED_FIELDS.message += ' [ID incorreto]'
            return messages.ERROR_REQUIRED_FIELDS
        }
    } catch (error) {
        return messages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const validarDadosCategoria = async function(categoria){
    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    if(categoria.nome == '' || categoria.nome == undefined || categoria.nome == null || categoria.nome.length > 100){
        MESSAGES.ERROR_REQUIRED_FIELDS.message += ' [Categoria incorreto]'
        return MESSAGES.ERROR_REQUIRED_FIELDS
    }else{
        return false
    }
}

module.exports = {
    listaCategoria,
    buscarCategoriaId,
    inserirCategoria,
    atualizarCategoria,
    excluirCategoria
}