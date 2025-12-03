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

const controller_categoria = require('../controller/comentario/controller_comentario')

const PORT = process.PORT || 8080

const app = express()

//Configuração de permissões
app.use((request, response, next) => {
    response.header('Access-Control-Allow-Origin', '*')
    response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')

    app.use(cors())
    next()
})

//Rota para listar todos comentarios 
app.get('/v1/viajou/comentario', cors(), async (request, response) => {
    let comentario = await controller_comentario.listaComentarios()
    response.status(comentario.status_code)
    response.json(comentario)
})

//Rota para buscar uma comentario pelo ID 
app.get('/v1/viajou/comentario/:id', cors(), async (request, response) => {
let id = request.params.id
let comentario = await controller_comentario.buscarComentarioId(id)
response.status(comentario.status_code)
response.json(comentario)
})

//rota para inserir um novo comentario
app.post('/v1/viajou/comentario', cors(), bodyParserJSON, async(request, response) => {
    let dadosBody    = request.body
    let contentType  = request.headers['content-type']
    let comentario   = await controller_comentario.inserirComentario(dadosBody, contentType)
    response.status(comentario.status_code)
    response.json(comentario)
})

//Rota para atualizar um comentario existente 
app.put('/v1/viajou/comentario/:id', cors(), bodyParserJSON, async (request, response) => {
    let idComentario = request.params.id
    let dadosBody    = request.body
    let contentType  = request.headers['content-type']
    let comentario   = await controller_comentario.atualizarComentario(dadosBody, idComentario, contentType)
    response.status(comentario.status_code)
    response.json(comentario)
})

//Rota para deletar um comentario
app.delete('/v1/viajou/comentario/:id', cors(), async (request, response) => {
    let idComentario = request.params.id
    let comentario   = await controller_comentario.excluirComentario(idComentario)
    response.status(comentario.status_code)
    response.json(comentario)
})


//Export
module.exports = app