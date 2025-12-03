/**************************************************************************************************
* Objetivo: Arquivo responsavel pela manipulacao de dado entre o app e a model para o CRUD do projeto Viajou!
* Data: 26/11/2025
* Autor: Gustavo Mathias
* Versao: 1.0 (CRUD do projeto Viajou!, sem as relações com outras tabelas)
***************************************************************************************************/

//Import da MODEL do DAO 
const categoriaDAO = require('../../model/categoria.js')

//Import do arquivo de mensagens
const DEFAULT_MESSAGES = require('../modulo/config_messages.js')

// Função para validar os dados da categoria
const validarDadosCategoria = async function (categoria) {

    if (!categoria.nome || categoria.nome == '' || categoria.nome.length > 100) {
        return DEFAULT_MESSAGES.ERROR_REQUIRED_FIELDS
    } else {
        return true
    }
}

//Retorna uma lista de todas categorias
const listaCategoria = async () => {
    let messages = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))
    
    try {
        let resultCategoria = await categoriaDAO.getSelectAllCategorias()

        if (resultCategoria) {
            if (resultCategoria.length > 0) {

                
                messages.HEADER.status            = messages.SUCCESS_REQUEST.status
                messages.HEADER.status_code       = messages.SUCCESS_REQUEST.status_code
                messages.HEADER.itens.categoria   = resultCategoria

                return messages.HEADER
            } else {
                return messages.ERROR_NOT_FOUND
            }
        } else {
            return messages.ERROR_INTERNAL_SERVER_MODEL
        }
    } catch (error) {
        return messages.ERROR_INTERNAL_SERVER_CONTROLLER
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
                    messages.HEADER.status            = messages.SUCCESS_REQUEST.status
                    messages.HEADER.status_code       = messages.SUCCESS_REQUEST.status_code
                    messages.HEADER.itens.categoria   = resultCategoria
                    return messages.HEADER

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

            if (validar === true) {

                let resultCategoria = await categoriaDAO.setInsertCategoria(categoria)
                
                if (resultCategoria) {
                    let lastID = await categoriaDAO.getSelectLastID()
                    
                    if (lastID) {

                        categoria.id = lastID[0].id

                        messages.HEADER.status            = messages.SUCCESS_CREATED_ITEM.status
                        messages.HEADER.status_code       = messages.SUCCESS_CREATED_ITEM.status_code
                        messages.HEADER.message           = messages.SUCCESS_CREATED_ITEM.message
                        messages.HEADER.itens.categoria   = categoria
                        return messages.HEADER 

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

            if (validar === true) {

                let validarID = await buscarCategoriaId(id)

                if (validarID.status_code == 200) {

                    categoria.id = Number(id)

                    let resultCategoria = await categoriaDAO.setUpdadeCategoria(categoria)
                    
                    if (resultCategoria) {
                        messages.HEADER.status            = messages.SUCCESS_UPDATE_ITEM.status
                        messages.HEADER.status_code       = messages.SUCCESS_UPDATE_ITEM.status_code
                        messages.HEADER.message           = messages.SUCCESS_UPDATE_ITEM.message
                        messages.HEADER.itens.categoria   = categoria
                        return messages.HEADER
                        
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

            if (validarID.status_code == 200) {

                let resultCategoria = await categoriaDAO.setDeleteCategoria(Number(id))

                if (resultCategoria) {

                    messages.HEADER.status            = messages.SUCCESS_DELETED_ITEM.status
                    messages.HEADER.status_code       = messages.SUCCESS_DELETED_ITEM.status_code
                    messages.HEADER.message           = messages.SUCCESS_DELETED_ITEM.message
                    messages.HEADER.itens             = null
                    return messages.HEADER

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

module.exports = {
    listaCategoria,
    buscarCategoriaId,
    inserirCategoria,
    atualizarCategoria,
    excluirCategoria
}