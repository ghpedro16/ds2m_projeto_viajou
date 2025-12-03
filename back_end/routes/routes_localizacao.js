/**************************************************************************************************
<<<<<<< HEAD
 * Objetivo: Arquivo responsavel pela rota
 * Data: 03/12/2025
 * Autor: Gustavo Mathias
 * Versao: 1.0
 ***************************************************************************************************/

const express       =    require('express')
const cors          =    require('cors')
const bodyParser    =    require('body-parser')
=======
 * Objetivo: Arquivo responsavel pela rota de localizacao
 * Data: 03/12/2025
 * Autor: Guilherme Moreira
 * Versao: 1.0
 ***************************************************************************************************/

const express       = require('express')
const cors          = require('cors')
const bodyParser    = require('body-parser')
>>>>>>> bec2fb4c61b20f7660c29ea3a6700f92b8e23d77

//Cria um objeto especialista no formato JSON para receber dados via POST e PUT
const bodyParserJSON = bodyParser.json()

<<<<<<< HEAD
const controller_localizacao = require('../controller/localizacao/controller_localizacao')
=======
const controller_localizacao = require('../controller/localizacao/controller_localizacao.js')
>>>>>>> bec2fb4c61b20f7660c29ea3a6700f92b8e23d77

const PORT = process.PORT || 8080

const app = express()

//Configuração de permissões
app.use((request, response, next) => {
    response.header('Access-Control-Allow-Origin', '*')
    response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')

    app.use(cors())
    next()
})

<<<<<<< HEAD
//Rota para listar todas localizacoes 
app.get('/v1/viajou/localizacao', cors(), async (request, response) => {
    let localizacao = await controller_localizacao.listaLocalizacao();
    response.status(localizacao.status_code)
    response.json(localizacao)
})

//Rota para buscar uma localizacao pelo ID 
app.get('/v1/viajou/localizacao/:id', cors(), async (request, response) => {
let id = request.params.id
let localizacao = await controller_localizacao.buscarLocalizacaoId(id);
response.status(localizacao.status_code)
response.json(localizacao)
})

//rota para inserir nova localizacao 
app.post('/v1/viajou/localizacao', cors(), bodyParserJSON, async(request, response) => {
    let dadosBody    = request.body
    let contentType  = request.headers['content-type']
    let localizacao = await controller_localizacao.inserirLocalizacao(dadosBody, contentType);
=======
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
>>>>>>> bec2fb4c61b20f7660c29ea3a6700f92b8e23d77
    response.status(localizacao.status_code)
    response.json(localizacao)
})

<<<<<<< HEAD
//Rota para atualizar uma localizacao existente 
=======
//Rota para inserir nova localização 
app.post('/v1/viajou/localizacao', cors(), bodyParserJSON, async (request, response) => {
    let dadosBody   = request.body
    let contentType = request.headers['content-type']
    let localizacao = await controller_localizacao.inserirLocalizacao(dadosBody, contentType)
    response.status(localizacao.status_code)
    response.json(localizacao)
})

//Rota para atualizar uma localização existente 
>>>>>>> bec2fb4c61b20f7660c29ea3a6700f92b8e23d77
app.put('/v1/viajou/localizacao/:id', cors(), bodyParserJSON, async (request, response) => {
    let idLocalizacao = request.params.id
    let dadosBody     = request.body
    let contentType   = request.headers['content-type']
<<<<<<< HEAD
    let localizacao = await controller_localizacao.atualizarLocalizacao(dadosBody, idLocalizacao, contentType);
=======
    let localizacao   = await controller_localizacao.atualizarLocalizacao(dadosBody, idLocalizacao, contentType)
>>>>>>> bec2fb4c61b20f7660c29ea3a6700f92b8e23d77
    response.status(localizacao.status_code)
    response.json(localizacao)
})

<<<<<<< HEAD
//Rota pra deletar uma localizacao 
app.delete('/v1/viajou/localizacao/:id', cors(), async (request, response) => {
    let idLocalizacao = request.params.id
    let localizacao = await controller_localizacao.excluirLocalizacao(idLocalizacao);
=======
//Rota pra deletar uma localização 
app.delete('/v1/viajou/localizacao/:id', cors(), async (request, response) => {
    let idLocalizacao = request.params.id
    let localizacao   = await controller_localizacao.excluirLocalizacao(idLocalizacao)
>>>>>>> bec2fb4c61b20f7660c29ea3a6700f92b8e23d77
    response.status(localizacao.status_code)
    response.json(localizacao)
})


//Export
module.exports = app
