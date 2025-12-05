/*******************************************************************************************************************************************************************
 * Objetivo: Arquivo responsável pela manipulação de dados entre o app e a model para um CRUD na tabela relacionamento categoria_postagem
 * Data: 04/12/2025
 * Autor: Pedro Henrique Araújo da Silva
 * Versão: 1.0 
 *******************************************************************************************************************************************************************/

//Import da DAO
const categoriaPostagemDAO = require('../../model/DAO/categoria_postagem.js')

//Import do arquivo de mensagens
const DEFAULT_MESSAGES = require('../modulo/config_messages.js')

//Lista todos os generos
const listarCategoriasPostagens = async function(){
    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))
    
    try {
        //Chama a função do DAO
        let resultCategoriaPostagem = await categoriaPostagemDAO.getSelectAllCategoryPosts()

        if(resultCategoriaPostagem){
            if(resultCategoriaPostagem.length > 0){
                MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCCESS_REQUEST.status
                MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCCESS_REQUEST.status_code
                MESSAGES.DEFAULT_HEADER.itens.categoria_postagem = resultCategoriaPostagem

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

//Lista genero pelo id
const buscarCategoriaPostagemId = async function(id){
    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {

        if(!isNaN(id) && id != '' && id != null && id > 0){
            //Chama a função do DAO
            let resultCategoriaPostagem = await categoriaPostagemDAO.getSelectCategoryPostById(Number(id))

            if(resultCategoriaPostagem){
                if(resultCategoriaPostagem.length > 0){
                    MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCCESS_REQUEST.status
                    MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCCESS_REQUEST.status_code
                    MESSAGES.DEFAULT_HEADER.itens.categoria_postagem = resultCategoriaPostagem

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

//Lista genero pelo id
const buscarCategoriaIdPostagem = async function(id_postagem){
    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {

        if(!isNaN(id_postagem) && id_postagem != '' && id_postagem != null && id_postagem > 0){
            //Chama a função do DAO
            let resultCategoriaPostagem = await categoriaPostagemDAO.getSelectCategoryByIdPost(Number(id_postagem))

            if(resultCategoriaPostagem){
                if(resultCategoriaPostagem.length > 0){
                    MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCCESS_REQUEST.status
                    MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCCESS_REQUEST.status_code
                    MESSAGES.DEFAULT_HEADER.itens.categoria_postagem = resultCategoriaPostagem

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

//Lista genero pelo id
const buscarPostagemIdCategoria = async function(id_categoria){
    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {

        if(!isNaN(id_categoria) && id_categoria != '' && id_categoria != null && id_categoria > 0){
            //Chama a função do DAO
            let resultCategoriaPostagem = await categoriaPostagemDAO.getSelectPostByIdCategory(Number(id_categoria))

            if(resultCategoriaPostagem){
                if(resultCategoriaPostagem.length > 0){
                    MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCCESS_REQUEST.status
                    MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCCESS_REQUEST.status_code
                    MESSAGES.DEFAULT_HEADER.itens.categoria_postagem = resultCategoriaPostagem

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

//Insere genero
const inserirCategoriaPostagem = async function(categoriaPostagem, contentType){
    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        //Validação do tipo de conteúdo da requisição (OBRIGATÓRIO SER UM JSON)
        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){

            let validar = await validarDadosCategoriaPostagem(categoriaPostagem)

            if(!validar){
                //Processamento
                //Chama a função para inserir um novo genero no banco de dados
                let resultCategoriaPostagem = await categoriaPostagemDAO.setInsertCategoryPost(categoriaPostagem)
                
                if(resultCategoriaPostagem){
                    //Chama a função para receber o ID gerado no BD
                    let lastId = await categoriaPostagemDAO.getSelectLastId()
                    
                    if(lastId){
                        //Adiciona o ID no JSON de dados do filme
                        categoriaPostagem.id = lastId

                        MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCCESS_CREATE_ITEM.status
                        MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCCESS_CREATE_ITEM.status_code
                        MESSAGES.DEFAULT_HEADER.message = MESSAGES.SUCCESS_CREATE_ITEM.message
                        MESSAGES.DEFAULT_HEADER.itens = categoriaPostagem
                        
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

//Atualizar genero
const atualizarCategoriaPostagem = async function(categoriaPostagem, id, contentType){

    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        //Validação do tipo de conteúdo da requisição (OBRIGATÓRIO SER UM JSON)
        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){

            //Chama a função de validar todos os dados
            let validar = await validarDadosCategoriaPostagem(categoriaPostagem)

            if(!validar){

                //Validação do ID, chamando a Controller que verifica no BD se o ID existe e valida o ID
                let validarId = await buscarCategoriaPostagemId(id)

                if(validarId.status_code == 200){

                    //Adiciona o ID do filme no JSON de dados para ser encaminhado ao DAO
                    categoriaPostagem.id = Number(id)

                    //Processamento
                    //Chama a função para inserir um novo filme no banco de dados
                    let resultCategoriaPostagem = await categoriaPostagemDAO.setUpdateCategoryPost(categoriaPostagem)
                
                    if(resultCategoriaPostagem){
                        MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCCESS_UPDATE_ITEM.status
                        MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCCESS_UPDATE_ITEM.status_code
                        MESSAGES.DEFAULT_HEADER.message = MESSAGES.SUCCESS_UPDATE_ITEM.message
                        MESSAGES.DEFAULT_HEADER.itens.categoria_postagem = categoriaPostagem
                    
                        return MESSAGES.DEFAULT_HEADER //200
                    }else{
                        return MESSAGES.ERROR_INTERNAL_SERVER_MODEL // 500
                    }
                }else{
                    return validarId // A função buscarFilmeId poderá retornar um erro 400, 404 ou 500
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

//Excluir genero
const excluirCategoriaPostagem = async function(id){

    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        if(!isNaN(id) && id != '' && id != null && id > 0){

            //Validação de ID válido, chama a função da controller que verifica no BD se o ID existe e valida o ID
            let validarId = await buscarCategoriaPostagemId(id)

            if(validarId.status_code == 200){

                //Chama a função do DAO
                let resultCategoriaPostagem = await categoriaPostagemDAO.setDeleteCategoryPost(Number(id))

                if(resultCategoriaPostagem){

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

const validarDadosCategoriaPostagem = async function(categoriaPostagem){
    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    if (categoriaPostagem.id_categoria == '' || categoriaPostagem.id_categoria == undefined || categoriaPostagem.id_categoria == null || isNaN(categoriaPostagem.id_categoria || categoriaPostagem.id_categoria <= 0)) {
        MESSAGES.ERROR_REQUIRED_FIELDS.message += ' [id_categoria incorreto]'
        return MESSAGES.ERROR_REQUIRED_FIELDS

    } else if(categoriaPostagem.id_postagem == '' || categoriaPostagem.id_postagem == undefined || categoriaPostagem.id_postagem == null || isNaN(categoriaPostagem.id_postagem || categoriaPostagem.id_postagem <= 0)){
        MESSAGES.ERROR_REQUIRED_FIELDS.message += ' [id_postagem incorreto]'
        return MESSAGES.ERROR_REQUIRED_FIELDS
    } else {
        return false
    }
}

module.exports = {
    listarCategoriasPostagens,
    buscarCategoriaPostagemId,
    buscarCategoriaIdPostagem,
    buscarPostagemIdCategoria,
    inserirCategoriaPostagem,
    atualizarCategoriaPostagem,
    excluirCategoriaPostagem
}