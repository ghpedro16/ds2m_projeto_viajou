/***********************************************************************************************************************************************
* Objetivo: Arquivo responsavel pelo CRUD de dados no MySQL referente a tabela de item salvo do projeto Viajou!
* Data: 01/12/2025
* Autor: Pedro Silva
* Versao: 1.0
************************************************************************************************************************************************/

//Import da dependencia do Prisma que permite a execucao de Script SQL no banco de dados
const { PrismaClient } = require('../../generated/prisma')

//Criando um novo objeto baseado na classe do PrismaClient
const prisma = new PrismaClient()

const getSelectAllSavedItem = async function(){
    try {
        let sql = `select * from tbl_item_salvo order by id desc`

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

const getSelectSavedItemById = async function(id){
    try{
        //Script SQL
        let sql = `SELECT * FROM tbl_item_salvo WHERE id = ${id}`

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

const getSelectSavedItemByIdUser = async function(id_usuario){
    try{
        //Script SQL
        let sql = `select tbl_item_salvo.id, tbl_item_salvo.data_salvo, tbl_item_salvo.id_usuario, tbl_item_salvo.id_postagem
        from tbl_item_salvo inner join tbl_usuario on tbl_item_salvo.id_usuario = tbl_usuario.id
        inner join tbl_postagem on tbl_postagem.id = tbl_item_salvo.id_postagem
        where tbl_item_salvo.id_usuario = ${id_usuario}`

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
        let sql = `select id from tbl_item_salvo order by id desc limit 1`

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

const setInsertSavedItem = async function(itemSalvo){
    try {
        let sql = `insert into tbl_item_salvo (id_postagem, id_usuario) 
        VALUES (${itemSalvo.id_postagem}, ${itemSalvo.id_usuario});`
   
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

const setUpdateSavedItem = async function(itemSalvo){
    try {
        let sql = `UPDATE tbl_item_salvo SET 
        id_postagem = ${itemSalvo.id_postagem}, 
        id_usuario = ${itemSalvo.id_usuario}
        WHERE id = ${itemSalvo.id};`
   
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

const setDeleteSavedItem = async function(id){
    try{
        //Script SQL
        let sql = `delete from tbl_item_salvo where id = ${id}`

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
    getSelectAllSavedItem,
    getSelectSavedItemById,
    getSelectSavedItemByIdUser,
    getSelectLastId,
    setInsertSavedItem,
    setUpdateSavedItem,
    setDeleteSavedItem
}