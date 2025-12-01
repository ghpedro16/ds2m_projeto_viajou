/**************************************************************************************************
* Objetivo: Arquivo responsavel pelo CRUD de dados no MySQL referente a tabela de Usuario do projeto Viajou!
* Data: 27/11/2025
* Autor: Gustavo Mathias
* Versao: 1.0
* Data: 01/12/2025
* Autor: Pedro Silva 
***************************************************************************************************/

//Import da dependencia do Prisma que permite a execucao de Script SQL no banco de dados
const { PrismaClient } = require('../../generated/prisma')

//Criando um novo objeto baseado na classe do PrismaClient
const prisma = new PrismaClient()

//Retorna o ultimo ID gerado no BD
const getSelectLastID = async function (){
    try{
        //Script SQL para retornar o ultimo ID inserido 
        let sql = `select id from tbl_usuario order by desc limit 1`

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

//Retorna uma lista de todos os usuarios do BD
const getSelectAllUsers = async function (){
    try {
        let sql = `select * from tbl_usuario order by id desc`

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


//Retorna um usuario filtrado ID
const getSelectUserById = async function (id){
    try {
        let sql = `select * from tbl_usuario where id = ${id}`

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

const getSelectUserLogin = async function(user){
    try {
        let sql = `select * from tbl_usuario where nome_usuario = ${user.nome_usuario} AND senha = ${user.senha}`

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

//Insere um usuario novo no BD
const setInsertUser = async function(user){
    try{
        let sql = `INSERT INTO tbl_usuario (nome, email, nome_usuario, data_cadastro, data_nascimento, senha, biografia, url_foto)
        VALUES ('${user.nome}', 
        '${user.email}', 
        '${user.nome_usuario}', 
        '${user.current_date()}', 
        '${user.data_nascimento}', 
        '${user.senha}', 
        '${user.biografia}', 
        '${user.url_foto}');`

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

const setUpdateUser = async function(user){
    try{
        let sql = `UPDATE tbl_usuario SET
        nome = '${user.nome}', 
        email = '${user.email}', 
        nome_usuario = '${user.nome_usuario}', 
        data_cadastro = '${user.current_date()}', 
        data_nascimento = '${user.data_nascimento}', 
        senha = '${user.senha}', 
        biografia = '${user.biografia}', 
        url_foto = '${user.url_foto}'
        WHERE id = ${user.id};`

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

const setDeleteUser = async function(id){
    try {
        //Script sql
        let sql = `DELETE FROM tbl_usuario WHERE id = ${id}`

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
    getSelectAllUsers,
    getSelectUserById,
    getSelectLastID,
    getSelectUserLogin,
    setInsertUser,
    setUpdateUser,
    setDeleteUser
}