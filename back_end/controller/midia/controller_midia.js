/**************************************************************************************************
 * Objetivo: Arquivo responsavel pela manipulação dos dados de Mídia entre o APP e a MODEL
 * Data: 03/12/2025
 * Autor: Guilherme Moreira
 * Versao: 1.0 
 ***************************************************************************************************/

//Import da MODEL de Mídia
const midiaDAO = require('../../model/DAO/midia.js')

//Import do arquivo de mensagens
const DEFAULT_MESSAGES = require('../modulo/config_messages.js')

const listaMidia = async function () {

    let messages = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        let resultMidia = await midiaDAO.getSelectAllMidia()

        if (resultMidia) {
            if (resultMidia.length > 0) {

                messages.DEFAULT_HEADER.status = messages.SUCCESS_REQUEST.status
                messages.DEFAULT_HEADER.status_code = messages.SUCCESS_REQUEST.status_code
                messages.DEFAULT_HEADER.itens.midia = resultMidia

                return messages.DEFAULT_HEADER

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

const buscarMidiaId = async function (id) {

    let messages = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {

        if (!isNaN(id)) {

            let resultMidia = await midiaDAO.getSelectMidiaById(Number(id))

            if (resultMidia) {
                if (resultMidia.length > 0) {

                    messages.DEFAULT_HEADER.status = messages.SUCCESS_REQUEST.status
                    messages.DEFAULT_HEADER.status_code = messages.SUCCESS_REQUEST.status_code
                    messages.DEFAULT_HEADER.itens.midia = resultMidia

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

const inserirMidia = async function (midia, contentType) {

    let messages = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {

        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            let validar = await validarDadosMidia(midia)

            if (!validar) {

                let resultMidia = await midiaDAO.setInsertMidia(midia)

                if (resultMidia) {

                    let resultLastID = await midiaDAO.getSelectLastID()

                    if (resultLastID) {

                        midia.id = resultLastID[0].id

                        messages.DEFAULT_HEADER.status = messages.SUCCESS_CREATE_ITEM.status
                        messages.DEFAULT_HEADER.status_code = messages.SUCCESS_CREATE_ITEM.status_code
                        messages.DEFAULT_HEADER.message = messages.SUCCESS_CREATE_ITEM.message
                        messages.DEFAULT_HEADER.itens.midia = midia

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

const atualizarMidia = async function (midia, id, contentType) {

    let messages = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {

        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            let validar = await validarDadosMidia(midia)

            if (!validar) {

                let validarID = await buscarMidiaId(id)

                if (validarID.status_code == 200) {

                    midia.id = Number(id)

                    let resultMidia = await midiaDAO.setUpdadeMidia(midia)

                    if (resultMidia) {

                        messages.DEFAULT_HEADER.status = messages.SUCCESS_UPDATE_ITEM.status
                        messages.DEFAULT_HEADER.status_code = messages.SUCCESS_UPDATE_ITEM.status_code
                        messages.DEFAULT_HEADER.message = messages.SUCCESS_UPDATE_ITEM.message
                        messages.DEFAULT_HEADER.itens.midia = midia

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

const excluirMidia = async function (id) {

    let messages = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {

        if (!isNaN(id) && id != '' && id != null && id > 0) {

            let validarID = await buscarMidiaId(id)

            if (validarID.status_code == 200) {

                let resultMidia = await midiaDAO.setDeleteMidia(Number(id))

                if (resultMidia) {
                    messages.DEFAULT_HEADER.status = messages.SUCCESS_DELETED_ITEM.status
                    messages.DEFAULT_HEADER.status_code = messages.SUCCESS_DELETED_ITEM.status_code
                    messages.DEFAULT_HEADER.message = messages.SUCCESS_DELETED_ITEM.message
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

const validarDadosMidia = async function(midia){
    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    if(midia.url == '' || midia.url == undefined || midia.url == null || midia.url.length > 200){
        MESSAGES.ERROR_REQUIRED_FIELDS.message += ' [Midia incorreto]'
        return MESSAGES.ERROR_REQUIRED_FIELDS
    }else{
        return false
    }
}

module.exports = {
    listaMidia,
    buscarMidiaId,
    inserirMidia,
    atualizarMidia,
    excluirMidia
}
