/***********************************************************************************************************************************************
* Objetivo: Arquivo responsavel pelo CRUD de dados no MySQL referente a tabela de curtidas do projeto Viajou!
* Data: 01/12/2025
* Autor: Pedro Silva
* Versao: 1.0
************************************************************************************************************************************************/

//Import da dependencia do Prisma que permite a execucao de Script SQL no banco de dados
const { PrismaClient } = require('../../generated/prisma')

//Criando um novo objeto baseado na classe do PrismaClient
const prisma = new PrismaClient()

const getSelectAllLikes = async function(){
    try {
        let sql = `select * from tbl_curtida order by id desc`

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

const getSelectLikeById = async function(id){
    try{
        //Script SQL
        let sql = `SELECT * FROM tbl_curtida WHERE id = ${id}`

        //Encaminha para o banco de dados o script SQL
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

const getSelectLikesByIdPost = async function(id_postagem){
    try{
        //Script SQL
        let sql = `select tbl_curtida.id as id_curtida, tbl_curtida.data_curtida, 
        tbl_usuario.id as id_usuario, tbl_postagem.id as id_postagem
        from tbl_curtida inner join tbl_usuario on tbl_curtida.id_usuario = tbl_usuario.id
        inner join tbl_postagem on tbl_postagem.id = tbl_curtida.id_postagem
        where tbl_curtida.id_postagem = ${id_postagem}`

        //Encaminha para o banco de dados o script SQL
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
        let sql = `select id from tbl_curtida order by id desc limit 1`

        //Encaminha para o BD o script 
        let result = await prisma.$queryRawUnsafe(sql)

        if(Array.isArray(result))
            return Number(result[0].id)
        else
            return false

    } catch(error){
        return false
    }
}

const setInsertLike = async function(curtida){
    try {
        let sql = `insert into tbl_curtida (id_postagem, id_usuario) 
        VALUES (${curtida.id_postagem}, ${curtida.id_usuario});`
   
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

const setUpdateLike = async function(curtida){
    try {
        let sql = `UPDATE tbl_curtida SET 
        id_postagem = ${curtida.id_postagem}, 
        id_usuario = ${curtida.id_usuario}
        WHERE id = ${curtida.id};`
   
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

const setDeleteLike = async function(id){
    try{
        //Script SQL
        let sql = `delete from tbl_curtida where id = ${id}`

        //Encaminha para o BD o script SQL
        let result = await prisma.$queryRawUnsafe(sql)

        if(Array.isArray(result))
            return result
        else
            return false

    } catch (error) {
        return false
    }
}

module.exports = {
    getSelectAllLikes,
    getSelectLikeById,
    getSelectLikesByIdPost,
    getSelectLastId,
    setInsertLike,
    setUpdateLike,
    setDeleteLike
}