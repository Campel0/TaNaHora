/**
 * Busca o histórico do backend protegida por Token e exibe na tela.
 */
async function carregarHistorico() {
  try {
    // 1. Usamos a função wrapper para injetar o Token automaticamente
    const resposta = await fetchAutenticado("/historico");
    
    // Se a resposta for nula (ex: redirecionamento de token inválido), paramos aqui
    if (!resposta) return;

    // 2. Extraímos os dados em formato JSON, mesmo se for erro 404, 
    // pois o backend manda a { mensagem: "Nenhum registro..." }
    const dados = await resposta.json();

    // 3. Selecionamos o elemento HTML que receberá a lista
    const lista = document.getElementById("lista");
    lista.innerHTML = ""; // Limpeza de estado inicial

    // 4. Verificamos se há apenas uma mensagem (ex: "Sem histórico")
    if (dados.mensagem) {
      lista.innerHTML = `<li>${dados.mensagem}</li>`;
      return;
    }

    // 5. Se temos um array de histórico, percorremos cada item
    dados.forEach(item => {
      // Uso de Template Literals (``) do JS Moderno para montagem da string
      lista.innerHTML += `
        <li>
          <strong>${item.medicamento}</strong> - Status: ${item.status}
        </li>
      `;
    });
  } catch (erro) {
    // 6. Tratamento de erro robusto caso o servidor não responda
    console.error("Erro ao carregar histórico:", erro);
    alert("Não foi possível carregar o histórico.");
  }
}

// Ao abrir a página, carregamos o histórico automaticamente
carregarHistorico();