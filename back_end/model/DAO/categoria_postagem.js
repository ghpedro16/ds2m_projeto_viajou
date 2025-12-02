/***************************************************************************************************************************************************
* Objetivo: Arquivo responsavel pelo CRUD de dados no MySQL referente a tabela de relacionamento de categoria com postagem do projeto Viajou!
* Data: 01/12/2025
* Autor: Pedro Silva
* Versao: 1.0
******************************************************************************************************************************************************/

//Import da dependencia do Prisma que permite a execucao de Script SQL no banco de dados
const { PrismaClient } = require('../../generated/prisma')

//Criando um novo objeto baseado na classe do PrismaClient
const prisma = new PrismaClient()

const getSelectAllCategoryPosts = async function(){
    try {
        let sql = `select * from tbl_categoria_postagem order by id desc`

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

const getSelectCategoryPostById = async function(id){
    try {
        let sql = `select * from tbl_categoria_postagem where id = ${id}`

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

const getSelectCategoryByIdPost = async function(id_postagem){
    try {
        let sql = `select tbl_categoria.id as id_categoria, tbl_categoria.nome, tbl_postagem.id as id_postagem
        from tbl_categoria_postagem inner join tbl_categoria
        on tbl_categoria.id = tbl_categoria_postagem.id_categoria
        inner join tbl_postagem on tbl_postagem.id = tbl_categoria_postagem.id_postagem
        where tbl_categoria_postagem.id_postagem = ${id_postagem}`

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

const getSelectPostByIdCategory = async function(id_categoria){
    try {
        let sql = `select tbl_categoria.id as id_categoria, tbl_categoria.nome, tbl_postagem.id as id_postagem
        from tbl_categoria_postagem inner join tbl_categoria
        on tbl_categoria.id = tbl_categoria_postagem.id_categoria
        inner join tbl_postagem on tbl_postagem.id = tbl_categoria_postagem.id_postagem
        where tbl_categoria_postagem.id_categoria = ${id_categoria}`

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
        let sql = `select id from tbl_categoria_postagem order by desc limit 1`

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

const setInsertCategoryPost = async function(categoriaPostagem){
    try {
        let sql = `insert into tbl_localizacao_postagem (id_postagem, id_categoria) 
        VALUES (${categoriaPostagem.id_postagem}, ${categoriaPostagem.id_categoria});`
   
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

const setUpdateLocationPost = async function(categoriaPostagem){
    try {
        let sql = `update tbl_categoria_postagem set 
        id_postagem = '${categoriaPostagem.id_postagem}',
        id_categoria = '${categoriaPostagem.id_categoria}';`
   
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

const setDeleteCategoryPost = async function(id){
    try {
        let sql = `delete from tbl_categoria_postagem where id = ${id}`
   
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
    getSelectAllCategoryPosts,
    getSelectCategoryPostById,
    getSelectCategoryByIdPost,
    getSelectPostByIdCategory,
    getSelectLastId,
    setInsertCategoryPost,
    setUpdateLocationPost,
    setDeleteCategoryPost
}