/***********************************************************************************************************************************************
* Objetivo: Arquivo responsavel pelo CRUD de dados no MySQL referente a tabela de postagem do projeto Viajou!
* Data: 01/12/2025
* Autor: Pedro Silva
* Versao: 1.0
************************************************************************************************************************************************/

//Import da dependencia do Prisma que permite a execucao de Script SQL no banco de dados
const { PrismaClient } = require('../../generated/prisma')

//Criando um novo objeto baseado na classe do PrismaClient
const prisma = new PrismaClient()

const getSelectAllPostagens = async function(){
    try {
        let sql = `select * from tbl_postagem where publico = 1 order by id desc`

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

const getSelectPostagemById = async function(id){
    try {
        let sql = `select * from tbl_postagem where id = ${id}`

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

const getSelectPostagemByIdUser = async function(id_usuario){
    try {
        let sql = `select * from tbl_postagem where id_usuario = ${id_usuario}`

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
        let sql = `select id from tbl_postagem order by desc limit 1`

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

const setInsertPostagem = async function(postagem){
    try{
        let sql = `INSERT INTO tbl_postagem (titulo, descricao, data_postagem, publico, id_usuario)
        VALUES ('${postagem.titulo}', 
        '${postagem.descricao}', 
        '${postagem.current_date()}', 
        '${postagem.publico}', 
        '${postagem.id_usuario}');`

        let result = await prisma.$executeRawUnsafe(sql)

        if (result) {
            return true
        } else {
            return false
        }
    
    } catch (error) {
            return false
    }
}

const setUpdatePostagem = async function(postagem){
    try{
        let sql = `UPDATE tbl_postagem SET (titulo, descricao, data_postagem, publico, id_usuario)
        titulo = '${postagem.titulo}', 
        descricao = '${postagem.descricao}', 
        data_postagem = '${postagem.current_date()}', 
        publico = '${postagem.publico}'
        WHERE id = ${postagem.id};`

        let result = await prisma.$executeRawUnsafe(sql)

        if (result) {
            return true
        } else {
            return false
        }
    
    } catch (error) {
            return false
    }
}

const setDeletePostagem = async function(postagem){
    try {
        //Script sql
        let sql = `DELETE FROM tbl_postagem WHERE id = ${id}`

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
    getSelectAllPostagens,
    getSelectPostagemById,
    getSelectPostagemByIdUser,
    getSelectLastId,
    setInsertPostagem,
    setUpdatePostagem,
    setDeletePostagem
}