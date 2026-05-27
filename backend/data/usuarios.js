// Importamos o helper de banco de dados para carregar as informações do arquivo JSON
const { lerDados } = require("./dbHelper");

// Lemos a lista de usuários do arquivo 'usuarios.json' (se não existir, lerDados cria um array vazio)
const usuarios = lerDados("usuarios.json");

// Exportamos o array de usuários carregado do disco
module.exports = usuarios;