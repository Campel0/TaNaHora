const pool = require("../db");

async function recuperarSenha(req, res) {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      mensagem: "E-mail é obrigatório"
    });
  }

  try {
    const result = await pool.query("SELECT * FROM usuarios WHERE email = $1", [email]);
    if (result.rows.length === 0) {
      return res.status(404).json({
        mensagem: "E-mail não encontrado"
      });
    }

    return res.status(200).json({
      mensagem: "Link enviado para o e-mail"
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ mensagem: "Erro interno no servidor" });
  }
}

module.exports = { recuperarSenha };