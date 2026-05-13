async function login() {
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;

  const resposta = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type":"application/json"
    },
    body: JSON.stringify({ email, senha })
  });

  const dados = await resposta.json();

  document.getElementById("mensagem").innerText =
    dados.mensagem;
}