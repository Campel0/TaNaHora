async function cadastrarMedicamento() {
  const nome = document.getElementById("nome").value;
  const dosagem = document.getElementById("dosagem").value;
  const intervalo = document.getElementById("intervalo").value;

  await fetch(`${API_URL}/medicamentos`, {
    method:"POST",
    headers:{
      "Content-Type":"application/json"
    },
    body: JSON.stringify({
      nome,
      dosagem,
      intervalo
    })
  });

  listarMedicamentos();
}

async function listarMedicamentos() {
  const resposta = await fetch(`${API_URL}/medicamentos`);
  const dados = await resposta.json();

  const lista = document.getElementById("lista");
  lista.innerHTML = "";

  dados.forEach(m => {
    lista.innerHTML +=
      `<li>${m.nome} - ${m.dosagem}</li>`;
  });
}

listarMedicamentos();