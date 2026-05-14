/**
 * Função responsável por autenticar o usuário no sistema.
 * 
 * Passo a passo:
 * 1. Pega os valores digitados nos campos de e-mail e senha.
 * 2. Faz uma requisição POST para a API no endpoint /login.
 * 3. Analisa a resposta:
 *    - Se der certo (resposta.ok), salva o token recebido no localStorage e redireciona.
 *    - Se der erro, exibe a mensagem de erro retornada pela API.
 * 4. Utiliza try/catch para capturar falhas de rede (ex: servidor fora do ar).
 */
async function login() {
  // 1. Pegamos as referências e valores dos elementos do DOM
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;
  const mensagem = document.getElementById("mensagem");

  try {
    // 2. Disparamos a requisição assíncrona para a nossa API
    const resposta = await fetch(`${API_URL}/login`, {
      method: "POST", // Método utilizado para enviar dados sensíveis
      headers: {
        "Content-Type": "application/json" // Informamos que o corpo da requisição é um JSON
      },
      // Transformamos nosso objeto JS em uma string JSON para enviar pela rede
      body: JSON.stringify({ email, senha }) 
    });

    // 3. Aguardamos a conversão da resposta para um objeto JavaScript
    const dados = await resposta.json();

    // 4. Exibimos a mensagem que o backend nos retornou
    mensagem.innerText = dados.mensagem;

    // 5. Verificamos se o status HTTP da resposta é de sucesso (ex: 200)
    if (resposta.ok) {
      mensagem.style.color = "green"; // Sucesso visual

      // Salvamos o token JWT no armazenamento local do navegador (localStorage)
      // Assim ele persiste mesmo se fecharmos a aba
      localStorage.setItem("token_tanahora", dados.token);
      localStorage.setItem("usuario_tanahora", JSON.stringify(dados.usuario));

      // 6. Após 1 segundo de espera, redirecionamos para a tela principal
      setTimeout(() => {
        window.location.replace("/medicamentos.html");
      }, 1000);

    } else {
      // Caso a resposta não seja "ok" (ex: senha inválida), alertamos o usuário
      mensagem.style.color = "red";
    }

  } catch (erro) {
    // 7. Se cairmos no catch, provavelmente o servidor está offline ou houve erro na internet
    console.error("Erro na requisição:", erro);
    mensagem.innerText = "Erro ao conectar com o servidor. Tente novamente mais tarde.";
    mensagem.style.color = "red";
  }
}