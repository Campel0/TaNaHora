const usuarios = require("../data/usuarios");

function login(req, res) {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({
      mensagem: "E-mail e senha são obrigatórios"
    });
  }

  const usuario = usuarios.find(
    u => u.email === email && u.senha === senha
  );

  if (!usuario) {
    return res.status(401).json({
      mensagem: "Usuário ou senha inválidos"
    });
  }

  return res.status(200).json({
    mensagem: "Login realizado com sucesso",
    usuario: {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email
    }
  });
}

module.exports = { login };