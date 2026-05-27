const usuarios = require("../data/usuarios");
// Importamos a função salvarDados do dbHelper para gravar as alterações em disco
const { salvarDados } = require("../data/dbHelper");

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

  const novoUsuario = {
    id: usuarios.length + 1,
    nome,
    email,
    senha
  };

  // Adicionamos o novo usuário na lista em memória
  usuarios.push(novoUsuario);
  
  // Gravamos a lista atualizada de usuários no arquivo 'usuarios.json' no disco
  salvarDados("usuarios.json", usuarios);

  return res.status(201).json({
    mensagem: "Cadastro realizado com sucesso",
    usuario: novoUsuario
  });
}


module.exports = {
  listarUsuarios,
  cadastrarUsuario
};