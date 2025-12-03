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

const controller_categoria = require('../controller/categoria/controller_categoria')

const PORT = process.PORT || 8080

const app = express()

//Configuração de permissões
app.use((request, response, next) => {
    response.header('Access-Control-Allow-Origin', '*')
    response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')

    app.use(cors())
    next()
})

//Rota para listar todas categorias 
app.get('/v1/viajou/categoria', cors(), async (request, response) => {
    let categorias = await controller_categoria.listaCategoria()
    response.status(categorias.status_code)
    response.json(categorias)
})

//Rota para buscar uma categoria pelo ID 
app.get('/v1/viajou/categoria/:id', cors(), async (request, response) => {
let id = request.params.id
let categoria = await controller_categoria.buscarCategoriaId(id)
response.status(categoria.status_code)
response.json(categoria)
})

//rota para inserir nova categoria 
app.post('/v1/viajou/categoria', cors(), bodyParserJSON, async(request, response) => {
    let dadosBody    = request.body
    let contentType  = request.headers['content-type']
    let categoria    = await controller_categoria.inserirCategoria(dadosBody, contentType)
    response.status(categoria.status_code)
    response.json(categoria)
})

//Rota para atualizar uma categoria existente 
app.put('/v1/viajou/categoria/:id', cors(), bodyParserJSON, async (request, response) => {
    let idCategoria = request.params.id
    let dadosBody   = request.body
    let contentType = request.headers['content-type']
    let categoria   = await controller_categoria.atualizarCategoria(dadosBody, idCategoria, contentType)
    response.status(categoria.status_code)
    response.json(categoria)
})

//Rota pra deletar uma categoria 
app.delete('/v1/viajou/categoria/:id', cors(), async (request, response) => {
    let idCategoria = request.params.id
    let categoria   = await controller_categoria.excluirCategoria(idCategoria)
    response.status(categoria.status_code)
    response.json(categoria)
})


//Export
module.exports = app