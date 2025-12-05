/*******************************************************************************************************************************************************************
 * Objetivo: Arquivo responsável pela manipulação de dados entre o app e a model para um CRUD de postagens
 * Data: 03/12/2025
 * Autor: Pedro Henrique Araújo da Silva
 * Versão: 1.0 
 *******************************************************************************************************************************************************************/

//Import do arquivo DAO
const postagemDAO = require('../../model/DAO/postagem.js')

//Import da controller do usuario
const controllerUsuario = require('../usuario/controller_usuario.js')

//Import da controller da tabela relacional categoria_postagem
const controllerCategoriaPostagem = require('./controller_categoria_postagem.js')

//Import do arquivo de mensagens personalizadas
const DEFAULT_MESSAGES = require('../modulo/config_messages.js')

const listarPostagens = async function(){
    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        //Chama a função do DAO para retornar a lista de usuarios do BD
        let resultPosts = await postagemDAO.getSelectAllPostagens()

        if(resultPosts){
            if(resultPosts.length > 0){

                for(post of resultPosts){
                    //Encaminha o JSON com o id
                    let resultCategorias = await controllerCategoriaPostagem.buscarCategoriaIdPostagem(post.id)

                    if(resultCategorias.status_code == 200){
                        post.categoria = resultCategorias.itens.categoria_postagem
                    }
                }

                MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCCESS_REQUEST.status
                MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCCESS_REQUEST.status_code
                MESSAGES.DEFAULT_HEADER.itens.postagens = resultPosts

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

const buscarPostagemId = async function(id){
    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))
    
    try {
        if(!isNaN(id) && id != '' && id != null && id > 0){

            //Chama a função do DAO para retornar a lista de usuarios do BD
            let resultPost = await postagemDAO.getSelectPostagemById(Number(id))

            if(resultPost){
                if(resultPost.length > 0){

                    for(post of resultPost){
                        //Encaminha o JSON com o id
                        let resultCategorias = await controllerCategoriaPostagem.buscarCategoriaIdPostagem(post.id)
    
                        if(resultCategorias.status_code == 200){
                            post.categoria = resultCategorias.itens.categoria_postagem
                        }
                    }

                    MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCCESS_REQUEST.status
                    MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCCESS_REQUEST.status_code
                    MESSAGES.DEFAULT_HEADER.itens.postagem = resultPost

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

const buscarPostagemIdUsuario = async function(id_usuario){
    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))
    
    try {
        if(!isNaN(id_usuario) && id_usuario != '' && id_usuario != null && id_usuario > 0){

            //Chama a função do DAO para retornar a lista de usuarios do BD
            let resultPost = await postagemDAO.getSelectPostagemByIdUser(Number(id_usuario))

            if(resultPost){
                if(resultPost.length > 0){

                    for(post of resultPost){
                        //Encaminha o JSON com o id
                        let resultCategorias = await controllerCategoriaPostagem.buscarCategoriaIdPostagem(post.id)
    
                        if(resultCategorias.status_code == 200){
                            post.categoria = resultCategorias.itens.categoria_postagem
                        }
                    }
                    
                    MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCCESS_REQUEST.status
                    MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCCESS_REQUEST.status_code
                    MESSAGES.DEFAULT_HEADER.itens.postagens = resultPost

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

const inserirPostagem = async function(post, contentType){
    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        //Validação do tipo de conteúdo da requisição (OBRIGATÓRIO SER UM JSON)
        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){

            let validar = await validarDadosPostagem(post)

            if(!validar){

                //Valida se o usuario existe
                let validarIdUser = await controllerUsuario.buscarUsuarioId(post.id_usuario)

                if(validarIdUser.status_code == 200){
                //Chama a função para inserir um novo filme no banco de dados
                let resultPost = await postagemDAO.setInsertPostagem(post)
                
                    if(resultPost){
                    //Chama a função para receber o ID gerado no BD
                    let lastId = await postagemDAO.getSelectLastId()

                        if(lastId){

                            for(categoria of post.categoria){
                                //Cria o JSON com o id do filme e o id do genero
                                let categoriaPostagem = {id_postagem: lastId, id_categoria: categoria.id}
    
                                //Encaminha o JSON com o id do filme e do genero para a controller de filme_genero
                                let resultCategoriaPostagem = await controllerCategoriaPostagem.inserirCategoriaPostagem(categoriaPostagem, contentType)
    
                                if(resultCategoriaPostagem.status_code != 201){
                                    return MESSAGES.ERROR_RELATIONAL_INSERTION
                                }
                            }            

                            //Adiciona o ID no JSON de dados do post
                            post.id = lastId

                            MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCCESS_CREATE_ITEM.status
                            MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCCESS_CREATE_ITEM.status_code
                            MESSAGES.DEFAULT_HEADER.message = MESSAGES.SUCCESS_CREATE_ITEM.message
                            
                            delete post.categoria
                            let resultDadosCategoria = await controllerCategoriaPostagem.buscarCategoriaIdPostagem(lastId)
                            post.categoria = resultDadosCategoria.itens.categoria_postagem

                            MESSAGES.DEFAULT_HEADER.itens = post
                    
                            return MESSAGES.DEFAULT_HEADER //201
                        }else{
                            return MESSAGES.ERROR_INTERNAL_SERVER_MODEL
                        }
                    }else{
                        return MESSAGES.ERROR_INTERNAL_SERVER_MODEL // 500
                    }
                }else{
                    MESSAGES.ERROR_REQUIRED_FIELDS.message += ' [ID Usuario Incorreto!]'
                    return MESSAGES.ERROR_REQUIRED_FIELDS // 400
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

const atualizarPostagem = async function(post, id, contentType){
    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        //Validação do tipo de conteúdo da requisição (OBRIGATÓRIO SER UM JSON)
        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){

            //Chama a função de validar todos os dados
            let validar = await validarDadosUpdatePostagem(post)

            if(!validar){

                //Validação do ID, chamando a Controller que verifica no BD se o ID existe e valida o ID
                let validarId = await buscarPostagemId(id)

                if(validarId.status_code == 200){
                    //Adiciona o ID do filme no JSON de dados para ser encaminhado ao DAO
                    post.id = Number(id)

                    //Processamento
                    //Chama a função para inserir um novo filme no banco de dados
                    let resultPost = await postagemDAO.setUpdatePostagem(post)
                
                    if(resultPost){
                        MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCCESS_UPDATE_ITEM.status
                        MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCCESS_UPDATE_ITEM.status_code
                        MESSAGES.DEFAULT_HEADER.message = MESSAGES.SUCCESS_UPDATE_ITEM.message
                        MESSAGES.DEFAULT_HEADER.itens.postagem = post
                    
                        return MESSAGES.DEFAULT_HEADER //200
                    }else{
                        return MESSAGES.ERROR_INTERNAL_SERVER_MODEL // 500
                    }
                }else{
                    return validarId // A função buscarPostagemId poderá retornar um erro 400, 404 ou 500
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

const excluirPostagem = async function(id){
    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        if(!isNaN(id) && id != '' && id != null && id > 0){

            //Validação de ID válido, chama a função da controller que verifica no BD se o ID existe e valida o ID
            let validarId = await buscarPostagemId(id)

            if(validarId.status_code == 200){

                //Chama a função do DAO
                let resultPost = await postagemDAO.setDeletePostagem(Number(id))

                if(resultPost){
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

const validarDadosPostagem = async function(post){
    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    if(post.titulo == '' || post.titulo == undefined || post.titulo == null || post.titulo.length > 80){
        MESSAGES.ERROR_REQUIRED_FIELDS.message += ' [Titulo incorreto]'
        return MESSAGES.ERROR_REQUIRED_FIELDS

    }else if(post.descricao == undefined || post.descricao.length > 350){
        MESSAGES.ERROR_REQUIRED_FIELDS.message += ' [Descricao incorreto!]'
        return MESSAGES.ERROR_REQUIRED_FIELDS

    }else if(post.publico == undefined){
        MESSAGES.ERROR_REQUIRED_FIELDS.message += ' [Publico incorreto]' 
        return MESSAGES.ERROR_REQUIRED_FIELDS

    }else if(post.id_usuario == undefined || isNaN(post.id_usuario || post.id_usuario <= 0) || post.id_usuario == null || post.id_usuario == ''){
        MESSAGES.ERROR_REQUIRED_FIELDS.message += ' [id_usuario incorreto]'
        return MESSAGES.ERROR_REQUIRED_FIELDS
    }else{
        return false
    }
}

const validarDadosUpdatePostagem = async function(post){
    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    if(post.titulo == '' || post.titulo == undefined || post.titulo == null || post.titulo.length > 80){
        MESSAGES.ERROR_REQUIRED_FIELDS.message += ' [Titulo incorreto]'
        return MESSAGES.ERROR_REQUIRED_FIELDS

    }else if(post.descricao == undefined || post.descricao.length > 350){
        MESSAGES.ERROR_REQUIRED_FIELDS.message += ' [Descricao incorreto!]'
        return MESSAGES.ERROR_REQUIRED_FIELDS

    }else if(post.publico == undefined){
        MESSAGES.ERROR_REQUIRED_FIELDS.message += ' [Publico incorreto]' 
        return MESSAGES.ERROR_REQUIRED_FIELDS
    }else{
        return false
    }
}

module.exports = {
    listarPostagens,
    buscarPostagemId,
    buscarPostagemIdUsuario,
    inserirPostagem,
    atualizarPostagem,
    excluirPostagem
}