/**************************************************************************************************
 * Objetivo: Arquivo responsavel pela manipulacao de dado entre o app e a model para o CRUD do projeto Viajou!
 * Data: 02/12/2025
 * Autor: Gustavo Mathias
 * Versao: 1.0 
 ***************************************************************************************************/

//Import da MODEL de Localização
const localizacaoDAO = require('../../model/localizacao.js')

//Import do arquivo de mensagens
const DEFAULT_MESSAGES = require('../modulo/config_messages.js')

// Função para validar os dados da localização
const validarDadosLocalizacao = async function (localizacao) {

    // Verifica se o campo 'pais' existe, e nao ultrapassa 100 caracteres 
    if (!localizacao.pais || localizacao.pais == '' || localizacao.pais.length > 100) {
        return DEFAULT_MESSAGES.ERROR_REQUIRED_FIELDS
    } else {
        return true
    }
}

//Retorna uma lista de todas as localizações
const listaLocalizacao = async function () {
  
    let messages = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        let resultLocalizacao = await localizacaoDAO.getSelectAllLocation()

        if (resultLocalizacao) {
            if (resultLocalizacao.length > 0) {
                messages.HEADER.status            = messages.SUCCESS_REQUEST.status
                messages.HEADER.status_code       = messages.SUCCESS_REQUEST.status_code
                messages.HEADER.itens.localizacao = resultLocalizacao
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

//Retorna uma localização filtrada pelo ID 
const buscarLocalizacaoId = async function (id) {

    let messages = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        if (!isNaN(id)) {

            let resultLocalizacao = await localizacaoDAO.getSelectLocationById(Number(id))

            if (resultLocalizacao) {
                if (resultLocalizacao.length > 0) {
                    messages.HEADER.status            = messages.SUCCESS_REQUEST.status
                    messages.HEADER.status_code       = messages.SUCCESS_REQUEST.status_code
                    messages.HEADER.itens.localizacao = resultLocalizacao
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

//Inserir uma nova localização 
const inserirLocalizacao = async function (localizacao, contentType) {

    let messages = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {

        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            let validar = await validarDadosLocalizacao(localizacao)

            if (validar === true) {

                let resultLocalizacao = await localizacaoDAO.setInsertLocation(localizacao)
                
                if (resultLocalizacao) {
                  
                    let resultLastID = await localizacaoDAO.getSelectLastID()
                    
                    if (resultLastID) {
                      
                        localizacao.id = resultLastID[0].id 
                        
                        messages.HEADER.status            = messages.SUCCESS_CREATED_ITEM.status
                        messages.HEADER.status_code       = messages.SUCCESS_CREATED_ITEM.status_code
                        messages.HEADER.message           = messages.SUCCESS_CREATED_ITEM.message
                        messages.HEADER.itens.localizacao = localizacao
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

//Atualiza uma localização 
const atualizarLocalizacao = async function (localizacao, id, contentType) {

    let messages = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {

        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            let validar = await validarDadosLocalizacao(localizacao)

            if (validar === true) {

                let validarID = await buscarLocalizacaoId(id)

                if (validarID.status_code == 200) {

                    localizacao.id = Number(id)

                    //Processamento 
                    //Chama a função para atualizar no BD
                    let resultLocalizacao = await localizacaoDAO.setUpdadeLocation(localizacao)
                    
                    if (resultLocalizacao) {
                        messages.HEADER.status            = messages.SUCCESS_UPDATE_ITEM.status
                        messages.HEADER.status_code       = messages.SUCCESS_UPDATE_ITEM.status_code
                        messages.HEADER.message           = messages.SUCCESS_UPDATE_ITEM.message
                        messages.HEADER.itens.localizacao = localizacao

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

//Excluir uma localização
const excluirLocalizacao = async function (id) {

    let messages = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        //Validação da chegada do ID 
        if (!isNaN(id) && id != '' && id != null && id > 0) {

            let validarID = await buscarLocalizacaoId(id)

            if (validarID.status_code == 200) {

                let resultLocalizacao = await localizacaoDAO.setDeleteLocation(Number(id))

                if (resultLocalizacao) {

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
    listaLocalizacao,
    buscarLocalizacaoId,
    inserirLocalizacao,
    atualizarLocalizacao,
    excluirLocalizacao
}