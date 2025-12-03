/*****************************************************************************
* Objetivo: Arquivo responsavel pelas requisições da API Viajou!!
* Data: 26/11/2025
* Autor: Gustavo Mathias
* Versao: 1.0 
******************************************************************************/

/*
Dependencias que seram utilizadas 

npm install express      ->    
npm install cors         ->   
npm install body-parser  ->
npm install prisma@6.15.0 @prisma/client@6.15.0 ->
*/ 

const express       =    require('express')
const cors          =    require('cors')
const bodyParser    =    require('body-parser')

//Cria um objeto especialista no formato JSON para receber dados via POST e PUT
const bodyParserJSON = bodyParser.json()

const controller_categoria = require('./controller/categoria/controller_categoria')

const PORT = process.PORT || 8080

const app = express()

//Configuração de permissões
app.use((request, response, next) => {
    response.header('Access-Control-Allow-Origin', '*')
    response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')

    app.use(cors())
    next()
})

//Chamar rota existente 
const rotaCategoria  = require('./routes/routes_categoria')
const rotaComentario = require('./routes/routes_comentario')
const rotaCurtida    = require('./routes/routes_curtida')
const rotaItem       = require('./routes/routes_item')

//Inicia o servidor da API
app.listen(PORT, () => {
    console.log('API aguardando requisições...')
})

//Utiliza as rotas
app.use(rotaCategoria)
app.use(rotaComentario)
app.use(rotaCurtida)
app.use(rotaItem)
