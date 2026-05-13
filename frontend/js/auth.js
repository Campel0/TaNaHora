async function login() {
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;
  const mensagem = document.getElementById("mensagem");

  try {
    const resposta = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        senha
      })
    });

    const dados = await resposta.json();

    mensagem.innerText = dados.mensagem;

    if (resposta.status === 200) {
      mensagem.style.color = "green";

      setTimeout(() => {
        window.location.href = "medicamentos.html";
      }, 1000);
    } else {
      mensagem.style.color = "red";
    }

  } catch (erro) {
    mensagem.innerText = "Erro ao conectar com o servidor";
    mensagem.style.color = "red";
  }
}