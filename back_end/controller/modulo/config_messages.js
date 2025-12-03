/**************************************************************************************************************************************************
* Objetivo: Arquivo responsavel pelos padroes de mensagens que o projeto ira realizar, sepre no formato JSON (Mensagens de erro e sucesso)
* Data: 26/11/2025
* Autor: Gustavo Mathias
* Versao: 1.0 

* Autor: Guilherme Moreira
* Versao: 1.1
* Descrição: Mensagem de delete adicionada
**************************************************************************************************************************************************/

/* MENSAGENS PADRONIZADAS */
const data = new Date()

const DEFAULT_HEADER = {
    developments: "Gustavo Mathias, Guilherme Moreira, Pedro Silva",
    api_description: "API para manipular dados do projeto Viajou!",
    request_date: data.toLocaleString(),
    status: Boolean,
    status_code: Number,
    itens: {}
}


/* MENSAGENS DE SUCESSO */
const SUCCESS_REQUEST = {
    status: true,
    status_code: 200, 
    message: "Requisição bem sucedida!"
}

const SUCCESS_CREATED_ITEM = {
    status: true,
    status_code: 201, 
    message: "Item criado com sucesso!!"
}
const SUCCESS_UPDATE_ITEM = {
    status: true,
    status_code: 200, 
    message: "Item atualizado com sucesso!!"
}

const SUCCESS_DELETED_ITEM = {
    status: true,
    status_code: 200, 
    message: "Item deletado com sucesso!!"
}


/* MENSAGENS DE ERRO */
const ERROR_NOT_FOUND = {
    status: false,
    status_code: 404,
    message: "Não foram encontrados dados de retorno"
}

const ERROR_INTERNAL_SERVER_CONTROLLER = {
    status: false,
    status_code: 500,
    message: "Não foi possível processar a requisição devido a erros internos no servidor (CONTROLLER!)"
}

const ERROR_INTERNAL_SERVER_MODEL = {
    status: false,
    status_code: 500,
    message: "Não foi possível processar a requisição devido a erros internos no servidor (MODEL!)"
}

const ERROR_REQUIRED_FIELDS = {
    status: false,
    status_code: 400,
    message: "Não foi possível processar a requisição pois existem campos obrigatórios que devem ser encaminhados e atendidos confome a documentação"
}

const ERROR_CONTENT_TYPE = {
    status: false,
    status_code: 415,
    message: "Não foi possivel processar a requisição, pois o tipo de dados enviado no corpo deve ser JSON !!!"
}

const ERROR_RELATION_INSERTION = {  
    status: false,
    status_code: 500,
    message: "A requisição do item principal foi processada com sucesso, porem houveram problemas ao inserir dados na tabela de relação!!!"
}

module.exports = {
    DEFAULT_HEADER,
    SUCCESS_REQUEST,
    SUCCESS_CREATED_ITEM,
    SUCCESS_UPDATE_ITEM,
    SUCCESS_DELETED_ITEM,
    ERROR_NOT_FOUND,
    ERROR_INTERNAL_SERVER_CONTROLLER,
    ERROR_INTERNAL_SERVER_MODEL,
    ERROR_REQUIRED_FIELDS,
    ERROR_CONTENT_TYPE,
    ERROR_RELATION_INSERTION
}