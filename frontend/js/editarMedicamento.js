const params = new URLSearchParams(window.location.search);
const id = params.get("id");

async function atualizarMedicamento() {
// Obter os valores dos campos
  const nome = document.getElementById("nome").value;
  const dosagem = document.getElementById("dosagem").value;
  const intervalo = document.getElementById("intervalo").value;

  try {

    const resposta = await fetchAutenticado(`/medicamentos/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        nome,
        dosagem,
        intervalo
      })
    });
// Converter a resposta em JSON para obter a mensagem de sucesso ou erro
    const dados = await resposta.json();

    if (resposta.ok) {

      showToast("Medicamento atualizado com sucesso!");

      setTimeout(() => {
        window.location.href = "/medicamentos.html";
      }, 1000);

    } else {

      showToast(dados.mensagem, "erro");

    }

  } catch (erro) {

    console.error(erro);
    showToast("Erro ao atualizar medicamento", "erro");

  }
}

document
  .getElementById("btnAtualizar")
  .addEventListener("click", atualizarMedicamento);

carregarMedicamento();