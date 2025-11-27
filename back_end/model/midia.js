/*
Vou utilizar (node-fetch), (Axios) para fazer um GET na Url do arquivo
*/


//Import da dependencia do Prisma que permite a execucao de Script SQL no banco de dados
const { PrismaClient } = require('../../generated/prisma')

//Criando um novo objeto baseado na classe do PrismaClient
const prisma = new PrismaClient()


//Retorna o ultimo ID gerado no BD
const getSelectLastID = async function (){

    try{

        //script SQL para retornar o ultimo id inserido no BD
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
async function getSelectByIdMidia(id){

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

//Insere uma midia (foto ou video) nova no banco de dados 
async function setInsertMidia(midia){

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
async function setUpdadeMidia(midia){

    try {
        let sql = `update tbl_categoria set
        url    =    '${midia.url}'
        where id =   ${midia}`

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
        let sql = `delete from tbl_midia where id=${id}`

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
    getSelectByIdMidia,
    getSelectLastID,
    setUpdadeMidia,
    setInsertMidia,
    setDeleteMidia
}
    





