'use strict'

export function verificarDono(idItem, idLogado) {
    return Number(idItem) === Number(idLogado)
}

export function podeVerPostagem(post, idLogado) {
    // dono pode ver tudo
    if (verificarDono(post.id_usuario, idLogado)) return true;

    // se não é dono, só pode ver se for pública
    return post.publico === true;
}