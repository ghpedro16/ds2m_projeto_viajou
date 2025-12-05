/***********************************************************************************************************************************************
 * Objetivo: Arquivo responsavel pelo CRUD de dados no Mysql referente ao genero
 * Data: 02/12/2025
 * Autor: Pedro
 * Versão: 1.0
 * 
 * Autor: Guilherme Moreira
 * OBS: Corrigindo o select da função setUpdadeMidia
 ************************************************************************************************************************************************/

/*
Vou utilizar (node-fetch), (Axios) para fazer um GET na Url do arquivo
Guilherme: Não sei oq é isso vou ver dps com os outros membros
*/


//Import da dependencia do Prisma que permite a execucao de Script SQL no banco de dados
const { PrismaClient } = require('../../generated/prisma')

//Criando um novo objeto baseado na classe do PrismaClient
const prisma = new PrismaClient()


//Retorna o ultimo ID gerado no BD
const getSelectLastID = async function (){

    try{

        //script SQL para retornar o ultimo id inserido no BD
        let sql = "select id from tbl_midia order by id desc"

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

//Retorna uma lista com a midia (foto ou video) de viajens
const getSelectAllMidia = async function (){

    try {
        //Scrip SQL
        let sql = "select * from tbl_midia order by id desc"

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

//Retorna uma midia (foto ou video) filtrada pelo ID no banco de dados 
async function getSelectMidiaById(id){

    try{
        //Script SQL
        let sql = `SELECT * FROM tbl_midia WHERE id=${id}`

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

const getSelectMidiaByIdPost = async function(id_postagem){
    try {
        let sql = `select tbl_midia.id as id_midia, tbl_midia.url, tbl_midia.id_postagem
        from tbl_midia inner join tbl_postagem
        on tbl_midia.id_postagem = tbl_postagem.id
        where tbl_midia.id_postagem = ${id_postagem}`

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

//Insere uma midia (foto ou video) nova no banco de dados 
const setInsertMidia = async function (midia){

    try {
        let sql = `insert into tbl_midia
        (url)
        VALUES ('${midia.url}')`
   

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
        
//Altera uma midia (foto ou video) no banco de dados 
const setUpdadeMidia = async function (midia){

    try {
        let sql = `update tbl_midia set
        url    =    '${midia.url}'
        where id =   ${midia.id}`

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

//Exclui uma midia (foto ou video) pelo ID no banco de dados
const setDeleteMidia = async function(id){
    try{
        //Script SQL
        let sql = `delete from tbl_midia where id = ${id}`

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
    getSelectAllMidia,
    getSelectMidiaById,
    getSelectMidiaByIdPost,
    getSelectLastID,
    setUpdadeMidia,
    setInsertMidia,
    setDeleteMidia
}
    





