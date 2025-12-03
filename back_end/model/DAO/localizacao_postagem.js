/***************************************************************************************************************************************************
* Objetivo: Arquivo responsavel pelo CRUD de dados no MySQL referente a tabela de relacionamento de localizacao com postagem do projeto Viajou!
* Data: 01/12/2025
* Autor: Pedro Silva
* Versao: 1.0
******************************************************************************************************************************************************/

//Import da dependencia do Prisma que permite a execucao de Script SQL no banco de dados
const { PrismaClient } = require('../../generated/prisma')

//Criando um novo objeto baseado na classe do PrismaClient
const prisma = new PrismaClient()

const getSelectAllLocationPosts = async function(){
    try {
        let sql = `select * from tbl_localizacao_postagem order by id desc`

        let result = await prisma$queryRawUnsafe(sql)
        
        if (result) {
            return result
        } else {
            return false
        }
    } catch (error) {
        return false
    }
}

const getSelectLocationPostById = async function(id){
    try {
        let sql = `select * from tbl_localizacao_postagem where id = ${id}`

        let result = await prisma$queryRawUnsafe(sql)
        
        if (result) {
            return result
        } else {
            return false
        }
    } catch (error) {
        return false
    }
}

const getSelectLocationByIdPost = async function(id_postagem){
    try {
        let sql = `select tbl_localizacao.id as id_localizacao, tbl_localizacao.pais, tbl_postagem.id as id_postagem
        from tbl_localizacao_postagem inner join tbl_localizacao
        on tbl_localizacao.id = tbl_localizacao_postagem.id_localizacao
        inner join tbl_postagem on tbl_postagem.id = tbl_localizacao_postagem.id_postagem
        where tbl_localizacao_postagem.id_postagem = ${id_postagem}`

        let result = await prisma$queryRawUnsafe(sql)
        
        if (result) {
            return result
        } else {
            return false
        }
    } catch (error) {
        return false
    }
}

const getSelectPostByIdLocation = async function(id_localizacao){
    try {
        let sql = `select tbl_localizacao.id as id_localizacao, tbl_localizacao.pais, tbl_postagem.id as id_postagem
        from tbl_localizacao_postagem inner join tbl_localizacao
        on tbl_localizacao.id = tbl_localizacao_postagem.id_localizacao
        inner join tbl_postagem on tbl_postagem.id = tbl_localizacao_postagem.id_postagem
        where tbl_localizacao_postagem.id_localizacao = ${id_localizacao}`

        let result = await prisma$queryRawUnsafe(sql)
        
        if (result) {
            return result
        } else {
            return false
        }
    } catch (error) {
        return false
    }
}

const getSelectLastId = async function(){
    try{
        //Script SQL para retornar o ultimo ID inserido 
        let sql = `select id from tbl_localizacao_postagem order by desc limit 1`

        //Encaminha para o BD o script 
        let result = await prisma.$queryRawUnsafe(sql)

        if(Array.isArray(result)){
            return Number(result[0].id)
        }else{
            return false
        }
    } catch(error){
        return false
    }
}

const setInsertLocationPost = async function(localizacaoPostagem){
    try {
        let sql = `insert into tbl_localizacao_postagem (id_postagem, id_localizacao) 
        VALUES (${localizacaoPostagem.id_postagem}, ${localizacaoPostagem.id_localizacao});`
   
        let result = await prisma.$executeRawUnsafe(sql)

        if (result) {
            return true
        } else {
            return false
        }

    }catch (error){
        return false
    }
}

const setUpdateLocationPost = async function(localizacaoPostagem){
    try {
        let sql = `update tbl_localizacao_postagem set 
        id_postagem = '${localizacaoPostagem.id_postagem}',
        id_localizacao = '${localizacaoPostagem.id_localizacao}';`
   
        let result = await prisma.$executeRawUnsafe(sql)

        if (result) {
            return true
        } else {
            return false
        }

    }catch (error){
        return false
    }
}

const setDeleteLocationPost = async function(id){
    try {
        let sql = `delete from tbl_localizacao_postagem where id = ${id}`
   
        let result = await prisma.$executeRawUnsafe(sql)

        if (result) {
            return true
        } else {
            return false
        }

    }catch (error){
        return false
    }
}

module.exports = {
    getSelectAllLocationPosts,
    getSelectLocationPostById,
    getSelectLocationByIdPost,
    getSelectPostByIdLocation,
    getSelectLastId,
    setInsertLocationPost,
    setUpdateLocationPost,
    setDeleteLocationPost
}