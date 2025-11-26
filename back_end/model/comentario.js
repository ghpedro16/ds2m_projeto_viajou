//Import da dependencia do Prisma que permite a execucao de Script SQL no banco de dados
const { PrismaClient } = require('../../generated/prisma')

//Criando um novo objeto baseado na classe do PrismaClient
const prisma = new PrismaClient()

//Retorna uma lista de comentarios 
async function getSelectAllComentarios(){

//Script SQL
let sql = "select * from tbl_comentario order by id desc"

//Encaminha para o banco de dados o script sql
let result = await prisma.$queryRawUnsafe(sql)

if(result){
    return result
}else{
    return false
//catch(error)
//return false

}
}

//
