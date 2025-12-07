/***************************************************************************************************************************************************
* Objetivo: Arquivo responsavel pelo CRUD de dados no MySQL referente a tabela de auto relacionamento de Usuário com Usuário do projeto Viajou!
* Data: 01/12/2025
* Autor: Pedro Silva
* Versao: 1.0
******************************************************************************************************************************************************/

//Import da dependencia do Prisma que permite a execucao de Script SQL no banco de dados
const { PrismaClient } = require('../../generated/prisma')

//Criando um novo objeto baseado na classe do PrismaClient
const prisma = new PrismaClient()

const getSelectAllUserFollows = async function(){
    try {
        let sql = `select * from tbl_usuario_seguidores order by id desc`

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

const getSelectUserFollowById = async function(id){
    try {
        let sql = `select * from tbl_usuario_seguidores where id = ${id}`

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

const getSelectFollowingByIdUser = async function(id_usuario){
    try {
        let sql = `select tbl_usuario.id, tbl_usuario.nome, tbl_usuario.nome_usuario
        from tbl_usuario INNER JOIN tbl_usuario_seguidores
        ON tbl_usuario.id = tbl_usuario_seguidores.id_usuario_seguidor
        WHERE tbl_usuario_seguidores.id_usuario_seguindo = ${id_usuario}`

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

const getSelectFollowerByIdUser = async function(id_usuario){
    try {
        let sql = `select tbl_usuario.id, tbl_usuario.nome, tbl_usuario.nome_usuario
        from tbl_usuario INNER JOIN tbl_usuario_seguidores
        ON tbl_usuario.id = tbl_usuario_seguidores.id_usuario_seguindo
        WHERE tbl_usuario_seguidores.id_usuario_seguidor = ${id_usuario}`

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
        let sql = `select id from tbl_usuario_seguidores order by id desc limit 1`

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

const setInsertUserFollow = async function(userSeguidor){
    try {
        let sql = `insert into tbl_usuario_seguidores (id_usuario_seguindo, id_usuario_seguidor) 
        VALUES (${userSeguidor.id_usuario_seguindo}, ${userSeguidor.id_usuario_seguidor});`
   
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

const setUpdateUserFollow = async function(userSeguidor){
    try {
        let sql = `UPDATE tbl_usuario_seguidores SET 
        id_usuario_seguindo = '${userSeguidor.id_usuario_seguindo}', 
        id_usuario_seguidor = '${userSeguidor.id_usuario_seguidor}'
        WHERE id = ${userSeguidor.id};`
   
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

const setDeleteUserFollow = async function(id){
    try {
        //Script sql
        let sql = `DELETE FROM tbl_usuario_seguidores WHERE id = ${id}`
   
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
    getSelectAllUserFollows,
    getSelectUserFollowById,
    getSelectFollowingByIdUser,
    getSelectFollowerByIdUser,
    getSelectLastId,
    setInsertUserFollow,
    setUpdateUserFollow,
    setDeleteUserFollow
}