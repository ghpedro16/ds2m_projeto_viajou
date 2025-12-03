/**************************************************************************************************
 * Objetivo: Arquivo responsavel pela rota de localizacao
 * Data: 03/12/2025
 * Autor: Guilherme Moreira
 * Versao: 1.0
 ***************************************************************************************************/

const express       = require('express')
const cors          = require('cors')
const bodyParser    = require('body-parser')

//Cria um objeto especialista no formato JSON para receber dados via POST e PUT
const bodyParserJSON = bodyParser.json()

const controller_localizacao = require('../controller/localizacao/controller_localizacao.js')

const PORT = process.PORT || 8080

const app = express()

//Configuração de permissões
app.use((request, response, next) => {
    response.header('Access-Control-Allow-Origin', '*')
    response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')

    app.use(cors())
    next()
})

/* ========================= ROTAS DE LOCALIZAÇÃO ========================= */

//Rota para listar todas localizações 
app.get('/v1/viajou/localizacao', cors(), async (request, response) => {
    let localizacoes = await controller_localizacao.listaLocalizacao()
    response.status(localizacoes.status_code)
    response.json(localizacoes)
})

//Rota para buscar uma localização pelo ID 
app.get('/v1/viajou/localizacao/:id', cors(), async (request, response) => {
    let id = request.params.id
    let localizacao = await controller_localizacao.buscarLocalizacaoId(id)
    response.status(localizacao.status_code)
    response.json(localizacao)
})

//Rota para inserir nova localização 
app.post('/v1/viajou/localizacao', cors(), bodyParserJSON, async (request, response) => {
    let dadosBody   = request.body
    let contentType = request.headers['content-type']
    let localizacao = await controller_localizacao.inserirLocalizacao(dadosBody, contentType)
    response.status(localizacao.status_code)
    response.json(localizacao)
})

//Rota para atualizar uma localização existente 
app.put('/v1/viajou/localizacao/:id', cors(), bodyParserJSON, async (request, response) => {
    let idLocalizacao = request.params.id
    let dadosBody     = request.body
    let contentType   = request.headers['content-type']
    let localizacao   = await controller_localizacao.atualizarLocalizacao(dadosBody, idLocalizacao, contentType)
    response.status(localizacao.status_code)
    response.json(localizacao)
})

//Rota pra deletar uma localização 
app.delete('/v1/viajou/localizacao/:id', cors(), async (request, response) => {
    let idLocalizacao = request.params.id
    let localizacao   = await controller_localizacao.excluirLocalizacao(idLocalizacao)
    response.status(localizacao.status_code)
    response.json(localizacao)
})


//Export
module.exports = app
