const usuarios = require("../data/usuarios");

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

  usuarios.push(novoUsuario);

  return res.status(201).json({
    mensagem: "Cadastro realizado com sucesso",
    usuario: novoUsuario
  });
}

module.exports = {
  listarUsuarios,
  cadastrarUsuario
};