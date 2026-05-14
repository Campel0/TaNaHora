/**
 * Busca a lista de notificações geradas pelo backend e as exibe na tela.
 */
async function carregarNotificacoes() {
  try {
    // 1. Faz a requisição protegida para buscar o que precisa ser tomado
    const resposta = await fetchAutenticado("/notificacoes");
    
    // Se houve erro de autenticação (redirecionamento), paramos
    if (!resposta) return;

    // 2. Transforma a resposta em um objeto JS
    const dados = await resposta.json();
    
    const lista = document.getElementById("listaNotificacoes");
    lista.innerHTML = "";

    // 3. Se a resposta for um erro (ex: 404 Nenhum remédio cadastrado)
    if (!resposta.ok) {
      lista.innerHTML = `<li>${dados.mensagem || "Nenhuma notificação no momento."}</li>`;
      return;
    }

    // 4. Se a lista estiver vazia por algum motivo
    if (dados.length === 0) {
      lista.innerHTML = "<li>Nenhum medicamento para tomar agora.</li>";
      return;
    }

    // 5. Varre os dados recebidos e cria os cards de notificação
    dados.forEach(notificacao => {
      // O uso de ${notificacao.medicamentoId} nos parâmetros da função registrarStatus é vital 
      // para saber qual remédio estamos confirmando.
      lista.innerHTML += `
        <li>
          <strong>💊 ${notificacao.mensagem}</strong>
          
          <div class="botoes-acao">
            <button class="btn-success" onclick="registrarStatus('${notificacao.medicamentoId}', 'Tomado')">
              ✔️ Tomado
            </button>
            <button class="btn-danger" onclick="registrarStatus('${notificacao.medicamentoId}', 'Pular')">
              ❌ Pular
            </button>
          </div>
        </li>
      `;
    });

  } catch (erro) {
    console.error("Erro ao carregar notificações:", erro);
    alert("Erro de conexão ao buscar as notificações.");
  }
}

/**
 * Envia para o backend a confirmação se o remédio foi tomado ou pulado.
 * 
 * @param {string|number} id - O ID do medicamento
 * @param {string} status - A ação ("Tomado" ou "Pular")
 */
async function registrarStatus(id, status) {
  try {
    // 1. Dispara um POST enviando no corpo do JSON o ID e a ação escolhida
    const resposta = await fetchAutenticado("/notificacoes", {
      method: "POST",
      body: JSON.stringify({
        medicamentoId: id,
        status: status
      })
    });

    // 2. Aguarda a mensagem do servidor
    const dados = await resposta.json();

    if (resposta.ok) {
      // 3. Sucesso! Mostra um alerta com a mensagem do servidor
      alert(`✅ Sucesso: ${dados.mensagem}`);
      
      // 4. Se o usuário já tomou, idealmente podemos recarregar a lista
      // ou apenas esconder o item atual. Por simplicidade, vamos recarregar tudo.
      carregarNotificacoes();
    } else {
      // Caso dê algum erro de validação (ex: enviou status inválido)
      alert(`⚠️ Erro: ${dados.mensagem}`);
    }

  } catch (erro) {
    console.error("Erro ao registrar status:", erro);
    alert("Erro de comunicação ao registrar o status.");
  }
}

// Carrega as notificações logo que a página HTML for aberta
carregarNotificacoes();
