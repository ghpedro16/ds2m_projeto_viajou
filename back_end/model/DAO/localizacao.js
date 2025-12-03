/***********************************************************************************************************************************************
* Objetivo: Arquivo responsavel pelo CRUD de dados no MySQL referente a tabela de localizao do projeto Viajou!
* Data: 01/12/2025
* Autor: Pedro Silva
* Versao: 1.0

* Autor: Guilherme Moreira
* OBS: Corrigindo bugs da função de atualizar
************************************************************************************************************************************************/

//Import da dependencia do Prisma que permite a execucao de Script SQL no banco de dados
const { PrismaClient } = require('../../generated/prisma')

//Criando um novo objeto baseado na classe do PrismaClient
const prisma = new PrismaClient()

//Retorna o ultimo ID gerado no BD
const getSelectLastID = async function (){
    try{
        //script SQL para retornar o ultimo id inserido no BD
        let sql = "select id from tbl_localizacao order by id desc"

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

//Retorna uma lista com Localizaçoes de viajens
const getSelectAllLocation = async function (){
    try {
        //Scrip SQL
        let sql = "select * from tbl_localizacao order by id desc"

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

//Retorna uma localização filtrada pelo ID no banco de dados 
const getSelectLocationById = async function (id){
    try{
        //Script SQL
        let sql = `SELECT * FROM tbl_localizacao WHERE id=${id}`

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

//Insere uma localização nova no banco de dados 
const setInsertLocation = async function (localizacao){
    try {
        let sql = `insert into tbl_localizacao (pais) 
        VALUES ('${localizacao.pais}');`
   
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
        
//Altera uma localizacao no banco de dados 
const setUpdadeLocation = async function (localizacao){
    try {
        //Script SQL
        let sql = `update tbl_localizacao set 
        pais = '${localizacao.pais}'
        where id = ${localizacao.id}`

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

//Exclui uma localização pelo ID no banco de dados
const setDeleteLocation = async function(id){
    try{
        //Script SQL
        let sql = `delete from tbl_localizacao where id = ${id}`

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
    getSelectAllLocation,
    getSelectLocationById,
    getSelectLastID,
    setUpdadeLocation,
    setInsertLocation,
    setDeleteLocation
}