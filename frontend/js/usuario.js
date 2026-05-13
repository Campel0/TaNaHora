async function cadastrar() {
  const nome = document.getElementById("nome").value;
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;

  const resposta = await fetch(`${API_URL}/usuarios`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ nome, email, senha })
  });

  const dados = await resposta.json();

  document.getElementById("mensagem").innerText =
    dados.mensagem;

  if (resposta.status === 201) {
    setTimeout(() => {
      window.location.href = "index.html";
    }, 1500);
  }
}