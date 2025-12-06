/**************************************************************************************************
 * Objetivo: Arquivo responsavel pela manipulacao de dado entre o app e a model para o CRUD do projeto Viajou!
 * Data: 02/12/2025
 * Autor: Gustavo Mathias
 * Versao: 1.0
 ***************************************************************************************************/

//Import da MODEL de Item Salvo
const itemSalvoDAO = require('../../model/DAO/item_salvo.js')

//Import do arquivo de mensagens
const DEFAULT_MESSAGES = require('../modulo/config_messages.js')

//Retorna uma lista de todos os comentarios
const listarItensSalvo = async function () {
    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))
    
    try {
        //Chama a função do DAO para retornar a lista de usuarios do BD
        let resultItemSalvo = await itemSalvoDAO.getSelectAllSavedItem()

        if(resultItemSalvo){
            if(resultItemSalvo.length > 0){
                MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCCESS_REQUEST.status
                MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCCESS_REQUEST.status_code
                MESSAGES.DEFAULT_HEADER.itens.itens_salvos = resultItemSalvo

                return MESSAGES.DEFAULT_HEADER // 200
            }else{
                return MESSAGES.ERROR_NOT_FOUND // 404
            }
        }else{
            return MESSAGES.ERROR_INTERNAL_SERVER_MODEL // 500
        }
    } catch (error) {
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER // 500
    }
}

//Retorna um comentario filtrado pelo ID 
const buscarItemSalvoId = async function (id) {

    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {

        if(!isNaN(id) && id != '' && id != null && id > 0){
            //Chama a função do DAO
            let resultItemSalvo = await itemSalvoDAO.getSelectSavedItemById(Number(id))

            if(resultItemSalvo){
                if(resultItemSalvo.length > 0){
                    MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCCESS_REQUEST.status
                    MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCCESS_REQUEST.status_code
                    MESSAGES.DEFAULT_HEADER.itens.item_salvo = resultItemSalvo
                    return MESSAGES.DEFAULT_HEADER // 200
                }else{
                    return MESSAGES.ERROR_NOT_FOUND // 404
                }
            }else{
                return MESSAGES.ERROR_INTERNAL_SERVER_MODEL // 500
            }
        }else{
            MESSAGES.ERROR_REQUIRED_FIELDS.message += ' [ID Incorreto!]'
            return MESSAGES.ERROR_REQUIRED_FIELDS // 400
        }
    } catch (error){
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER // 500
    }
}

const buscarItemSalvoIdUsuario = async function(id_usuario){
    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {

        if(!isNaN(id_usuario) && id_usuario != '' && id_usuario != null && id_usuario > 0){
            //Chama a função do DAO
            let resultItemSalvo = await itemSalvoDAO.getSelectSavedItemByIdUser(Number(id_usuario))

            if(resultItemSalvo){
                if(resultItemSalvo.length > 0){
                    MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCCESS_REQUEST.status
                    MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCCESS_REQUEST.status_code
                    MESSAGES.DEFAULT_HEADER.itens.item_salvo = resultItemSalvo

                    return MESSAGES.DEFAULT_HEADER // 200
                }else{
                    return MESSAGES.ERROR_NOT_FOUND // 404
                }
            }else{
                return MESSAGES.ERROR_INTERNAL_SERVER_MODEL // 500
            }
        }else{
            MESSAGES.ERROR_REQUIRED_FIELDS.message += ' [ID Incorreto!]'
            return MESSAGES.ERROR_REQUIRED_FIELDS // 400
        }
    } catch (error){
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER // 500
    }
}

//Inserir um novo comentario 
const inserirItemSalvo = async function (itemSalvo, contentType) {
    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        //Validação do tipo de conteúdo da requisição (OBRIGATÓRIO SER UM JSON)
        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){

            let validar = await validarDadosItemSalvo(itemSalvo)

            if(!validar){
                //Processamento
                //Chama a função para inserir um novo comentario no banco de dados
                let resultItemSalvo = await itemSalvoDAO.setInsertSavedItem(itemSalvo)
                
                if(resultItemSalvo){
                    //Chama a função para receber o ID gerado no BD
                    let lastId = await itemSalvoDAO.getSelectLastId()
                    
                    if(lastId){
                        //Adiciona o ID no JSON de dados do filme
                        itemSalvo.id = lastId

                        MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCCESS_CREATE_ITEM.status
                        MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCCESS_CREATE_ITEM.status_code
                        MESSAGES.DEFAULT_HEADER.message = MESSAGES.SUCCESS_CREATE_ITEM.message

                        MESSAGES.DEFAULT_HEADER.itens = itemSalvo
                    
                        return MESSAGES.DEFAULT_HEADER //201
                    }else{
                        return MESSAGES.ERROR_INTERNAL_SERVER_MODEL
                    }
                }else{
                    return MESSAGES.ERROR_INTERNAL_SERVER_MODEL // 500
                }
            }else{
                return validar // 400
            }
        }else{
            return MESSAGES.ERROR_CONTENT_TYPE // 415
        }
    } catch (error){
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER // 500
    }
}

//Atualiza um comentario 
const atualizarItemSalvo = async function (itemSalvo, id, contentType) {
    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        //Validação do tipo de conteúdo da requisição (OBRIGATÓRIO SER UM JSON)
        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){

            //Chama a função de validar todos os dados
            let validar = await validarDadosItemSalvo(itemSalvo)

            if(!validar){

                //Validação do ID, chamando a Controller que verifica no BD se o ID existe e valida o ID
                let validarId = await buscarItemSalvoId(id)
                
                if(validarId.status_code == 200){
                    //Adiciona o ID do filme no JSON de dados para ser encaminhado ao DAO
                    itemSalvo.id = Number(id)

                    //Processamento
                    //Chama a função para inserir um novo filme no banco de dados
                    let resultItemSalvo = await itemSalvoDAO.setUpdateSavedItem(itemSalvo)
                
                    if(resultItemSalvo){
                        MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCCESS_UPDATE_ITEM.status
                        MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCCESS_UPDATE_ITEM.status_code
                        MESSAGES.DEFAULT_HEADER.message = MESSAGES.SUCCESS_UPDATE_ITEM.message
                        MESSAGES.DEFAULT_HEADER.itens.item_salvo = itemSalvo
                        
                        return MESSAGES.DEFAULT_HEADER //200
                    }else{
                        return MESSAGES.ERROR_INTERNAL_SERVER_MODEL // 500
                    }
                }else{
                    return validarId // A função buscarComentarioID poderá retornar um erro 400, 404 ou 500
                }
            }else{
                return validar // 400
            }
        }else{
            return MESSAGES.ERROR_CONTENT_TYPE // 415
        }
    } catch (error){
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER // 500
    }
}

//Excluir um comentario
const excluirItemSalvo = async function (id) {

    let messages = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        //Validação da chegada do ID 
        if (!isNaN(id) && id != '' && id != null && id > 0) {

            let validarID = await buscarItemSalvoId(id)

            if (validarID.status_code == 200) {

                let resultItemSalvo = await itemSalvoDAO.setDeleteSavedItem(Number(id))

                if (resultItemSalvo) {

                    messages.DEFAULT_HEADER.status            = messages.SUCCESS_DELETED_ITEM.status
                    messages.DEFAULT_HEADER.status_code       = messages.SUCCESS_DELETED_ITEM.status_code
                    messages.DEFAULT_HEADER.message           = messages.SUCCESS_DELETED_ITEM.message
                    
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

// Validação dos dados do comentário 
const validarDadosItemSalvo = async function (itemSalvo) {

    if(itemSalvo.id_usuario == undefined || isNaN(itemSalvo.id_usuario || itemSalvo.id_usuario <= 0) || itemSalvo.id_usuario == null || itemSalvo.id_usuario == ''){
        MESSAGES.ERROR_REQUIRED_FIELDS.message += ' [Usuario incorreto]'
        return MESSAGES.ERROR_REQUIRED_FIELDS

    }else if(itemSalvo.id_postagem == undefined || isNaN(itemSalvo.id_postagem || itemSalvo.id_postagem <= 0) || itemSalvo.id_postagem == null || itemSalvo.id_postagem == ''){
        MESSAGES.ERROR_REQUIRED_FIELDS.message += ' [Postagem incorreto]'
        return MESSAGES.ERROR_REQUIRED_FIELDS

    }else{
        return false
    }
}

module.exports = {
    listarItensSalvo,
    buscarItemSalvoId,
    buscarItemSalvoIdUsuario,
    inserirItemSalvo,
    atualizarItemSalvo,
    excluirItemSalvo
}