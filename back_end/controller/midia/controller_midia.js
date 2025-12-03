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

const validarDadosMidia = async function (midia) {

    if (!midia.url || midia.url == '' || midia.url.length > 200) {
        return DEFAULT_MESSAGES.ERROR_REQUIRED_FIELDS
    } else {
        return true
    }
}

const listaMidia = async function () {

    let messages = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        let resultMidia = await midiaDAO.getSelectAllMidia()

        if (resultMidia) {
            if (resultMidia.length > 0) {

                messages.HEADER.development = 'Guilherme Moreira'
                messages.HEADER.status = messages.SUCCESS_REQUEST.status
                messages.HEADER.status_code = messages.SUCCESS_REQUEST.status_code
                messages.HEADER.itens.midia = resultMidia

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

const buscarMidiaId = async function (id) {

    let messages = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {

        if (!isNaN(id)) {

            let resultMidia = await midiaDAO.getSelectMidiaById(Number(id))

            if (resultMidia) {
                if (resultMidia.length > 0) {

                    messages.HEADER.development = 'Guilherme Moreira'
                    messages.HEADER.status = messages.SUCCESS_REQUEST.status
                    messages.HEADER.status_code = messages.SUCCESS_REQUEST.status_code
                    messages.HEADER.itens.midia = resultMidia

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

const inserirMidia = async function (midia, contentType) {

    let messages = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {

        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            let validar = await validarDadosMidia(midia)

            if (validar === true) {

                let resultMidia = await midiaDAO.setInsertMidia(midia)

                if (resultMidia) {

                    let resultLastID = await midiaDAO.getSelectLastID()

                    if (resultLastID) {

                        midia.id = resultLastID[0].id

                        messages.HEADER.development = 'Guilherme Moreira'
                        messages.HEADER.status = messages.SUCCESS_CREATED_ITEM.status
                        messages.HEADER.status_code = messages.SUCCESS_CREATED_ITEM.status_code
                        messages.HEADER.message = messages.SUCCESS_CREATED_ITEM.message
                        messages.HEADER.itens.midia = midia

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

const atualizarMidia = async function (midia, id, contentType) {

    let messages = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {

        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            let validar = await validarDadosMidia(midia)

            if (validar === true) {

                let validarID = await buscarMidiaId(id)

                if (validarID.status_code == 200) {

                    midia.id = Number(id)

                    let resultMidia = await midiaDAO.setUpdadeMidia(midia)

                    if (resultMidia) {

                        messages.HEADER.development = 'Guilherme Moreira'
                        messages.HEADER.status = messages.SUCCESS_UPDATE_ITEM.status
                        messages.HEADER.status_code = messages.SUCCESS_UPDATE_ITEM.status_code
                        messages.HEADER.message = messages.SUCCESS_UPDATE_ITEM.message
                        messages.HEADER.itens.midia = midia

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

const excluirMidia = async function (id) {

    let messages = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {

        if (!isNaN(id) && id != '' && id != null && id > 0) {

            let validarID = await buscarMidiaId(id)

            if (validarID.status_code == 200) {

                let resultMidia = await midiaDAO.setDeleteMidia(Number(id))

                if (resultMidia) {
                    messages.HEADER.development = 'Guilherme Moreira'
                    messages.HEADER.status = messages.SUCCESS_DELETED_ITEM.status
                    messages.HEADER.status_code = messages.SUCCESS_DELETED_ITEM.status_code
                    messages.HEADER.message = messages.SUCCESS_DELETED_ITEM.message
                    delete messages.HEADER.itens

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
    listaMidia,
    buscarMidiaId,
    inserirMidia,
    atualizarMidia,
    excluirMidia
}
