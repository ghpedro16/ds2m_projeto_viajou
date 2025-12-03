/**************************************************************************************************
 * Objetivo: Arquivo responsavel pela manipulacao de dado entre o app e a model para o CRUD do projeto Viajou!
 * Data: 02/12/2025
 * Autor: Gustavo Mathias
 * Versao: 1.0
 ***************************************************************************************************/

//Import da MODEL de Curtida
const curtidaDAO = require('../../model/DAO/curtida.js')

//Import do arquivo de mensagens
const DEFAULT_MESSAGES = require('../modulo/config_messages.js')

// Função para validar os dados da curtida
const validarDadosCurtida = async function (curtida) {
    
    // Validação de campos obrigatórios
    if (!curtida.id_postagem || isNaN(curtida.id_postagem) || 
        !curtida.id_usuario || isNaN(curtida.id_usuario)) {
        return DEFAULT_MESSAGES.ERROR_REQUIRED_FIELDS
    } else {
        return true
    }
}

//Retorna uma lista de todas as curtidas
const listaCurtidas = async function () {
    
    let messages = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        let resultCurtidas = await curtidaDAO.getSelectAllLikes()

        if (resultCurtidas) {
            if (resultCurtidas.length > 0) {
                messages.HEADER.status          = messages.SUCCESS_REQUEST.status
                messages.HEADER.status_code     = messages.SUCCESS_REQUEST.status_code
                messages.HEADER.itens.curtidas  = resultCurtidas

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

//Retorna uma curtida filtrada pelo ID 
const buscarCurtidaId = async function (id) {

    let messages = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        if (!isNaN(id)) {

            let resultCurtida = await curtidaDAO.getSelectLikeById(Number(id))

            if (resultCurtida) {
                if (resultCurtida.length > 0) {
                    messages.HEADER.status         = messages.SUCCESS_REQUEST.status
                    messages.HEADER.status_code    = messages.SUCCESS_REQUEST.status_code
                    messages.HEADER.itens.curtida  = resultCurtida

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

//Inserir uma nova curtida 
const inserirCurtida = async function (curtida, contentType) {

    let messages = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {

        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            let validar = await validarDadosCurtida(curtida)

            if (validar === true) {
               
                let resultCurtida = await curtidaDAO.setInsertLike(curtida)
                
                if (resultCurtida) {
            
                    let resultLastID = await curtidaDAO.getSelectLastId()
                    
                    if (resultLastID) {
                        curtida.id = resultLastID[0].id 
                        
                        messages.HEADER.status          = messages.SUCCESS_CREATED_ITEM.status
                        messages.HEADER.status_code     = messages.SUCCESS_CREATED_ITEM.status_code
                        messages.HEADER.message         = messages.SUCCESS_CREATED_ITEM.message
                        messages.HEADER.itens.curtida   = curtida

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

//Atualiza uma curtida 
const atualizarCurtida = async function (curtida, id, contentType) {

    let messages = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {

        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            let validar = await validarDadosCurtida(curtida)

            if (validar === true) {

                let validarID = await buscarCurtidaId(id)

                if (validarID.status_code == 200) {

                    curtida.id = Number(id)

                    //Processamento 
                    //Chama a função para atualizar no BD
                    let resultCurtida = await curtidaDAO.setUpdateLike(curtida)
                    
                    if (resultCurtida) {
                        messages.HEADER.status          = messages.SUCCESS_UPDATE_ITEM.status
                        messages.HEADER.status_code     = messages.SUCCESS_UPDATE_ITEM.status_code
                        messages.HEADER.message         = messages.SUCCESS_UPDATE_ITEM.message
                        messages.HEADER.itens.curtida   = curtida

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

//Excluir uma curtida
const excluirCurtida = async function (id) {

    let messages = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        //Validação da chegada do ID 
        if (!isNaN(id) && id != '' && id != null && id > 0) {

            let validarID = await buscarCurtidaId(id)

            if (validarID.status_code == 200) {

                let resultCurtida = await curtidaDAO.setDeleteLike(Number(id))

                if (resultCurtida) {

                    messages.HEADER.status          = messages.SUCCESS_DELETED_ITEM.status
                    messages.HEADER.status_code     = messages.SUCCESS_DELETED_ITEM.status_code
                    messages.HEADER.message         = messages.SUCCESS_DELETED_ITEM.message
                    messages.HEADER.itens           = null 
                    
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
    listaCurtidas,
    buscarCurtidaId,
    inserirCurtida,
    atualizarCurtida,
    excluirCurtida
}