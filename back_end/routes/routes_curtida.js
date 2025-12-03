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

const controller_curtida = require('../controller/curtida/controller_curtida')

const PORT = process.PORT || 8080

const app = express()

//Configuração de permissões
app.use((request, response, next) => {
    response.header('Access-Control-Allow-Origin', '*')
    response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')

    app.use(cors())
    next()
})

//Rota para listar todas curtida 
app.get('/v1/viajou/curtida', cors(), async (request, response) => {
    let curtidas = await controller_curtida.listaCurtidas ()
    response.status(curtidas.status_code)
    response.json(curtidas)
})

//Rota para buscar uma curtida pelo ID 
app.get('/v1/viajou/curtida/:id', cors(), async (request, response) => {
let id = request.params.id
let curtida = await controller_curtida.buscarCurtidaId(id)
response.status(curtida.status_code)
response.json(curtida)
})

//rota para inserir nova curtida 
app.post('/v1/viajou/curtida', cors(), bodyParserJSON, async(request, response) => {
    let dadosBody    = request.body
    let contentType  = request.headers['content-type']
    let curtida    = await controller_curtida.inserirCurtida(dadosBody, contentType)
    response.status(curtida.status_code)
    response.json(curtida)
})

//Rota para atualizar uma curtida existente 
app.put('/v1/viajou/curtida/:id', cors(), bodyParserJSON, async (request, response) => {
    let idCurtida   = request.params.id
    let dadosBody   = request.body
    let contentType = request.headers['content-type']
    let curtida     = await controller_curtida.atualizarCurtida(dadosBody, idCurtida, contentType)
    response.status(curtida.status_code)
    response.json(curtida)
})

//Rota pra deletar uma curtida 
app.delete('/v1/viajou/curtida/:id', cors(), async (request, response) => {
    let idCurtida = request.params.id
    let curtida   = await controller_curtida.excluirCurtida(idCurtida)
    response.status(curtida.status_code)
    response.json(curtida)
})


//Export
module.exports = app