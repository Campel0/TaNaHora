// Importamos a função lerDados do nosso helper de banco de dados
const { lerDados } = require("./dbHelper");

// Lemos a lista do histórico a partir do arquivo 'historico.json'
const historico = lerDados("historico.json");

// Exportamos o array de histórico carregado do disco
module.exports = historico;