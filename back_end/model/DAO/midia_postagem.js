/***************************************************************************************************************************************************
* Objetivo: Arquivo responsavel pelo CRUD de dados no MySQL referente a tabela de relacionamento de midia com postagem do projeto Viajou!
* Data: 01/12/2025
* Autor: Pedro Silva
* Versao: 1.0
******************************************************************************************************************************************************/

//Import da dependencia do Prisma que permite a execucao de Script SQL no banco de dados
const { PrismaClient } = require('../../generated/prisma')

//Criando um novo objeto baseado na classe do PrismaClient
const prisma = new PrismaClient()

const getSelectAllMidiaPosts = async function(){
    try {
        let sql = `select * from tbl_midia_postagem order by id desc`

        let result = await prisma.$queryRawUnsafe(sql)
        
        if (result) {
            return result
        } else {
            return false
        }
    } catch (error) {
        return false
    }
}

const getSelectMidiaPostById = async function(id){
    try {
        let sql = `select * from tbl_midia_postagem where id = ${id}`

        let result = await prisma.$queryRawUnsafe(sql)
        
        if (result) {
            return result
        } else {
            return false
        }
    } catch (error) {
        return false
    }
}

const getSelectMidiaByIdPost = async function(id_postagem){
    try {
        let sql = `select tbl_midia.id as id_midia, tbl_midia.url, tbl_postagem.id as id_postagem
        from tbl_midia_postagem inner join tbl_midia
        on tbl_midia.id = tbl_midia_postagem.id_midia
        inner join tbl_postagem on tbl_postagem.id = tbl_midia_postagem.id_postagem
        where tbl_midia_postagem.id_postagem = ${id_postagem}`

        let result = await prisma.$queryRawUnsafe(sql)
        
        if (result) {
            return result
        } else {
            return false
        }
    } catch (error) {
        return false
    }
}

const getSelectPostByIdMidia = async function(id_midia){
    try {
        let sql = `select tbl_midia.id as id_midia, tbl_midia.url, tbl_postagem.id as id_postagem
        from tbl_midia_postagem inner join tbl_midia
        on tbl_midia.id = tbl_midia_postagem.id_midia
        inner join tbl_postagem on tbl_postagem.id = tbl_midia_postagem.id_postagem
        where tbl_midia_postagem.id_midia = ${id_midia}`

        let result = await prisma.$queryRawUnsafe(sql)
        
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
        let sql = `select id from tbl_midia_postagem order by desc limit 1`

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

const setInsertMidiaPost = async function(midiaPostagem){
    try {
        let sql = `insert into tbl_midia_postagem (id_postagem, id_midia) 
        VALUES (${midiaPostagem.id_postagem}, ${midiaPostagem.id_midia});`
   
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

const setUpdateMidiaPost = async function(midiaPostagem){
    try {
        let sql = `update tbl_midia_postagem set 
        id_postagem = '${midiaPostagem.id_postagem}',
        id_midia = '${midiaPostagem.id_midia}';`
   
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

const setDeleteMidiaPost = async function(id){

    try {
        let sql = `delete from tbl_midia_postagem where id = ${id}`
   
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
    getSelectAllMidiaPosts,
    getSelectMidiaPostById,
    getSelectMidiaByIdPost,
    getSelectPostByIdMidia,
    getSelectLastId,
    setInsertMidiaPost,
    setUpdateMidiaPost,
    setDeleteMidiaPost
}