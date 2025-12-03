/**************************************************************************************************
 * Objetivo: Arquivo responsavel pela rota
 * Data: 03/12/2025
 * Autor: Gustavo Mathias
 * Versao: 1.0
 ***************************************************************************************************/

const express       =    require('express')
const cors          =    require('cors')
const bodyParser    =    require('body-parser')

//Cria um objeto especialista no formato JSON para receber dados via POST e PUT
const bodyParserJSON = bodyParser.json()

const controller_itens_salvos = require('../controller/item/controller_item_salvo')

const PORT = process.PORT || 8080

const app = express()

//Configuração de permissões
app.use((request, response, next) => {
    response.header('Access-Control-Allow-Origin', '*')
    response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')

    app.use(cors())
    next()
})

//Rota para listar todos item 
app.get('/v1/viajou/item', cors(), async (request, response) => {
    let item = await controller_itens_salvos.listaItensSalvos ()
    response.status(item.status_code)
    response.json(item)
})

//Rota para buscar um item pelo ID 
app.get('/v1/viajou/item/:id', cors(), async (request, response) => {
let id = request.params.id
let item = await controller_itens_salvos.buscarItemSalvoId(id)
response.status(item.status_code)
response.json(item)
})

//rota para inserir novo item 
app.post('/v1/viajou/item', cors(), bodyParserJSON, async(request, response) => {
    let dadosBody    = request.body
    let contentType  = request.headers['content-type']
    let item    = await controller_itens_salvos.inserirItemSalvo(dadosBody, contentType)
    response.status(item.status_code)
    response.json(item)
})

//Rota para atualizar uma item existente 
app.put('/v1/viajou/item/:id', cors(), bodyParserJSON, async (request, response) => {
    let idItem   = request.params.id
    let dadosBody   = request.body
    let contentType = request.headers['content-type']
    let item     = await controller_itens_salvos.atualizarItemSalvo(dadosBody, idItem, contentType)
    response.status(item.status_code)
    response.json(item)
})

//Rota pra deletar um item 
app.delete('/v1/viajou/item/:id', cors(), async (request, response) => {
    let idItem = request.params.id
    let item   = await controller_itens_salvos.excluirItemSalvo(idItem)
    response.status(item.status_code)
    response.json(item)
})


//Export
module.exports = app
