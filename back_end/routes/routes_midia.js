/**************************************************************************************************
 * Objetivo: Arquivo responsavel pela rota de midia
 * Data: 03/12/2025
 * Autor: Guilherme Moreira
 * Versao: 1.0
 ***************************************************************************************************/

const express       = require('express')
const cors          = require('cors')
const bodyParser    = require('body-parser')


const bodyParserJSON = bodyParser.json()

const controller_midia = require('../controller/midia/controller_midia.js')

const PORT = process.PORT || 8080

const app = express()

//Configuração de permissões
app.use((request, response, next) => {
    response.header('Access-Control-Allow-Origin', '*')
    response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')

    app.use(cors())
    next()
})

//Rota para listar todas as mídias
app.get('/v1/viajou/midia', cors(), async (request, response) => {
    let midias = await controller_midia.listaMidia()
    response.status(midias.status_code)
    response.json(midias)
})

//Rota para buscar uma mídia pelo ID 
app.get('/v1/viajou/midia/:id', cors(), async (request, response) => {
    let id = request.params.id
    let midia = await controller_midia.buscarMidiaId(id)
    response.status(midia.status_code)
    response.json(midia)
})

//Rota para inserir nova mídia
app.post('/v1/viajou/midia', cors(), bodyParserJSON, async (request, response) => {
    let dadosBody   = request.body
    let contentType = request.headers['content-type']
    let midia       = await controller_midia.inserirMidia(dadosBody, contentType)
    response.status(midia.status_code)
    response.json(midia)
})

//Rota para atualizar uma mídia existente 
app.put('/v1/viajou/midia/:id', cors(), bodyParserJSON, async (request, response) => {
    let idMidia     = request.params.id
    let dadosBody   = request.body
    let contentType = request.headers['content-type']
    let midia       = await controller_midia.atualizarMidia(dadosBody, idMidia, contentType)
    response.status(midia.status_code)
    response.json(midia)
})

//Rota para deletar uma mídia 
app.delete('/v1/viajou/midia/:id', cors(), async (request, response) => {
    let idMidia = request.params.id
    let midia   = await controller_midia.excluirMidia(idMidia)
    response.status(midia.status_code)
    response.json(midia)
})

//Export
module.exports = app
