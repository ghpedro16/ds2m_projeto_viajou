//Import da dependencia do Prisma que permite a execucao de Script SQL no banco de dados
const { PrismaClient } = require('../../generated/prisma')

//Criando um novo objeto baseado na classe do PrismaClient
const prisma = new PrismaClient()


/*
Vou utilizar (node-fetch), (Axios) para fazer um GET na Url do arquivo
*/

