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

const controller_usuario = require('../controller/usuario/controller_usuario.js')

const app = express()

//Configuração de permissões
app.use((request, response, next) => {
    response.header('Access-Control-Allow-Origin', '*')
    response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')

    app.use(cors())
    next()
})

//Rota para listar todos usuarios 
app.get('/v1/viajou/usuario', cors(), async (request, response) => {
    let usuario = await controller_usuario.listarUsuarios();
    response.status(usuario.status_code)
    response.json(usuario)
})

//Rota para buscar um usuario pelo ID
app.get('/v1/viajou/usuario/:id', cors(), async (request, response) => {
    let id = request.params.id
    let usuario = await controller_usuario.buscarUsuarioId(id);
    response.status(usuario.status_code)
    response.json(usuario)
})

//Rota para buscar um Usuario por username e senha
app.get('/v1/viajou/login/usuario', cors(), async (request, response) => {
    let usuario = request.query.usuario
    let senha = request.query.senha

    let login = await controller_usuario.buscarUsuarioLogin(usuario, senha)
    response.status(login.status_code).json(login)
})

//rota para inserir um novo usuario
app.post('/v1/viajou/usuario', cors(), bodyParserJSON, async(request, response) => {
    let dadosBody    = request.body
    let contentType  = request.headers['content-type']
    let usuario      = await controller_usuario.inserirUsuario(dadosBody, contentType);
    response.status(usuario.status_code)
    response.json(usuario)
})

//Rota para atualizar um usuario existente 
app.put('/v1/viajou/usuario/:id', cors(), bodyParserJSON, async (request, response) => {
    let idUsuario    = request.params.id
    let dadosBody    = request.body
    let contentType  = request.headers['content-type']
    let usuario = await controller_usuario.atualizarUsuario(dadosBody, idUsuario, contentType);
    response.status(usuario.status_code)
    response.json(usuario)
})

//Rota para deletar um usuario
app.delete('/v1/viajou/usuario/:id', cors(), async (request, response) => {
    let idUsuario = request.params.id
    let usuario   = await controller_usuario.excluirUsuario(idUsuario);
    response.status(usuario.status_code)
    response.json(usuario)
})


//Export
module.exports = app
