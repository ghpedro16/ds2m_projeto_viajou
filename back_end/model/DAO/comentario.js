/***********************************************************************************************************************************************
* Objetivo: Arquivo responsavel pelo CRUD de dados no MySQL referente a tabela de comentarios do projeto Viajou!
* Data: 01/12/2025
* Autor: Pedro Silva
* Versao: 1.0
************************************************************************************************************************************************/

//Import da dependencia do Prisma que permite a execucao de Script SQL no banco de dados
const { PrismaClient } = require('../../generated/prisma')

//Criando um novo objeto baseado na classe do PrismaClient
const prisma = new PrismaClient()

const getSelectAllComments = async function(){
    try {
        let sql = `select * from tbl_comentario order by id desc`

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

const getSelectCommentById = async function(id){
    try{
        //Script SQL
        let sql = `SELECT * FROM tbl_comentario WHERE id = ${id}`

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
        //script SQL para retornar o ultimo id inserido no BD
        let sql = "select id from tbl_comentario order by id desc"

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

const setInsertComment = async function(comentario){
    try {
        let sql = `insert into tbl_comentario (texto, data_comentario, id_postagem, id_usuario) 
        VALUES ('${comentario.texto}', ${comentario.current_date()}', ${comentario.id_postagem}, ${comentario.id_usuario});`
   
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

const setUpdateComment = async function(comentario){
    try {
        let sql = `UPDATE tbl_comentario SET 
        texto = '${comentario.texto}',
        id_postagem = ${comentario.id_postagem}, 
        id_usuario = ${comentario.id_usuario}
        WHERE id = ${comentario.id};`
   
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

const setDeleteComment = async function(id){
    try{
        //Script SQL
        let sql = `delete from tbl_comentario where id = ${id}`

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
    getSelectAllComments,
    getSelectCommentById,
    getSelectLastId,
    setInsertComment,
    setUpdateComment,
    setDeleteComment
}