/*******************************************************************************************************************************************************************
 * Objetivo: Arquivo responsável pela manipulação de dados entre o app e a model para um CRUD de auto relacionamento de usuarios
 * Data: 03/12/2025
 * Autor: Pedro Henrique Araújo da Silva
 * Versão: 1.0 
 *******************************************************************************************************************************************************************/

//Import do arquivo DAO
const usuarioSeguidoresDAO = require('../../model/DAO/usuario_seguidores.js')

//Import do arquivo de mensagens personalizadas
const DEFAULT_MESSAGES = require('../modulo/config_messages.js')

//Lista todos os usuarios que o usuario esta seguindo
const listarSeguindosUsuario = async function(id_usuario){
    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {

        if(!isNaN(id_usuario) && id_usuario != '' && id_usuario != null && id_usuario > 0){
            //Chama a função do DAO
            let resultSeguindo = await usuarioSeguidoresDAO.getSelectFollowingByIdUser(Number(id_usuario))

            if(resultSeguindo){
                if(resultSeguindo.length > 0){
                    MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCCESS_REQUEST.status
                    MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCCESS_REQUEST.status_code
                    MESSAGES.DEFAULT_HEADER.itens.seguindos = resultSeguindo

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

//Lista todos os usuarios que seguem o usuario
const listarSeguidoresUsuario = async function(id_usuario){
    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {

        if(!isNaN(id_usuario) && id_usuario != '' && id_usuario != null && id_usuario > 0){
            //Chama a função do DAO
            let resultSeguidor = await usuarioSeguidoresDAO.getSelectFollowerByIdUser(Number(id_usuario))

            if(resultSeguidor){
                if(resultSeguidor.length > 0){
                    MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCCESS_REQUEST.status
                    MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCCESS_REQUEST.status_code
                    MESSAGES.DEFAULT_HEADER.itens.seguidores = resultSeguidor

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

//Busca na tabela relacional usuario seguidores pelo id
const buscarUsuarioSeguidorId = async function (id) {

    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {

        if(!isNaN(id) && id != '' && id != null && id > 0){
            //Chama a função do DAO
            let resultUsuarioSeguidores = await usuarioSeguidoresDAO.getSelectUserFollowById(Number(id))

            if(resultUsuarioSeguidores){
                if(resultUsuarioSeguidores.length > 0){
                    MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCCESS_REQUEST.status
                    MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCCESS_REQUEST.status_code
                    MESSAGES.DEFAULT_HEADER.itens.usuario_seguidores = resultUsuarioSeguidores
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

//Insere um seguindo (Segue outro usuario)
const inserirSeguindo = async function(userSeguindo, contentType){
    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        //Validação do tipo de conteúdo da requisição (OBRIGATÓRIO SER UM JSON)
        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){

            let validar = await validarDadosUsuario(userSeguindo)

            if(!validar){
                //Processamento
                //Chama a função para inserir um novo seguindo no banco de dados
                let resultSeguindo = await usuarioSeguidoresDAO.setInsertUserFollow(userSeguindo)
                
                if(resultSeguindo){
                    //Chama a função para receber o ID gerado no BD
                    let lastId = await usuarioSeguidoresDAO.getSelectLastId()
                    
                    if(lastId){
                        //Adiciona o ID no JSON de dados do usuario seguindo
                        userSeguindo.id = lastId

                        MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCCESS_CREATE_ITEM.status
                        MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCCESS_CREATE_ITEM.status_code
                        MESSAGES.DEFAULT_HEADER.message = MESSAGES.SUCCESS_CREATE_ITEM.message

                        MESSAGES.DEFAULT_HEADER.itens = userSeguindo
                    
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

//Exclui um seguindo (deixa de seguir)
const excluirSeguindo = async function(id){
    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        if(!isNaN(id) && id != '' && id != null && id > 0){

            //Validação de ID válido, chama a função da controller que verifica no BD se o ID existe e valida o ID
            let validarId = await buscarUsuarioSeguidorId(id)

            if(validarId.status_code == 200){

                //Chama a função do DAO
                let resultUsuarioSeguidores = await usuarioSeguidoresDAO.setDeleteUserFollow(Number(id))

                if(resultUsuarioSeguidores){
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

//Valida os dados do usuario seguidores
const validarDadosUsuario = async function (usuario){

    if(usuario.id_usuario_seguindo == undefined || isNaN(usuario.id_usuario_seguindo || usuario.id_usuario_seguindo <= 0) || usuario.id_usuario_seguindo == null || usuario.id_usuario_seguindo == ''){
        MESSAGES.ERROR_REQUIRED_FIELDS.message += ' [Seguindo incorreto]'
        return MESSAGES.ERROR_REQUIRED_FIELDS

    }else if(usuario.id_usuario_seguidor == undefined || isNaN(usuario.id_usuario_seguidor || usuario.id_usuario_seguidor <= 0) || usuario.id_usuario_seguidor == null || usuario.id_usuario_seguidor == ''){
        MESSAGES.ERROR_REQUIRED_FIELDS.message += ' [Seguidor incorreto]'
        return MESSAGES.ERROR_REQUIRED_FIELDS

    }else{
        return false
    }
}

module.exports = {
    listarSeguindosUsuario,
    listarSeguidoresUsuario,
    buscarUsuarioSeguidorId,
    inserirSeguindo,
    excluirSeguindo
}