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
 * Exibe um Toast temporário estilizado na tela para dar feedback ao usuário.
 * 
 * @param {string} mensagem - A mensagem a ser exibida.
 * @param {string} tipo - O tipo do feedback ("sucesso", "erro", "info").
 */
function mostrarToast(mensagem, tipo = "info") {
  // 1. Buscamos se já existe um container de Toasts no HTML da página ativa
  let container = document.querySelector(".toast-container");
  
  // 2. Se não existir, criamos o container dinamicamente e anexamos no final do body
  if (!container) {
    container = document.createElement("div");
    container.className = "toast-container";
    document.body.appendChild(container);
  }

  // 3. Criamos o elemento de Toast individual
  const toast = document.createElement("div");
  // Aplicamos a classe CSS 'toast' e o tipo específico ('sucesso', 'erro' ou 'info')
  toast.className = `toast ${tipo}`;
  
  // Definimos o emoji indicador com base no status da operação
  let emoji = "ℹ️";
  if (tipo === "sucesso") emoji = "✅";
  if (tipo === "erro") emoji = "❌";

  // Montamos o HTML interno do toast com o emoji e a mensagem de texto
  toast.innerHTML = `<span>${emoji}</span> <span>${mensagem}</span>`;

  // 4. Adicionamos o Toast na fila do container
  container.appendChild(toast);

  // 5. Definimos um timer de 3 segundos (3000ms) para remover o elemento após a animação de saída sumir da tela
  setTimeout(() => {
    toast.remove();
    // Se o container de toasts ficar vazio, nós o removemos do DOM para limpar o documento
    if (container.children.length === 0) {
      container.remove();
    }
  }, 3000);
}