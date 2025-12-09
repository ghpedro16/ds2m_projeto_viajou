/*******************************************************************************************************************************************************************
 * Objetivo: Arquivo responsável pela manipulação de dados entre o app e a model para um CRUD na tabela relacionamento localizacao_postagem
 * Data: 04/12/2025
 * Autor: Pedro Henrique Araújo da Silva
 * Versão: 1.0 
 *******************************************************************************************************************************************************************/

//Import da DAO
const localizacaoPostagemDAO = require('../../model/DAO/localizacao_postagem.js')

//Import do arquivo de mensagens
const DEFAULT_MESSAGES = require('../modulo/config_messages.js')

//Lista todas as localizacoes
const listarLocalizacaoPostagens = async function(){
    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))
    
    try {
        //Chama a função do DAO
        let resultLocalizacaoPostagem = await localizacaoPostagemDAO.getSelectAllLocationPosts()

        if(resultLocalizacaoPostagem){
            if(resultLocalizacaoPostagem.length > 0){
                MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCCESS_REQUEST.status
                MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCCESS_REQUEST.status_code
                MESSAGES.DEFAULT_HEADER.itens.localizacao_postagem = resultLocalizacaoPostagem

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

//Lista localizacao pelo id
const buscarLocalizacaoPostagemId = async function(id){
    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {

        if(!isNaN(id) && id != '' && id != null && id > 0){
            //Chama a função do DAO
            let resultLocalizacaoPostagem = await localizacaoPostagemDAO.getSelectLocationPostById(Number(id))

            if(resultLocalizacaoPostagem){
                if(resultLocalizacaoPostagem.length > 0){
                    MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCCESS_REQUEST.status
                    MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCCESS_REQUEST.status_code
                    MESSAGES.DEFAULT_HEADER.itens.localizacao_postagem = resultLocalizacaoPostagem

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
    } catch (error) {
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER // 500
    }
}

//Lista localizacao pelo id da postagem
const buscarLocalizacaoIdPostagem = async function(id_postagem){
    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {

        if(!isNaN(id_postagem) && id_postagem != '' && id_postagem != null && id_postagem > 0){
            //Chama a função do DAO
            let resultLocalizacaoPostagem = await localizacaoPostagemDAO.getSelectLocationByIdPost(Number(id_postagem))

            if(resultLocalizacaoPostagem){
                if(resultLocalizacaoPostagem.length > 0){
                    MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCCESS_REQUEST.status
                    MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCCESS_REQUEST.status_code
                    MESSAGES.DEFAULT_HEADER.itens.localizacao_postagem = resultLocalizacaoPostagem

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
    } catch (error) {
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER // 500
    }
}

//Lista postagens pelo id da localizacao
const buscarPostagemIdLocalizacao = async function(id_localizacao){
    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {

        if(!isNaN(id_localizacao) && id_localizacao != '' && id_localizacao != null && id_localizacao > 0){
            //Chama a função do DAO
            let resultLocalizacaoPostagem = await localizacaoPostagemDAO.getSelectPostByIdLocation(Number(id_localizacao))

            if(resultLocalizacaoPostagem){
                if(resultLocalizacaoPostagem.length > 0){
                    MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCCESS_REQUEST.status
                    MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCCESS_REQUEST.status_code
                    MESSAGES.DEFAULT_HEADER.itens.localizacao_postagem = resultLocalizacaoPostagem

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
    } catch (error) {
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER // 500
    }
}

//Insere na tabela relacional de localizacao postagem
const inserirLocalizacaoPostagem = async function(localizacaoPostagem, contentType){
    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        //Validação do tipo de conteúdo da requisição (OBRIGATÓRIO SER UM JSON)
        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){

            let validar = await validarDadosLocalizacaoPostagem(localizacaoPostagem)

            if(!validar){
                //Processamento
                //Chama a função para inserir uma nova localizacao postagem no banco de dados
                let resultLocalizacaoPostagem = await localizacaoPostagemDAO.setInsertLocationPost(localizacaoPostagem)
                
                if(resultLocalizacaoPostagem){
                    //Chama a função para receber o ID gerado no BD
                    let lastId = await localizacaoPostagemDAO.getSelectLastId()
                    
                    if(lastId){
                        //Adiciona o ID no JSON de dados da localizacao postagem
                        localizacaoPostagem.id = lastId

                        MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCCESS_CREATE_ITEM.status
                        MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCCESS_CREATE_ITEM.status_code
                        MESSAGES.DEFAULT_HEADER.message = MESSAGES.SUCCESS_CREATE_ITEM.message
                        MESSAGES.DEFAULT_HEADER.itens = localizacaoPostagem
                        
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
    } catch (error) {
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER // 500
    }
}

//Atualiza a localizacao postagem
const atualizarLocalizacaoPostagem = async function(localizacaoPostagem, id, contentType){

    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        //Validação do tipo de conteúdo da requisição (OBRIGATÓRIO SER UM JSON)
        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){

            //Chama a função de validar todos os dados
            let validar = await validarDadosLocalizacaoPostagem(localizacaoPostagem)

            if(!validar){

                //Validação do ID, chamando a Controller que verifica no BD se o ID existe e valida o ID
                let validarId = await buscarLocalizacaoPostagemId(id)

                if(validarId.status_code == 200){

                    //Adiciona o ID da localizacao postagem no JSON de dados para ser encaminhado ao DAO
                    localizacaoPostagem.id = Number(id)

                    let resultLocalizacaoPostagem = await localizacaoPostagemDAO.setUpdateLocationPost(localizacaoPostagem)
                
                    if(resultLocalizacaoPostagem){
                        MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCCESS_UPDATE_ITEM.status
                        MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCCESS_UPDATE_ITEM.status_code
                        MESSAGES.DEFAULT_HEADER.message = MESSAGES.SUCCESS_UPDATE_ITEM.message
                        MESSAGES.DEFAULT_HEADER.itens.localizacao_postagem = localizacaoPostagem
                    
                        return MESSAGES.DEFAULT_HEADER //200
                    }else{
                        return MESSAGES.ERROR_INTERNAL_SERVER_MODEL // 500
                    }
                }else{
                    return validarId // A função poderá retornar um erro 400, 404 ou 500
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

//Excluir localizacao postagem
const excluirLocalizacaoPostagem = async function(id){

    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        if(!isNaN(id) && id != '' && id != null && id > 0){

            //Validação de ID válido, chama a função da controller que verifica no BD se o ID existe e valida o ID
            let validarId = await buscarLocalizacaoPostagemId(id)

            if(validarId.status_code == 200){

                //Chama a função do DAO
                let resultLocalizacaoPostagem = await localizacaoPostagemDAO.setDeleteLocationPost(Number(id))

                if(resultLocalizacaoPostagem){

                    MESSAGES.DEFAULT_HEADER.status      = MESSAGES.SUCCESS_DELETED_ITEM.status
                    MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCCESS_DELETED_ITEM.status_code
                    MESSAGES.DEFAULT_HEADER.message     = MESSAGES.SUCCESS_DELETED_ITEM.message

                    return MESSAGES.DEFAULT_HEADER //200
                }else{
                    return MESSAGES.ERROR_INTERNAL_SERVER_MODEL // 500
                }
            }else{
                return MESSAGES.ERROR_NOT_FOUND // 404
            }
        }else{
            MESSAGES.ERROR_REQUIRED_FIELDS.message += ' [ID Incorreto!]'
            return MESSAGES.ERROR_REQUIRED_FIELDS // 400
        }
    } catch (error) {
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER // 500
    }
}

//Valida os dados da localizacao postagem
const validarDadosLocalizacaoPostagem = async function(localizacaoPostagem){
    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    if (localizacaoPostagem.id_localizacao == '' || localizacaoPostagem.id_localizacao == undefined || localizacaoPostagem.id_localizacao == null || isNaN(localizacaoPostagem.id_localizacao || localizacaoPostagem.id_localizacao <= 0)) {
        MESSAGES.ERROR_REQUIRED_FIELDS.message += ' [id_localizacao incorreto]'
        return MESSAGES.ERROR_REQUIRED_FIELDS

    } else if(localizacaoPostagem.id_postagem == '' || localizacaoPostagem.id_postagem == undefined || localizacaoPostagem.id_postagem == null || isNaN(localizacaoPostagem.id_postagem || localizacaoPostagem.id_postagem <= 0)){
        MESSAGES.ERROR_REQUIRED_FIELDS.message += ' [id_postagem incorreto]'
        return MESSAGES.ERROR_REQUIRED_FIELDS
    } else {
        return false
    }
}

module.exports = {
    listarLocalizacaoPostagens,
    buscarLocalizacaoPostagemId,
    buscarLocalizacaoIdPostagem,
    buscarPostagemIdLocalizacao,
    inserirLocalizacaoPostagem,
    atualizarLocalizacaoPostagem,
    excluirLocalizacaoPostagem
}