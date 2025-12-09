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
    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))
    
    try {
        
        //Chama a função do DAO para retornar a lista de midias do BD
        let resultMidias = await midiaDAO.getSelectAllMidia()

        if(resultMidias){
            if(resultMidias.length > 0){
                MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCCESS_REQUEST.status
                MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCCESS_REQUEST.status_code
                MESSAGES.DEFAULT_HEADER.itens.midias = resultMidias

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

//Busca uma midia pelo ID
const buscarMidiaId = async function (id) {
    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {

        if(!isNaN(id) && id != '' && id != null && id > 0){
            //Chama a função do DAO
            let resultMidia = await midiaDAO.getSelectMidiaById(Number(id))

            if(resultMidia){
                if(resultMidia.length > 0){
                    MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCCESS_REQUEST.status
                    MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCCESS_REQUEST.status_code
                    MESSAGES.DEFAULT_HEADER.itens.midia = resultMidia
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

//Busca as midias da postagem
const buscarMidiaIdPostagem = async function(id_postagem){
    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))
    
    try {
        if(!isNaN(id_postagem) && id_postagem != '' && id_postagem != null && id_postagem > 0){

            //Chama a função do DAO para retornar a lista de midia do BD
            let resultMidia = await midiaDAO.getSelectMidiaByIdPost(Number(id_postagem))

            if(resultMidia){
                if(resultMidia.length > 0){
                    MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCCESS_REQUEST.status
                    MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCCESS_REQUEST.status_code
                    MESSAGES.DEFAULT_HEADER.itens.midias = resultMidia

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

const inserirMidia = async function (midia, contentType) {
    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        //Validação do tipo de conteúdo da requisição (OBRIGATÓRIO SER UM JSON)
        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){

            let validar = await validarDadosMidia(midia)

            if(!validar){
                //Processamento
                //Chama a função para inserir uma nova midia no banco de dados
                let resultMidia = await midiaDAO.setInsertMidia(midia)
                
                if(resultMidia){
                    //Chama a função para receber o ID gerado no BD
                    let lastId = await midiaDAO.getSelectLastID()
                    
                    if(lastId){
                        //Adiciona o ID no JSON de dados da midia
                        midia.id = lastId

                        MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCCESS_CREATE_ITEM.status
                        MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCCESS_CREATE_ITEM.status_code
                        MESSAGES.DEFAULT_HEADER.message = MESSAGES.SUCCESS_CREATE_ITEM.message

                        MESSAGES.DEFAULT_HEADER.itens = midia
                    
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

const atualizarMidia = async function (midia, id, contentType) {
    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        //Validação do tipo de conteúdo da requisição (OBRIGATÓRIO SER UM JSON)
        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){

            //Chama a função de validar todos os dados
            let validar = await validarDadosMidia(midia)

            if(!validar){

                //Validação do ID, chamando a Controller que verifica no BD se o ID existe e valida o ID
                let validarId = await buscarMidiaId(id)
                
                if(validarId.status_code == 200){
                    //Adiciona o ID da midia no JSON de dados para ser encaminhado ao DAO
                    midia.id = Number(id)

                    let resultMidia = await midiaDAO.setUpdadeMidia(midia)
                
                    if(resultMidia){
                        MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCCESS_UPDATE_ITEM.status
                        MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCCESS_UPDATE_ITEM.status_code
                        MESSAGES.DEFAULT_HEADER.message = MESSAGES.SUCCESS_UPDATE_ITEM.message
                        MESSAGES.DEFAULT_HEADER.itens.midia = midia
                        
                        return MESSAGES.DEFAULT_HEADER //200
                    }else{
                        return MESSAGES.ERROR_INTERNAL_SERVER_MODEL // 500
                    }
                }else{
                    return validarId // A função buscarMidiaID poderá retornar um erro 400, 404 ou 500
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

//Exclui uma midia do BD
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

//Valida todos os dados da midia
const validarDadosMidia = async function(midia){
    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    if(midia.url == '' || midia.url == undefined || midia.url == null || midia.url.length > 200){
        MESSAGES.ERROR_REQUIRED_FIELDS.message += ' [Midia incorreto]'
        return MESSAGES.ERROR_REQUIRED_FIELDS
    }else if(midia.id_postagem == undefined || isNaN(midia.id_postagem || midia.id_postagem <= 0) || midia.id_postagem == null || midia.id_postagem == ''){
        MESSAGES.ERROR_REQUIRED_FIELDS.message += ' [id_postagem incorreto]'
        return MESSAGES.ERROR_REQUIRED_FIELDS        
    }else{
        return false
    }
}

module.exports = {
    listaMidia,
    buscarMidiaId,
    buscarMidiaIdPostagem,
    inserirMidia,
    atualizarMidia,
    excluirMidia
}
