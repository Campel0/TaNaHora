// Importamos o módulo nativo 'fs' (File System) do Node.js para interagir com arquivos de disco
const fs = require("fs");
// Importamos o módulo 'path' para lidar com caminhos de arquivos de forma segura em qualquer sistema operacional
const path = require("path");

/**
 * Função responsável por ler dados de um arquivo JSON específico.
 * Se o arquivo não existir, ela cria o arquivo com um array vazio '[]'.
 * 
 * @param {string} nomeArquivo - O nome do arquivo (ex: "usuarios.json")
 * @returns {Array} - Os dados contidos no arquivo convertidos em Array JS
 */
function lerDados(nomeArquivo) {
  // Construímos o caminho absoluto para o arquivo na pasta 'backend/data/'
  const caminhoArquivo = path.join(__dirname, nomeArquivo);

  // Verificamos se o arquivo não existe no disco
  if (!fs.existsSync(caminhoArquivo)) {
    // Se não existir, gravamos um array vazio serializado como texto JSON
    fs.writeFileSync(caminhoArquivo, JSON.stringify([]), "utf8");
    // Retornamos um array vazio, que é o nosso estado inicial
    return [];
  }

  // Se o arquivo existe, lemos o conteúdo dele em formato de texto (string)
  const conteudoTexto = fs.readFileSync(caminhoArquivo, "utf8");

  try {
    // Convertemos o texto JSON de volta para uma lista/objeto de JavaScript
    return JSON.parse(conteudoTexto);
  } catch (erro) {
    // Caso o arquivo esteja corrompido ou com formato inválido, retornamos um array vazio
    console.error(`Erro ao processar JSON em ${nomeArquivo}:`, erro);
    return [];
  }
}

/**
 * Função responsável por gravar dados em um arquivo JSON específico.
 * 
 * @param {string} nomeArquivo - O nome do arquivo a ser atualizado (ex: "usuarios.json")
 * @param {Array|Object} dados - Os dados que queremos salvar
 */
function salvarDados(nomeArquivo, dados) {
  // Construímos o caminho absoluto para o arquivo
  const caminhoArquivo = path.join(__dirname, nomeArquivo);

  // Convertemos a lista/objeto JS para uma string formatada (com 2 espaços de indentação para ficar legível)
  const textoJSON = JSON.stringify(dados, null, 2);

  // Escrevemos a string formatada no arquivo físico do disco
  fs.writeFileSync(caminhoArquivo, textoJSON, "utf8");
}

// Exportamos as duas funções para que possam ser utilizadas em outros arquivos do nosso backend
module.exports = {
  lerDados,
  salvarDados
};
