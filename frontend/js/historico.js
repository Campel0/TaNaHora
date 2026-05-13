async function carregarHistorico() {
  const resposta =
    await fetch(`${API_URL}/historico`);

  const dados = await resposta.json();

  const lista =
    document.getElementById("lista");

  lista.innerHTML = "";

  if (dados.mensagem) {
    lista.innerHTML =
      `<li>${dados.mensagem}</li>`;
    return;
  }

  dados.forEach(item => {
    lista.innerHTML += `
      <li>
        ${item.medicamento}
        - ${item.status}
      </li>
    `;
  });
}

carregarHistorico();