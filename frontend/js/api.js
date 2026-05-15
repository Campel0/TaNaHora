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

/**
 * Exibe uma notificação amigável na tela (Toast)
 */
function showToast(mensagem, tipo = "sucesso") {
  // Cria o container se não existir
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    Object.assign(container.style, {
      position: "fixed",
      bottom: "20px",
      right: "20px",
      display: "flex",
      flexDirection: "column",
      gap: "10px",
      zIndex: "9999"
    });
    document.body.appendChild(container);
  }

  // Cria a notificação
  const toast = document.createElement("div");
  toast.innerText = mensagem;
  Object.assign(toast.style, {
    minWidth: "250px",
    padding: "16px",
    borderRadius: "8px",
    color: "#fff",
    fontSize: "14px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    transform: "translateX(100%)",
    opacity: "0",
    transition: "all 0.3s ease",
    background: tipo === "sucesso" ? "#10b981" : "#ef4444",
    fontFamily: "system-ui, -apple-system, sans-serif"
  });

  container.appendChild(toast);

  // Animação de entrada
  setTimeout(() => {
    toast.style.transform = "translateX(0)";
    toast.style.opacity = "1";
  }, 10);

  // Animação de saída
  setTimeout(() => {
    toast.style.transform = "translateX(100%)";
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}