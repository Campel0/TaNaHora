const usuariosDb = require("../data/usuarios");
const bcrypt = require("bcryptjs");

function listarUsuarios(req, res) {
  res.status(200).json(usuariosDb.get());
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
  const usuarios = usuariosDb.get();
  const usuarioExistente = usuarios.find(
    usuario => usuario.email === email
  );

  if (usuarioExistente) {
    return res.status(409).json({
      mensagem: "Este e-mail já está cadastrado"
    });
  }

  const novoUsuario = {
    id: usuarios.length > 0 ? Math.max(...usuarios.map(u => u.id)) + 1 : 1,
    nome,
    email,
    senha: bcrypt.hashSync(senha, 10)
  };

  usuarios.push(novoUsuario);
  usuariosDb.set(usuarios);

  return res.status(201).json({
    mensagem: "Cadastro realizado com sucesso",
    usuario: novoUsuario
  });
}

module.exports = {
  listarUsuarios,
  cadastrarUsuario
};