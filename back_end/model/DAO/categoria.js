/***********************************************************************************************************************************************
* Objetivo: Arquivo responsavel pelo CRUD de dados no MySQL referente a tabela de categoria do projeto Viajou!
* Data: 27/11/2025
* Autor: Gustavo Mathias
* Versao: 1.0
************************************************************************************************************************************************/

//Import da dependencia do Prisma que permite a execucao de Script SQL no banco de dados
const { PrismaClient } = require('../../generated/prisma')

//Criando um novo objeto baseado na classe do PrismaClient
const prisma = new PrismaClient()

//Retorna o ultimo ID gerado no BD
const getSelectLastID = async function (){
    try{
        //script SQL para retornar o ultimo id inserido no BD
        let sql = "select id from tbl_categoria order by id desc"

        //encaminha para o banco de dados o script SQL
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

//Retorna uma lista com categorias de viajens
const getSelectAllCategorias = async function(){
    try {
        //Scrip SQL
        let sql = "select * from tbl_categoria order by id desc"

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

//Retorna uma categoria filtrada pelo ID no banco de dados 
const getSelectCategoriaById = async function (id){
    try{
        //Script SQL
        let sql = `SELECT * FROM tbl_categoria WHERE id=${id}`

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

//Insere uma categoria novo no banco de dados 
const setInsertCategoria = async function (categoria){
    try {
        let sql = `insert into tbl_categoria (nome) 
        VALUES ('${categoria.nome}')`

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
        
//Altera uma categoria no banco de dados 
const setUpdadeCategoria = async function (categoria){

    try {
        let sql = `update tbl_categoria set
        nome    =   '${categoria.nome}'
        where id =   ${categoria.id}`

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

//Exclui uma categoria pelo ID no banco de dados
const setDeleteCategoria = async function(id){
    try{
        //Script SQL
        let sql = `delete from tbl_categoria where id=${id}`

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
    getSelectAllCategorias,
    getSelectCategoriaById,
    getSelectLastID,
    setUpdadeCategoria,
    setInsertCategoria,
    setDeleteCategoria
}
    
















