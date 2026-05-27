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
      alert("Medicamento cadastrado com sucesso!");
      // 3. Limpamos os campos do formulário
      document.getElementById("nome").value = "";
      document.getElementById("dosagem").value = "";
      document.getElementById("intervalo").value = "";
      
      // 4. Atualizamos a listagem para mostrar o novo item
      listarMedicamentos();
    } else {
      const dadosErro = await resposta.json();
      alert(`Erro ao cadastrar: ${dadosErro.mensagem}`);
    }
  } catch (erro) {
    console.error("Erro na requisição:", erro);
    alert("Não foi possível conectar ao servidor.");
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

    // 5. Varremos (loop) os dados recebidos para criar os elementos de lista com botões de ação
    dados.forEach(medicamento => {
      // Injetamos um template literal contendo o texto do remédio e os botões
      // que chamam abrirEdicao() e deletarMedicamento() passando o ID do remédio correspondente.
      lista.innerHTML += `
        <li>
          <div>
            <strong>💊 ${medicamento.nome}</strong> - ${medicamento.dosagem} (a cada ${medicamento.intervalo}h)
          </div>
          <div class="botoes-acao" style="margin-top: 10px;">
            <button class="btn-editar" onclick="abrirEdicao('${medicamento.id}', '${medicamento.nome}', '${medicamento.dosagem}', '${medicamento.intervalo}')">
              ✏️ Editar
            </button>
            <button class="btn-danger" style="padding: 10px; font-size: 13px;" onclick="deletarMedicamento('${medicamento.id}')">
              🗑️ Excluir
            </button>
          </div>
        </li>
      `;
    });
  } catch (erro) {
    console.error("Erro ao listar medicamentos:", erro);
  }
}

/**
 * Remove um medicamento do backend fazendo uma chamada DELETE.
 * 
 * @param {string|number} id - O ID do medicamento a ser excluído
 */
async function deletarMedicamento(id) {
  // Confirmamos se o usuário realmente deseja realizar a ação de exclusão
  const confirmar = confirm("Tem certeza que deseja remover este medicamento?");
  if (!confirmar) return;

  try {
    // Fazemos a requisição DELETE para a rota protegida
    const resposta = await fetchAutenticado(`/medicamentos/${id}`, {
      method: "DELETE"
    });

    if (resposta.ok) {
      alert("Medicamento removido com sucesso!");
      // Atualizamos a lista de medicamentos na tela após a exclusão
      listarMedicamentos();
    } else {
      const dadosErro = await resposta.json();
      alert(`Erro ao remover: ${dadosErro.mensagem}`);
    }
  } catch (erro) {
    console.error("Erro ao deletar:", erro);
    alert("Erro de conexão ao remover o medicamento.");
  }
}

/**
 * Abre o modal de edição de medicamento preenchendo os campos com os dados atuais.
 */
function abrirEdicao(id, nome, dosagem, intervalo) {
  // Preenchemos os campos do formulário do modal com as informações do medicamento selecionado
  document.getElementById("edit-id").value = id;
  document.getElementById("edit-nome").value = nome;
  document.getElementById("edit-dosagem").value = dosagem;
  document.getElementById("edit-intervalo").value = intervalo;

  // Alteramos a propriedade de exibição do CSS para tornar o modal visível na tela
  document.getElementById("modal-edicao").style.display = "block";
}

/**
 * Fecha o modal de edição de medicamentos e limpa os campos.
 */
function fecharEdicao() {
  // Escondemos o modal alterando o display de volta para "none"
  document.getElementById("modal-edicao").style.display = "none";
  
  // Limpamos os inputs para o próximo uso
  document.getElementById("edit-id").value = "";
  document.getElementById("edit-nome").value = "";
  document.getElementById("edit-dosagem").value = "";
  document.getElementById("edit-intervalo").value = "";
}

/**
 * Envia as alterações do medicamento para o backend fazendo uma chamada PUT.
 */
async function salvarEdicao() {
  // Pegamos os valores inseridos pelo usuário no formulário do modal
  const id = document.getElementById("edit-id").value;
  const nome = document.getElementById("edit-nome").value;
  const dosagem = document.getElementById("edit-dosagem").value;
  const intervalo = document.getElementById("edit-intervalo").value;

  // Validação básica no lado do cliente
  if (!nome || !dosagem || !intervalo) {
    alert("Todos os campos devem ser preenchidos para salvar.");
    return;
  }

  try {
    // Fazemos a requisição PUT assíncrona para a rota '/medicamentos/:id'
    const resposta = await fetchAutenticado(`/medicamentos/${id}`, {
      method: "PUT",
      body: JSON.stringify({ nome, dosagem, intervalo })
    });

    if (resposta.ok) {
      alert("Medicamento atualizado com sucesso!");
      // Fechamos o formulário de edição
      fecharEdicao();
      // Recarregamos a listagem atualizada na tela
      listarMedicamentos();
    } else {
      const dadosErro = await resposta.json();
      alert(`Erro ao atualizar: ${dadosErro.mensagem}`);
    }
  } catch (erro) {
    console.error("Erro ao salvar edição:", erro);
    alert("Erro de conexão ao salvar alterações.");
  }
}

// Ao abrir a página, já disparamos a função para listar
listarMedicamentos();