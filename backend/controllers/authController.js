const usuarios = require("../data/usuarios");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../middlewares/authMiddleware");

function login(req, res) {
  const { email, senha } = req.body;

  // 1. Verifica se os campos foram preenchidos
  if (!email || !senha) {
    return res.status(400).json({
      mensagem: "E-mail e senha são obrigatórios"
    });
  }

  // 2. Busca o usuário no "banco" (no momento, o array em memória)
  const usuario = usuarios.find(
    u => u.email === email && u.senha === senha
  );

  // 3. Se não encontrou, retorna erro de autenticação
  if (!usuario) {
    return res.status(401).json({
      mensagem: "Usuário ou senha inválidos"
    });
  }

  // 4. Se chegou aqui, o usuário existe e a senha está correta.
  // Vamos gerar um Token JWT que expira em 2 horas.
  // O payload do token contém o ID e e-mail do usuário.
  const token = jwt.sign(
    { id: usuario.id, email: usuario.email },
    JWT_SECRET,
    { expiresIn: "2h" }
  );

  // 5. Retornamos a resposta de sucesso incluindo o token
  return res.status(200).json({
    mensagem: "Login realizado com sucesso",
    token, // aqui enviamos o token recém-gerado
    usuario: {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email
    }
  });
}

module.exports = { login };