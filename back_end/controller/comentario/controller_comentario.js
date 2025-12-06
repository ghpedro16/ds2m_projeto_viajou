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

//Retorna uma lista de todos os comentarios
const listaComentarios = async function () {
    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))
    
    try {
        //Chama a função do DAO para retornar a lista de usuarios do BD
        let resultComentarios = await comentarioDAO.getSelectAllComments()

        if(resultComentarios){
            if(resultComentarios.length > 0){
                MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCCESS_REQUEST.status
                MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCCESS_REQUEST.status_code
                MESSAGES.DEFAULT_HEADER.itens.comentarios = resultComentarios

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
const buscarComentarioId = async function (id) {

    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {

        if(!isNaN(id) && id != '' && id != null && id > 0){
            //Chama a função do DAO
            let resultComentario = await comentarioDAO.getSelectCommentById(Number(id))

            if(resultComentario){
                if(resultComentario.length > 0){
                    MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCCESS_REQUEST.status
                    MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCCESS_REQUEST.status_code
                    MESSAGES.DEFAULT_HEADER.itens.comentario = resultComentario
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

const buscarComentarioIdPostagem = async function(id_postagem){
    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {

        if(!isNaN(id_postagem) && id_postagem != '' && id_postagem != null && id_postagem > 0){
            //Chama a função do DAO
            let resultComentario = await comentarioDAO.getSelectCommentsByIdPost(Number(id_postagem))

            if(resultComentario){
                if(resultComentario.length > 0){
                    MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCCESS_REQUEST.status
                    MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCCESS_REQUEST.status_code
                    MESSAGES.DEFAULT_HEADER.itens.comentario = resultComentario

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
const inserirComentario = async function (comentario, contentType) {
    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        //Validação do tipo de conteúdo da requisição (OBRIGATÓRIO SER UM JSON)
        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){

            let validar = await validarDadosComentario(comentario)

            if(!validar){
                //Processamento
                //Chama a função para inserir um novo comentario no banco de dados
                let resultComentario = await comentarioDAO.setInsertComment(comentario)
                
                if(resultComentario){
                    //Chama a função para receber o ID gerado no BD
                    let lastId = await comentarioDAO.getSelectLastId()
                    
                    if(lastId){
                        //Adiciona o ID no JSON de dados do filme
                        comentario.id = lastId

                        MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCCESS_CREATE_ITEM.status
                        MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCCESS_CREATE_ITEM.status_code
                        MESSAGES.DEFAULT_HEADER.message = MESSAGES.SUCCESS_CREATE_ITEM.message

                        MESSAGES.DEFAULT_HEADER.itens = comentario
                    
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
const atualizarComentario = async function (comentario, id, contentType) {
    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        //Validação do tipo de conteúdo da requisição (OBRIGATÓRIO SER UM JSON)
        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){

            //Chama a função de validar todos os dados
            let validar = await validarDadosComentario(comentario)

            if(!validar){

                //Validação do ID, chamando a Controller que verifica no BD se o ID existe e valida o ID
                let validarId = await buscarComentarioId(id)
                
                if(validarId.status_code == 200){
                    //Adiciona o ID do filme no JSON de dados para ser encaminhado ao DAO
                    comentario.id = Number(id)

                    //Processamento
                    //Chama a função para inserir um novo filme no banco de dados
                    let resultComentario = await comentarioDAO.setUpdateComment(comentario)
                
                    if(resultComentario){
                        MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCCESS_UPDATE_ITEM.status
                        MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCCESS_UPDATE_ITEM.status_code
                        MESSAGES.DEFAULT_HEADER.message = MESSAGES.SUCCESS_UPDATE_ITEM.message
                        MESSAGES.DEFAULT_HEADER.itens.comentario = comentario
                        
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
const excluirComentario = async function (id) {

    let messages = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        //Validação da chegada do ID 
        if (!isNaN(id) && id != '' && id != null && id > 0) {

            let validarID = await buscarComentarioId(id)

            if (validarID.status_code == 200) {

                let resultComentario = await comentarioDAO.setDeleteComment(Number(id))

                if (resultComentario) {

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
const validarDadosComentario = async function (comentario) {
    if (comentario.texto == null|| comentario.texto == '' || comentario.texto == undefined || comentario.texto.length > 350) {
        MESSAGES.ERROR_REQUIRED_FIELDS.message += ' [Comentario incorreto]'
        return MESSAGES.ERROR_REQUIRED_FIELDS

    }else if(comentario.id_usuario == undefined || isNaN(comentario.id_usuario || comentario.id_usuario <= 0) || comentario.id_usuario == null || comentario.id_usuario == ''){
        MESSAGES.ERROR_REQUIRED_FIELDS.message += ' [Usuario incorreto]'
        return MESSAGES.ERROR_REQUIRED_FIELDS

    }else if(comentario.id_postagem == undefined || isNaN(comentario.id_postagem || comentario.id_postagem <= 0) || comentario.id_postagem == null || comentario.id_postagem == ''){
        MESSAGES.ERROR_REQUIRED_FIELDS.message += ' [Postagem incorreto]'
        return MESSAGES.ERROR_REQUIRED_FIELDS

    }else{
        return false
    }
}

module.exports = {
    listaComentarios,
    buscarComentarioId,
    buscarComentarioIdPostagem,
    inserirComentario,
    atualizarComentario,
    excluirComentario
}



