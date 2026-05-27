// Importamos a função lerDados do nosso helper de banco de dados
const { lerDados } = require("./dbHelper");

// Lemos a lista de medicamentos a partir do arquivo 'medicamentos.json'
const medicamentos = lerDados("medicamentos.json");

// Exportamos o array de medicamentos carregado do disco
module.exports = medicamentos;