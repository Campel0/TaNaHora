const usuariosDb = require("../data/usuarios");

function recuperarSenha(req, res) {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      mensagem: "E-mail é obrigatório"
    });
  }

  const usuarios = usuariosDb.get();
  const usuario = usuarios.find(
    u => u.email === email
  );

  if (!usuario) {
    return res.status(404).json({
      mensagem: "E-mail não encontrado"
    });
  }

  return res.status(200).json({
    mensagem: "Link enviado para o e-mail"
  });
}

module.exports = { recuperarSenha };