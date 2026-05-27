/**
 * Cadastra um novo medicamento utilizando o fetchAutenticado (com token JWT).
 */
async function cadastrarMedicamento() {
  // 1. Pegamos os valores dos campos
  const nome = document.getElementById("nome").value;
  const dosagem = document.getElementById("dosagem").value;
  const intervalo = document.getElementById("intervalo").value;

  try {
    // 2. Usamos nossa função wrapper (que já insere o Token) para enviar os dados
    const resposta = await fetchAutenticado("/medicamentos", {
      method: "POST",
      // O fetchAutenticado já define o Content-Type: application/json
      body: JSON.stringify({ nome, dosagem, intervalo })
    });

    if (resposta.ok) {
      showToast("Medicamento cadastrado com sucesso!");
      // 3. Limpamos os campos do formulário
      document.getElementById("nome").value = "";
      document.getElementById("dosagem").value = "";
      document.getElementById("intervalo").value = "";
      
      // 4. Atualizamos a listagem para mostrar o novo item
      listarMedicamentos();
    } else {
      const dadosErro = await resposta.json();
      showToast(`Erro ao cadastrar: ${dadosErro.mensagem}`, "erro");
    }
  } catch (erro) {
    console.error("Erro na requisição:", erro);
    showToast("Não foi possível conectar ao servidor.", "erro");
  }
}

/**
 * Busca a lista de medicamentos do backend protegida por Token e exibe na tela.
 */
async function listarMedicamentos() {
  try {
    // 1. Disparamos a requisição GET autenticada
    const resposta = await fetchAutenticado("/medicamentos");
    
    // Se o backend rejeitou (ex: token inválido, o fetchAutenticado já vai redirecionar)
    if (!resposta || !resposta.ok) return;

    // 2. Convertendo a resposta em JSON
    const dados = await resposta.json();

    // 3. Pegamos a referência da lista <ul> no HTML
    const lista = document.getElementById("lista");
    lista.innerHTML = ""; // Limpa a lista antes de renderizar

    // 4. Se a lista estiver vazia, mostramos uma mensagem amigável
    if (dados.length === 0) {
      lista.innerHTML = "<li>Nenhum medicamento cadastrado.</li>";
      return;
    }

    // 5. Varremos (loop) os dados recebidos para criar os elementos de lista
    dados.forEach(medicamento => {
      lista.innerHTML += `
        <li style="display: flex; justify-content: space-between; align-items: center; padding: 10px; border-bottom: 1px solid #eee;">
          <span><strong>${medicamento.nome}</strong> - ${medicamento.dosagem} (a cada ${medicamento.intervalo}h)</span>
         <div style="display: flex; gap: 7px;">

  <!-- botões de editar e excluir -->   
         
  <button onclick="editarMedicamento(${medicamento.id})"
    style=" background: #189c65;padding: 3px 7px;font-size: 12px;border-radius: 4px;border: none;color: white;cursor: pointer;">
    Editar
  </button>

  <button
    onclick="excluirMedicamento(${medicamento.id})"
    style="background: #ef4444;padding: 3px 7px;font-size: 12px;border-radius: 4px;border: none;color: white;cursor: pointer;">
    Excluir
  </button>

</div>
        </li>
      `;
    });
  } catch (erro) {
    console.error("Erro ao listar medicamentos:", erro);
    showToast("Erro ao carregar medicamentos.", "erro"); 
    // Mensagem de erro  para o usuário
  }
}

// Função para redirecionar para a página de edição do medicamento
async function editarMedicamento(id) {
  window.location.href = `editarMedicamento.html?id=${id}`;
}


/**
 * Exclui um medicamento do backend
 */
async function excluirMedicamento(id) {
  if (!confirm("Tem certeza que deseja excluir este medicamento?")) return;

  try {
    const resposta = await fetchAutenticado(`/medicamentos/${id}`, {
      method: "DELETE"
    });

    if (resposta.ok) {
      showToast("Medicamento excluído com sucesso!");
      listarMedicamentos(); // Atualiza a lista
    } else {
      const dadosErro = await resposta.json();
      showToast(`Erro ao excluir: ${dadosErro.mensagem}`, "erro");
    }
  } catch (erro) {
    console.error("Erro ao excluir medicamento:", erro);
    showToast("Erro de conexão ao excluir.", "erro");
  }
}


// Ao abrir a página, já disparamos a função para listar
listarMedicamentos();