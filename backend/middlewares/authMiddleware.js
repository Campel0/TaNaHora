const jwt = require("jsonwebtoken");

// Chave secreta para assinar e validar o token.
// Em produção, deve vir de variáveis de ambiente (process.env.JWT_SECRET)
const JWT_SECRET = "chave_super_secreta_tanahora";

/**
 * Middleware para proteger rotas.
 * Verifica se o cabeçalho Authorization foi enviado e se o token é válido.
 */
function authMiddleware(req, res, next) {
  // 1. Pega o cabeçalho "Authorization" da requisição
  const authHeader = req.headers.authorization;

  // 2. Verifica se o cabeçalho existe
  if (!authHeader) {
    return res.status(401).json({
      mensagem: "Acesso negado. Token não fornecido."
    });
  }

  // 3. O cabeçalho geralmente vem no formato "Bearer <token>"
  // Separamos pelo espaço e pegamos apenas a segunda parte (o token real)
  const partes = authHeader.split(" ");
  if (partes.length !== 2) {
    return res.status(401).json({
      mensagem: "Formato de token inválido."
    });
  }

  const token = partes[1];

  // 4. Valida o token usando a mesma chave que o assinou
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // 5. Se for válido, podemos salvar as informações do usuário na requisição
    // Isso permite que a próxima função saiba qual usuário está chamando a rota
    req.usuarioLogado = decoded;
    
    // 6. Passa para o próximo middleware/rota
    next();
  } catch (erro) {
    return res.status(401).json({
      mensagem: "Token inválido ou expirado."
    });
  }
}

module.exports = { authMiddleware, JWT_SECRET };
