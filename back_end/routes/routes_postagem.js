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

const controller_postagem = require('../controller/postagem/controller_postagem')

const PORT = process.PORT || 8080

const app = express()

//Configuração de permissões
app.use((request, response, next) => {
    response.header('Access-Control-Allow-Origin', '*')
    response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')

    app.use(cors())
    next()
})

//Rota para listar todas postagens 
app.get('/v1/viajou/postagem', cors(), async (request, response) => {
    let postagem = await controller_postagem.listarPostagens();
    response.status(postagem.status_code)
    response.json(postagem)
})

//Rota para buscar uma postagem pelo ID da postagem
app.get('/v1/viajou/postagem/:id', cors(), async (request, response) => {
let id = request.params.id
let postagem = await controller_postagem.buscarPostagemId(id);
response.status(postagem.status_code)
response.json(postagem)
})

//Rota para buscar uma postagem pelo ID do usuario
app.get('/v1/viajou/postagem/usuario/:id', cors(), async (request, response) => {
let id = request.params.id
let postagem = await controller_postagem.buscarPostagemIdUsuario(id);
response.status(postagem.status_code)
response.json(postagem)
})

//rota para inserir uma nova postagem
app.post('/v1/viajou/postagem', cors(), bodyParserJSON, async(request, response) => {
    let dadosBody    = request.body
    let contentType  = request.headers['content-type']
    let postagem = await controller_postagem.inserirPostagem(dadosBody, contentType)
    response.status(postagem.status_code)
    response.json(postagem)
})

//Rota para atualizar um postagem existente 
app.put('/v1/viajou/postagem/:id', cors(), bodyParserJSON, async (request, response) => {
    let idPostagem   = request.params.id
    let dadosBody    = request.body
    let contentType  = request.headers['content-type']
    let postagem = await controller_postagem.atualizarPostagem(dadosBody, idPostagem, contentType);
    response.status(postagem.status_code)
    response.json(postagem)
})

//Rota para deletar um postagem
app.delete('/v1/viajou/postagem/:id', cors(), async (request, response) => {
    let idPostagem = request.params.id
    let postagem   = await controller_postagem.excluirPostagem(idPostagem);
    response.status(postagem.status_code)
    response.json(postagem)
})


//Export
module.exports = app
