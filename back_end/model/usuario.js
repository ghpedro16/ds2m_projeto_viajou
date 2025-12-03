/**************************************************************************************************
* Objetivo: Arquivo responsavel pelo CRUD de dados no MySQL referente ao projeto Viajou!
* Data: 27/11/2025
* Autor: Gustavo Mathias
* Versao: 1.0 
***************************************************************************************************/

//Import da dependencia do Prisma que permite a execucao de Script SQL no banco de dados
const { PrismaClient } = require('./../generated/prisma')

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
async function getSelectAllUser(){

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
async function getSelectByIdUser(id){
    try {

        let sql = `select * from tbl_usuario where id=${id}`

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
async function setInsertUser(user){
    try{
        let sql = `insert into tbl_usuario  (nome,
        email,
        nome_usuario,
        data_cadastro,
        data_nascimento,
        senha,
        status,
        biografia,
        url_foto,
        quantidade_postagens,
        quantidade_seguidores,
        quantidade_itens_salvos)
        VALUES  ('${user.nome}'),
                ('${user.email}')
                ('${user.nome_usuario}')
                ('${user.data_cadastro}')
                ('${user.data_nascimento}')
                ('${user.senha}')
                ('${user.status}')
                ('${user.biografia}')
                ('${user.url_foto}')
                ('${user.quantidade_postagens}')
                ('${user.quantidade_seguidores}')
                ('${user.quantidade_itens_salvos}')`

                console.log(sql)

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
