const usuarios = require("../data/usuarios");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../middlewares/authMiddleware");
// Importamos a biblioteca bcryptjs para comparar as senhas criptografadas
const bcrypt = require("bcryptjs");

function login(req, res) {
  const { email, senha } = req.body;

  // 1. Verifica se os campos foram preenchidos
  if (!email || !senha) {
    return res.status(400).json({
      mensagem: "E-mail e senha são obrigatórios"
    });
  }

  // 2. Busca o usuário cadastrado correspondente ao e-mail informado
  const usuario = usuarios.find(
    u => u.email === email
  );

  // 3. Se não encontrar o usuário, ou se a senha estiver incorreta (usando bcrypt.compareSync)
  // O compareSync pega a senha digitada, aplica o mesmo algoritmo de hash e compara com o hash salvo.
  if (!usuario || !bcrypt.compareSync(senha, usuario.senha)) {
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