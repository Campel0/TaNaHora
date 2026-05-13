async function cadastrar() {
  const nome = document.getElementById("nome").value;
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;
  const mensagem = document.getElementById("mensagem");

  try {
    const resposta = await fetch(`${API_URL}/usuarios`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        nome,
        email,
        senha
      })
    });

    const dados = await resposta.json();

    mensagem.innerText = dados.mensagem;

    if (resposta.status === 201) {
      mensagem.style.color = "green";

      setTimeout(() => {
        window.location.href = "index.html";
      }, 1500);
    } else {
      mensagem.style.color = "red";
    }

  } catch (erro) {
    mensagem.innerText = "Erro ao conectar com o servidor";
    mensagem.style.color = "red";
  }
}