/**
 * Faz o envio do e-mail de recuperação de senha para a API.
 */
async function solicitarRecuperacao() {
  // 1. Pegamos a referência e o valor do e-mail digitado e o campo de feedback visual
  const email = document.getElementById("email").value;
  const mensagem = document.getElementById("mensagem");

  if (!email) {
    mostrarToast("Por favor, digite o e-mail cadastrado.", "erro");
    mensagem.innerText = "Digite o e-mail";
    mensagem.style.color = "red";
    return;
  }

  try {
    // Exibe um feedback inicial de carregamento na tela
    mensagem.innerText = "Enviando solicitação...";
    mensagem.style.color = "white";

    // 2. Disparamos a requisição POST para a rota pública de recuperação de senha do backend
    const resposta = await fetch(`${API_URL}/recuperar-senha`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email })
    });

    const dados = await resposta.json();

    // 3. Exibimos o feedback conforme a resposta da API
    if (resposta.ok) {
      // Exibe Toast de sucesso e altera o texto na tela
      mostrarToast("Link enviado com sucesso!", "sucesso");
      mensagem.innerText = dados.mensagem;
      mensagem.style.color = "green";
    } else {
      // Caso a resposta não seja 2xx (ex: e-mail não cadastrado)
      mostrarToast(dados.mensagem, "erro");
      mensagem.innerText = dados.mensagem;
      mensagem.style.color = "red";
    }

  } catch (erro) {
    console.error("Erro ao solicitar recuperação:", erro);
    mensagem.innerText = "Erro ao conectar com o servidor.";
    mensagem.style.color = "red";
    mostrarToast("Erro de conexão ao servidor.", "erro");
  }
}
