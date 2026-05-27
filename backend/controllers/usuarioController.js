const usuarios = require("../data/usuarios");
// Importamos a função salvarDados do dbHelper para gravar as alterações em disco
const { salvarDados } = require("../data/dbHelper");
// Importamos a biblioteca bcryptjs para criptografar a senha do usuário com segurança
const bcrypt = require("bcryptjs");

function listarUsuarios(req, res) {
  res.status(200).json(usuarios);
}

function cadastrarUsuario(req, res) {
  const { nome, email, senha } = req.body;

  // valida campos
  if (!nome || !email || !senha) {
    return res.status(400).json({
      mensagem: "Todos os campos obrigatórios devem ser preenchidos"
    });
  }

  // valida email duplicado
  const usuarioExistente = usuarios.find(
    usuario => usuario.email === email
  );

  if (usuarioExistente) {
    return res.status(409).json({
      mensagem: "Este e-mail já está cadastrado"
    });
  }

  // Geramos o hash criptográfico da senha fornecida pelo usuário.
  // O número 10 indica a complexidade do algoritmo (salt rounds).
  // Imagine o hash como uma receita que transforma a senha original em um código irreconhecível de sentido único:
  // você consegue fazer o bolo a partir da receita, mas não consegue reverter o bolo pronto para obter os ovos intactos.
  const senhaCriptografada = bcrypt.hashSync(senha, 10);

  const novoUsuario = {
    id: usuarios.length + 1,
    nome,
    email,
    senha: senhaCriptografada // Salva a senha já criptografada no banco
  };

  // Adicionamos o novo usuário na lista em memória
  usuarios.push(novoUsuario);
  
  // Gravamos a lista atualizada de usuários no arquivo 'usuarios.json' no disco
  salvarDados("usuarios.json", usuarios);

  // Retornamos os dados cadastrados, mas por segurança, não exibimos a senha (nem mesmo a criptografada) no retorno
  const respostaUsuario = {
    id: novoUsuario.id,
    nome: novoUsuario.nome,
    email: novoUsuario.email
  };

  return res.status(201).json({
    mensagem: "Cadastro realizado com sucesso",
    usuario: respostaUsuario
  });
}



module.exports = {
  listarUsuarios,
  cadastrarUsuario
};