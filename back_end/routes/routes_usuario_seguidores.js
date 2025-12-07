/**************************************************************************************************
 * Objetivo: Arquivo responsavel pela rota
 * Data: 06/12/2025
 * Autor: Pedro Silva
 * Versao: 1.0
 ***************************************************************************************************/

const express       =    require('express')
const cors          =    require('cors')
const bodyParser    =    require('body-parser')

//Cria um objeto especialista no formato JSON para receber dados via POST e PUT
const bodyParserJSON = bodyParser.json()

const controller_usuario_seguidores = require('../controller/usuario/controller_usuario_seguidores.js')

const app = express()

//Configuração de permissões
app.use((request, response, next) => {
    response.header('Access-Control-Allow-Origin', '*')
    response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')

    app.use(cors())
    next()
})

//Rota para buscar os seguindos pelo ID do usuario
app.get('/v1/viajou/usuario/seguindo/:id', cors(), async (request, response) => {
    let id = request.params.id
    let usuario = await controller_usuario_seguidores.listarSeguindosUsuario(id)
    response.status(usuario.status_code)
    response.json(usuario)
})

//Rota para buscar os seguidores pelo ID do usuario
app.get('/v1/viajou/usuario/seguidor/:id', cors(), async (request, response) => {
    let id = request.params.id
    let usuario = await controller_usuario_seguidores.listarSeguidoresUsuario(id)
    response.status(usuario.status_code)
    response.json(usuario)
})

//Rota para buscar os usuario seguidores pelo ID
app.get('/v1/viajou/usuario_seguidores/:id', cors(), async (request, response) => {
    let id = request.params.id
    let usuario = await controller_usuario_seguidores.buscarUsuarioSeguidorId(id)
    response.status(usuario.status_code)
    response.json(usuario)
})

//rota para inserir um novo seguindo
app.post('/v1/viajou/usuario/seguindo', cors(), bodyParserJSON, async(request, response) => {
    let dadosBody    = request.body
    let contentType  = request.headers['content-type']
    let usuario      = await controller_usuario_seguidores.inserirSeguindo(dadosBody, contentType);
    response.status(usuario.status_code)
    response.json(usuario)
})

//Rota para deletar um seguindo
app.delete('/v1/viajou/usuario_seguidores/:id', cors(), async (request, response) => {
    let idUsuario = request.params.id
    let usuario   = await controller_usuario_seguidores.excluirSeguindo(idUsuario);
    response.status(usuario.status_code)
    response.json(usuario)
})

//Export
module.exports = app