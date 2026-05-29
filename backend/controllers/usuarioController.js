const bcrypt = require("bcryptjs");
const pool = require("../db");

async function listarUsuarios(req, res) {
  try {
    const result = await pool.query("SELECT id, nome, email FROM usuarios");
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ mensagem: "Erro ao buscar usuários" });
  }
}

async function cadastrarUsuario(req, res) {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({
      mensagem: "Todos os campos obrigatórios devem ser preenchidos"
    });
  }

  try {
    const usuarioExistente = await pool.query("SELECT * FROM usuarios WHERE email = $1", [email]);
    if (usuarioExistente.rows.length > 0) {
      return res.status(409).json({
        mensagem: "Este e-mail já está cadastrado"
      });
    }

    const senhaCriptografada = bcrypt.hashSync(senha, 10);
    const result = await pool.query(
      "INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3) RETURNING id, nome, email",
      [nome, email, senhaCriptografada]
    );

    return res.status(201).json({
      mensagem: "Cadastro realizado com sucesso",
      usuario: result.rows[0]
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ mensagem: "Erro interno ao cadastrar usuário" });
  }
}

module.exports = {
  listarUsuarios,
  cadastrarUsuario
};