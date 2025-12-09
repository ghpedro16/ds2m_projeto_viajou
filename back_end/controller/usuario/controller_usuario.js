/*******************************************************************************************************************************************************************
 * Objetivo: Arquivo responsável pela manipulação de dados entre o app e a model para um CRUD de usuários
 * Data: 03/12/2025
 * Autor: Pedro Henrique Araújo da Silva
 * Versão: 1.0 
 *******************************************************************************************************************************************************************/

//Import do arquivo DAO
const usuarioDAO = require('../../model/DAO/usuario.js')

//Import do arquivo de mensagens personalizadas
const DEFAULT_MESSAGES = require('../modulo/config_messages.js')

//Lista todos os usuarios
const listarUsuarios = async function(){
    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))
    
    try {
        
        //Chama a função do DAO para retornar a lista de usuarios do BD
        let resultUsers = await usuarioDAO.getSelectAllUsers()

        if(resultUsers){
            if(resultUsers.length > 0){
                MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCCESS_REQUEST.status
                MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCCESS_REQUEST.status_code
                MESSAGES.DEFAULT_HEADER.itens.usuarios = resultUsers

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

//Busca usuario por id
const buscarUsuarioId = async function(id){
    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {

        if(!isNaN(id) && id != '' && id != null && id > 0){
            //Chama a função do DAO
            let resultUser = await usuarioDAO.getSelectUserById(Number(id))

            if(resultUser){
                if(resultUser.length > 0){
                    MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCCESS_REQUEST.status
                    MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCCESS_REQUEST.status_code
                    MESSAGES.DEFAULT_HEADER.itens.usuario = resultUser

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

//Insere um novo usuario
const inserirUsuario = async function(user, contentType){
    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        //Validação do tipo de conteúdo da requisição (OBRIGATÓRIO SER UM JSON)
        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){

            let validar = await validarDadosUsuario(user)

            if(!validar){
                //Processamento
                //Chama a função para inserir um novo usuario no banco de dados
                let resultUser = await usuarioDAO.setInsertUser(user)
                
                if(resultUser){
                    //Chama a função para receber o ID gerado no BD
                    let lastId = await usuarioDAO.getSelectLastId()
                    
                    if(lastId){
                        //Adiciona o ID no JSON de dados do usuario
                        user.id = lastId

                        MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCCESS_CREATE_ITEM.status
                        MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCCESS_CREATE_ITEM.status_code
                        MESSAGES.DEFAULT_HEADER.message = MESSAGES.SUCCESS_CREATE_ITEM.message

                        MESSAGES.DEFAULT_HEADER.itens = user
                    
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

//Atualiza um usuario
const atualizarUsuario = async function(user, id, contentType){
    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        
        //Validação do tipo de conteúdo da requisição (OBRIGATÓRIO SER UM JSON)
        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){

            //Chama a função de validar todos os dados
            let validar = await validarDadosUsuario(user)

            if(!validar){

                //Validação do ID, chamando a Controller que verifica no BD se o ID existe e valida o ID
                let validarId = await buscarUsuarioId(id)
                
                if(validarId.status_code == 200){
                    //Adiciona o ID do usuario no JSON de dados para ser encaminhado ao DAO
                    user.id = Number(id)

                    let resultUser = await usuarioDAO.setUpdateUser(user)
                
                    if(resultUser){
                        MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCCESS_UPDATE_ITEM.status
                        MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCCESS_UPDATE_ITEM.status_code
                        MESSAGES.DEFAULT_HEADER.message = MESSAGES.SUCCESS_UPDATE_ITEM.message
                        MESSAGES.DEFAULT_HEADER.itens.usuario = user
                        
                        return MESSAGES.DEFAULT_HEADER //200
                    }else{
                        return MESSAGES.ERROR_INTERNAL_SERVER_MODEL // 500
                    }
                }else{
                    return validarId // A função buscarUsuarioId poderá retornar um erro 400, 404 ou 500
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

//Exclui um usuario
const excluirUsuario = async function(id){
    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        if(!isNaN(id) && id != '' && id != null && id > 0){

            //Validação de ID válido, chama a função da controller que verifica no BD se o ID existe e valida o ID
            let validarId = await buscarUsuarioId(id)

            if(validarId.status_code == 200){

                //Chama a função do DAO
                let resultUser = await usuarioDAO.setDeleteUser(Number(id))

                if(resultUser){
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

//Valida todos os dados de inserção do usuario
const validarDadosUsuario = async function(user){
    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    if(user.nome == '' || user.nome == undefined || user.nome == null || user.nome.length > 150){
        MESSAGES.ERROR_REQUIRED_FIELDS.message += ' [Nome incorreto]'
        return MESSAGES.ERROR_REQUIRED_FIELDS

    }else if(user.email == '' || user.email == undefined || user.email == null || user.email.length > 120){
        MESSAGES.ERROR_REQUIRED_FIELDS.message += ' [E-mail incorreto]'
        return MESSAGES.ERROR_REQUIRED_FIELDS

    }else if(user.nome_usuario == '' || user.nome_usuario == undefined || user.nome_usuario == null || user.nome_usuario.length > 30){
        MESSAGES.ERROR_REQUIRED_FIELDS.message += ' [Nome de Usuário incorreto!]'
        return MESSAGES.ERROR_REQUIRED_FIELDS

    }else if(user.data_nascimento == undefined || user.data_nascimento.length != 10 || user.data_nascimento == null || user.data_nascimento == ''){
        MESSAGES.ERROR_REQUIRED_FIELDS.message += ' [Data de Nascimento incorreto]' 
        return MESSAGES.ERROR_REQUIRED_FIELDS

    }else if(user.senha == '' || user.senha == undefined || user.senha == null || user.senha.length > 25){
        MESSAGES.ERROR_REQUIRED_FIELDS.message += ' [Senha incorreto]'
        return MESSAGES.ERROR_REQUIRED_FIELDS

    }else if(user.biografia == undefined || user.biografia.length > 200){
        MESSAGES.ERROR_REQUIRED_FIELDS.message += ' [Biografia incorreto]'
        return MESSAGES.ERROR_REQUIRED_FIELDS

    }else if(user.url_foto == undefined || user.url_foto.length > 200){
        MESSAGES.ERROR_REQUIRED_FIELDS.message += ' [URL da Foto incorreto]'
    }else{
        return false
    }
}

module.exports = {
    listarUsuarios,
    buscarUsuarioId,
    inserirUsuario,
    atualizarUsuario,
    excluirUsuario
}