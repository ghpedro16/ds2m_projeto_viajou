/**************************************************************************************************
* Objetivo: Arquivo responsavel pela manipulacao de dado entre o app e a model para o CRUD do projeto Viajou!
* Data: 02/12/2025
* Autor: Gustavo Mathias
* Versao: 1.0 
***************************************************************************************************/

//Import da Model
const comentarioDAO = require ('../../model/DAO/comentario')

//Import de mensagens 
const DEFAULT_MESSAGES = require('../modulo/config_messages.js')

// Validação dos dados do comentário 
const validarDadosComentario = async function (comentario) {
    if (!comentario.texto || comentario.texto == '' || !comentario.id_postagem || !comentario.id_usuario) {
        return DEFAULT_MESSAGES.ERROR_REQUIRED_FIELDS
    } else {
        return true
    }
}

//Retorna uma lista de todos os comentarios
const listaComentarios = async function () {
    
    let messages = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        let resultComentarios = await comentarioDAO.getSelectAllComments()

        if (resultComentarios) {
            if (resultComentarios.length > 0) {
                messages.HEADER.status            = messages.SUCCESS_REQUEST.status
                messages.HEADER.status_code       = messages.SUCCESS_REQUEST.status_code
                messages.HEADER.itens.comentarios = resultComentarios 

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

//Retorna um comentario filtrado pelo ID 
const buscarComentarioId = async function (id) {

    let messages = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        if (!isNaN(id)) {

            let resultComentario = await comentarioDAO.getSelectCommentById(Number(id))

            if (resultComentario) {
                if (resultComentario.length > 0) {
                    messages.HEADER.status             = messages.SUCCESS_REQUEST.status
                    messages.HEADER.status_code        = messages.SUCCESS_REQUEST.status_code
                    messages.HEADER.itens.comentario   = resultComentario

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

//Inserir um novo comentario 
const inserirComentario = async function (comentario, contentType) {

    let messages = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {

        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            let validar = await validarDadosComentario(comentario)

            if (validar === true) {

              
                let resultComentario = await comentarioDAO.setInsertComment(comentario)
                
                if (resultComentario) {
                    let resultLastID = await comentarioDAO.getSelectLastId()
                    
                    if (resultLastID) {
                   
                        comentario.id = resultLastID[0].id 
                        
                        messages.HEADER.status            = messages.SUCCESS_CREATED_ITEM.status
                        messages.HEADER.status_code       = messages.SUCCESS_CREATED_ITEM.status_code
                        messages.HEADER.message           = messages.SUCCESS_CREATED_ITEM.message
                        messages.HEADER.itens.comentario  = comentario
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

//Atualiza um comentario 
const atualizarComentario = async function (comentario, id, contentType) {

    let messages = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {

        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            let validar = await validarDadosComentario(comentario)

            if (validar === true) {

                let validarID = await buscarComentarioId(id)

                if (validarID.status_code == 200) {

                    comentario.id = Number(id)

                    //Processamento 
                    //Chama a função para atualizar o comentario no BD
                    let resultComentario = await comentarioDAO.setUpdateComment(comentario)
                    
                    if (resultComentario) {
                        messages.HEADER.status            = messages.SUCCESS_UPDATE_ITEM.status
                        messages.HEADER.status_code       = messages.SUCCESS_UPDATE_ITEM.status_code
                        messages.HEADER.message           = messages.SUCCESS_UPDATE_ITEM.message
                        messages.HEADER.itens.comentario  = comentario
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

//Excluir um comentario
const excluirComentario = async function (id) {

    let messages = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        //Validação da chegada do ID 
        if (!isNaN(id) && id != '' && id != null && id > 0) {

            let validarID = await buscarComentarioId(id)

            if (validarID.status_code == 200) {

                let resultComentario = await comentarioDAO.setDeleteComment(Number(id))

                if (resultComentario) {

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
    listaComentarios,
    buscarComentarioId,
    inserirComentario,
    atualizarComentario,
    excluirComentario
}



