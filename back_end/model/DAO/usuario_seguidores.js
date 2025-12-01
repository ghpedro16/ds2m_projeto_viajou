/***************************************************************************************************************************************
* Objetivo: Arquivo responsavel pelo CRUD de dados no MySQL referente a tabela de auto relacionamento de Usuário com Usuário do projeto Viajou!
* Data: 01/12/2025
* Autor: Pedro Silva
* Versao: 1.0
***************************************************************************************************************************************/

//Import da dependencia do Prisma que permite a execucao de Script SQL no banco de dados
const { PrismaClient } = require('../../generated/prisma')

//Criando um novo objeto baseado na classe do PrismaClient
const prisma = new PrismaClient()

const getSelectAllUserFollows = async function(){

}

const getSelectUserFollowById = async function(){

}

const getSelectFollowingByIdUser = async function(id_usuario){

}

const getSelectFollowerByIdUser = async function(id_usuario){
    
}