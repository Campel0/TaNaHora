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

    // 5. Varremos (loop) os dados recebidos para criar os elementos de lista
    dados.forEach(medicamento => {
      // Usamos Template Literals (``) do JS Moderno para interpolar variáveis
      lista.innerHTML += `<li><strong>${medicamento.nome}</strong> - ${medicamento.dosagem} (a cada ${medicamento.intervalo}h)</li>`;
    });
  } catch (erro) {
    console.error("Erro ao listar medicamentos:", erro);
  }
}

// Ao abrir a página, já disparamos a função para listar
listarMedicamentos();