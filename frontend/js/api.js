const API_URL = "http://localhost:3000";

/**
 * Função auxiliar (wrapper) para realizar requisições à API.
 * Ela intercepta as chamadas e injeta automaticamente o token JWT
 * no cabeçalho "Authorization", simplificando as chamadas nas telas.
 * 
 * @param {string} endpoint - O caminho da rota (ex: "/medicamentos")
 * @param {object} opcoes - Configurações extras como method e body
 * @returns {Promise<Response>} - O resultado do fetch original
 */
async function fetchAutenticado(endpoint, opcoes = {}) {
  // 1. Buscamos o token armazenado previamente na hora do login
  const token = localStorage.getItem("token_tanahora");

  // 2. Se o usuário não tem token, forçamos ele a voltar para a tela de login
  if (!token) {
    window.location.replace("/index.html");
    return;
  }

  // 3. Garantimos que existe um objeto de headers, mesmo que vazio
  const headers = opcoes.headers || {};
  
  // 4. Injetamos o token no padrão Bearer (Portador)
  headers["Authorization"] = `Bearer ${token}`;
  
  // Se não foi passado Content-Type, assumimos JSON
  if (!headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  // Atualizamos as opções com os novos headers
  opcoes.headers = headers;

  // 5. Fazemos o disparo real da requisição para o backend
  const resposta = await fetch(`${API_URL}${endpoint}`, opcoes);

  // 6. Se a resposta for 401 (Não Autorizado), o token expirou ou é inválido.
  if (resposta.status === 401) {
    // Limpamos os dados locais e mandamos o usuário fazer login de novo
    localStorage.removeItem("token_tanahora");
    localStorage.removeItem("usuario_tanahora");
    window.location.replace("/index.html");
  }

  // 7. Retornamos a resposta para quem chamou essa função lidar com os dados
  return resposta;
}