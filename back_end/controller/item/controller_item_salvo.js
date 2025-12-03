/**************************************************************************************************
 * Objetivo: Arquivo responsavel pela manipulacao de dado entre o app e a model para o CRUD do projeto Viajou!
 * Data: 02/12/2025
 * Autor: Gustavo Mathias
 * Versao: 1.0
 ***************************************************************************************************/

//Import da MODEL de Item Salvo
const itemSalvoDAO = require('../../model/item_salvo.js')

//Import do arquivo de mensagens
const DEFAULT_MESSAGES = require('../modulo/config_messages.js')

// Função para validar os dados do item salvo
const validarDadosItemSalvo = async function (itemSalvo) {
    
    if (!itemSalvo.id_postagem || isNaN(itemSalvo.id_postagem) || 
        !itemSalvo.id_usuario || isNaN(itemSalvo.id_usuario)) {
        return DEFAULT_MESSAGES.ERROR_REQUIRED_FIELDS
    } else {
        return true
    }
}

//Retorna uma lista de todos os itens salvos
const listaItensSalvos = async function () {
    
    let messages = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        let resultItensSalvos = await itemSalvoDAO.getSelectAllSavedItem()

        if (resultItensSalvos) {
            if (resultItensSalvos.length > 0) {
                messages.HEADER.status            = messages.SUCCESS_REQUEST.status
                messages.HEADER.status_code       = messages.SUCCESS_REQUEST.status_code
                messages.HEADER.itens.itens_salvos = resultItensSalvos
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

//Retorna um item salvo filtrado pelo ID 
const buscarItemSalvoId = async function (id) {

    let messages = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        if (!isNaN(id)) {

            let resultItemSalvo = await itemSalvoDAO.getSelectSavedItemById(Number(id))

            if (resultItemSalvo) {
                if (resultItemSalvo.length > 0) {
                    messages.HEADER.status            = messages.SUCCESS_REQUEST.status
                    messages.HEADER.status_code       = messages.SUCCESS_REQUEST.status_code
                    messages.HEADER.itens.item_salvo  = resultItemSalvo
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

//Inserir um novo item salvo 
const inserirItemSalvo = async function (itemSalvo, contentType) {

    let messages = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {

        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            let validar = await validarDadosItemSalvo(itemSalvo)

            if (validar === true) {
                
                let resultItemSalvo = await itemSalvoDAO.setInsertSavedItem(itemSalvo)
                
                if (resultItemSalvo) {
                  
                    let resultLastID = await itemSalvoDAO.getSelectLastId()
                    
                    if (resultLastID) {
                       
                        itemSalvo.id = resultLastID[0].id 
                        
                        messages.HEADER.status            = messages.SUCCESS_CREATED_ITEM.status
                        messages.HEADER.status_code       = messages.SUCCESS_CREATED_ITEM.status_code
                        messages.HEADER.message           = messages.SUCCESS_CREATED_ITEM.message
                        messages.HEADER.itens.item_salvo  = itemSalvo
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

//Atualiza um item salvo 
const atualizarItemSalvo = async function (itemSalvo, id, contentType) {

    let messages = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {

        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            let validar = await validarDadosItemSalvo(itemSalvo)

            if (validar === true) {

                let validarID = await buscarItemSalvoId(id)

                if (validarID.status_code == 200) {

                    itemSalvo.id = Number(id)

                    //Processamento 
                    //Chama a função para atualizar no BD
                    let resultItemSalvo = await itemSalvoDAO.setUpdateSavedItem(itemSalvo)
                    
                    if (resultItemSalvo) {
                        messages.HEADER.status            = messages.SUCCESS_UPDATE_ITEM.status
                        messages.HEADER.status_code       = messages.SUCCESS_UPDATE_ITEM.status_code
                        messages.HEADER.message           = messages.SUCCESS_UPDATE_ITEM.message
                        messages.HEADER.itens.item_salvo  = itemSalvo

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

//Excluir um item salvo
const excluirItemSalvo = async function (id) {

    let messages = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        //Validação da chegada do ID 
        if (!isNaN(id) && id != '' && id != null && id > 0) {

            let validarID = await buscarItemSalvoId(id)

            if (validarID.status_code == 200) {

                let resultItemSalvo = await itemSalvoDAO.setDeleteSavedItem(Number(id))

                if (resultItemSalvo) {

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
    listaItensSalvos,
    buscarItemSalvoId,
    inserirItemSalvo,
    atualizarItemSalvo,
    excluirItemSalvo
}