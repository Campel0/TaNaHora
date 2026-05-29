const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../middlewares/authMiddleware");
const bcrypt = require("bcryptjs");
const pool = require("../db");

async function login(req, res) {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({
      mensagem: "E-mail e senha são obrigatórios"
    });
  }

  try {
    const result = await pool.query("SELECT * FROM usuarios WHERE email = $1", [email]);
    const usuario = result.rows[0];

    if (!usuario || !bcrypt.compareSync(senha, usuario.senha)) {
      return res.status(401).json({
        mensagem: "Usuário ou senha inválidos"
      });
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email },
      JWT_SECRET,
      { expiresIn: "2h" }
    );

    return res.status(200).json({
      mensagem: "Login realizado com sucesso",
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ mensagem: "Erro ao fazer login" });
  }
}

module.exports = { login };