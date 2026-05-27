const medicamentos = require("../data/medicamentos");
// Importamos a função salvarDados do dbHelper para gravar as alterações em disco
const { salvarDados } = require("../data/dbHelper");

/**
 * Retorna a lista de medicamentos apenas do usuário que está logado.
 */
function listarMedicamentos(req, res) {
  // O 'authMiddleware' colocou as informações do usuário em 'req.usuarioLogado'
  const usuarioId = req.usuarioLogado.id;

  // Filtramos a lista completa de medicamentos, mantendo somente aqueles que possuem o mesmo usuarioId do token
  const meusMedicamentos = medicamentos.filter(
    m => m.usuarioId === usuarioId
  );

  return res.status(200).json(meusMedicamentos);
}

/**
 * Busca um medicamento específico pelo ID, garantindo que ele pertença ao usuário logado.
 */
function buscarMedicamento(req, res) {
  const { id } = req.params;
  const usuarioId = req.usuarioLogado.id;

  // Procuramos o remédio comparando o ID do medicamento e garantindo que ele pertença ao usuário ativo
  const medicamento = medicamentos.find(
    m => m.id == id && m.usuarioId === usuarioId
  );

  if (!medicamento) {
    return res.status(404).json({
      mensagem: "Medicamento não encontrado"
    });
  }

  return res.status(200).json(medicamento);
}

/**
 * Cadastra um novo medicamento vinculando-o ao usuário logado.
 */
function cadastrarMedicamento(req, res) {
  const { nome, dosagem, intervalo, horarios, horaInicio } = req.body;
  const usuarioId = req.usuarioLogado.id;

  if (!nome || !dosagem || !intervalo || !horaInicio) {
    return res.status(400).json({
      mensagem: "Nome, dosagem, intervalo e horário inicial são obrigatórios"
    });
  }

  // Criamos o novo objeto inserindo o 'usuarioId' e 'horaInicio'
  const novoMedicamento = {
    id: medicamentos.length + 1,
    usuarioId, // Identifica a quem pertence este remédio
    nome,
    dosagem,
    intervalo,
    horaInicio, // Armazena a hora de início configurada
    horarios: horarios || []
  };

  // Adiciona o novo medicamento ao array em memória
  medicamentos.push(novoMedicamento);

  // Salva a lista atualizada de medicamentos no arquivo 'medicamentos.json'
  salvarDados("medicamentos.json", medicamentos);

  return res.status(201).json({
    mensagem: "Medicamento cadastrado com sucesso",
    medicamento: novoMedicamento
  });
}

/**
 * Atualiza os dados de um medicamento, validando a propriedade do usuário logado.
 */
function atualizarMedicamento(req, res) {
  const { id } = req.params;
  const { nome, dosagem, intervalo, horarios, horaInicio } = req.body;
  const usuarioId = req.usuarioLogado.id;

  // Procuramos o remédio garantindo que seja do usuário autenticado
  const medicamento = medicamentos.find(
    m => m.id == id && m.usuarioId === usuarioId
  );

  if (!medicamento) {
    return res.status(404).json({
      mensagem: "Medicamento não encontrado ou acesso não autorizado"
    });
  }

  // Atualiza as propriedades se elas foram enviadas no corpo da requisição
  medicamento.nome = nome || medicamento.nome;
  medicamento.dosagem = dosagem || medicamento.dosagem;
  medicamento.intervalo = intervalo || medicamento.intervalo;
  medicamento.horarios = horarios || medicamento.horarios;
  medicamento.horaInicio = horaInicio || medicamento.horaInicio;

  // Salva a lista atualizada de medicamentos no disco
  salvarDados("medicamentos.json", medicamentos);

  return res.status(200).json({
    mensagem: "Medicamento atualizado com sucesso",
    medicamento
  });
}

/**
 * Remove um medicamento da lista, validando a propriedade do usuário logado.
 */
function deletarMedicamento(req, res) {
  const { id } = req.params;
  const usuarioId = req.usuarioLogado.id;

  // Encontra o index do medicamento correspondente e que pertença ao usuário ativo
  const index = medicamentos.findIndex(
    m => m.id == id && m.usuarioId === usuarioId
  );

  if (index === -1) {
    return res.status(404).json({
      mensagem: "Medicamento não encontrado ou acesso não autorizado"
    });
  }

  // Remove o medicamento da lista em memória
  medicamentos.splice(index, 1);

  // Salva a lista atualizada (sem o item removido) no arquivo 'medicamentos.json'
  salvarDados("medicamentos.json", medicamentos);

  return res.status(200).json({
    mensagem: "Medicamento removido com sucesso"
  });
}

module.exports = {
  listarMedicamentos,
  buscarMedicamento,
  cadastrarMedicamento,
  atualizarMedicamento,
  deletarMedicamento
};