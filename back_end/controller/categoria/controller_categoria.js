/**************************************************************************************************
* Objetivo: Arquivo responsavel pela manipulacao de dado entre o app e a model para o CRUD do projeto Viajou!
* Data: 26/11/2025
* Autor: Gustavo Mathias
* Versao: 1.0 (CRUD do projeto Viajou!, sem as relações com outras tabelas)
***************************************************************************************************/

//Import da MODEL do DAO do filme
const categoriaDAO = require('../../model/categoria.js')

//Import do arquivo de mensagens
const DEFAULT_MESSAGES = require('../modulo/config_messages.js')


//Retorna uma lista de todas categorias
const listaCategoria = async function () {
    let resultCategoria = await categoriaDAO.getSelectAllCategorias ()

    try {
    if (resultCategoria) {
        if (resultCategoria.length > 0) {
            messages.HEADER.status            = messages.SUCESS_REQUEST.status
            messages.HEADER.status_code       = messages.SUCESS_REQUEST.status_code
            messages.HEADER.itens.categoria   = resultCategoria

            return messages.HEADER
        }else{
            return messages.ERROR_NOT_FOUND
        }

        } else {
            return messages.ERROR_INTERNAL_SERVER_MODEL
        }
    } catch (error){
        return messages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

//Retorna uma caegoria filtrada pelo ID 
const buscarCategoriaId = async function (id) {

    let messages = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        if (!isNaN(id)){

            let resultCategoria = await categoriaDAO.getSelectByIdCategoria(Number(id))

        if (resultCategoria){
            if (resultCategoria.length > 0) {
                messages.HEADER.status           = messages.SUCCESS_REQUEST.status
                messages.HEADER.status_code      = messages.SUCCESS_REQUEST.status_code
                messages.HEADER.itens.categoria  = resultCategoria

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

//Inserir uma nova categoria 

const inserirCategoria = async function (categoria,contentType) { 
  
    let messages = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {

        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {
            
            let validar = await validarDadosCategoria(categoria)

            if (!validar) {

               
                //Chama a função para inserir uma nova categoria no BD
                let resultCategoria = await categoriaDAO.setInsertCategoria(categoria)
                if (resultCategoria) {
                    let lastID = await categoriaDAO.getSelectLastID()
                    if(lastID){

                        //Adiciona o ID no JSON com os dados da categoria 
                        categoria.id = lastID
                        messages.HEADER.status      = messages.SUCCESS_CREATED_ITEM.status
                        messages.HEADER.status_code = messages.SUCCESS_CREATED_ITEM.status_code
                        messages.HEADER.message     = messages.SUCCESS_CREATED_ITEM.message
                        messages.HEADER.itens.categoria  = categoria

                        return messages.HEADER //201
                    }else{
                        return messages.ERROR_INTERNAL_SERVER_MODEL //500
                    }
                } else {
                    return messages.ERROR_INTERNAL_SERVER_MODEL //500
                }
            } else {
                return validar //400
            }
        } else {
            return messages.ERROR_CONTENT_TYPE //415
        }

    } catch (error) {
        return messages.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

//Atualiza uma categoria 

const atualizarCategoria = async function (categoria, id, contentType){

let messages = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

try { 

if (String(contentType).toUpperCase() == 'APPLICATION/JSON'){

    // Chama a função de validar todas as categorias
    let validar = await validarDadosCategoria(categoria)

    if (!validar){

        //Validação de ID valido (chama a controller)
        let validarID = await buscarCategoriaId(id)

        if (validarID.status_code == 200)

            //Adiciona o ID da categoria no JSON de dados para ser encaminhado
            categoria.id = Number(id)

        //Processamento 
        //Chama a função para inserir uma nova categoria no BD
        let resultCategoria = await categoriaDAO.setUpdadeCategoria(categoria)
        if (resultCategoria){
            messages.HEADER.status               =     messages.SUCCESS_UPDATE_ITEM.status
            messages.HEADER.status_code          =     messages.SUCCESS_UPDATE_ITEM.status_code
            messages.HEADER.message              =     messages.SUCCESS_UPDATE_ITEM.message
            messages.HEADER.itens.categoria      =     categoria

            return messages.HEADER
        }else {
            return messages.ERROR_INTERNAL_SERVER_MODEL
        }
    } else{
        return validarID
    }
}else {
    return messages.ERROR_CONTENT_TYPE
}
} catch (error) {
      
    return messages.ERROR_INTERNAL_SERVER_CONTROLLER 
}
}

const excluirCategoria = async function (id){

    let messages = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try{
        //Vlidação da chegada do ID 
        if(!isNaN(id) && id != '' && id != null && id > 0){

           //Validação de ID valido, chama a controller
           let validarID = await buscarCategoriaId(id)
           
           if(validarID.status_code == 200){

            let resultCategoria = await categoriaDAO.setDeleteCategoria(Number(id))

            if(resultCategoria){

                MESSAGES.DEFAULT_HEADER.status           = MESSAGES.SUCCESS_DELETED_ITEM.status
                MESSAGES.DEFAULT_HEADER.status_code      = MESSAGES.SUCCESS_DELETED_ITEM.status_code
                MESSAGES.DEFAULT_HEADER.message          = MESSAGES.SUCCESS_DELETED_ITEM.message
                MESSAGES.DEFAULT_HEADER.itens.categoria  = resultCategoria
                delete MESSAGES.DEFAULT_HEADER.itens
                return MESSAGES.DEFAULT_HEADER 

            }else{
                return MESSAGES.ERROR_INTERNAL_SERVER_MODEL
            }
           }else{
                return MESSAGES.ERROR_NOT_FOUND
           }
        }else{
            MESSAGES.ERROR_REQUIRED_FIELDS.message += ' [ID incorreto]'
            return MESSAGES.ERROR_REQUIRED_FIELDS
        }
    }catch (error) {
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

module.exports = {
    listaCategoria,
    buscarCategoriaId,
    inserirCategoria,
    atualizarCategoria,
    excluirCategoria
}