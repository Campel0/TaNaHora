const medicamentos = require("../data/medicamentos");
// Importamos a função salvarDados do dbHelper para gravar as alterações em disco
const { salvarDados } = require("../data/dbHelper");

function listarMedicamentos(req, res) {
  return res.status(200).json(medicamentos);
}

function buscarMedicamento(req, res) {
  const { id } = req.params;

  const medicamento = medicamentos.find(
    m => m.id == id
  );

  if (!medicamento) {
    return res.status(404).json({
      mensagem: "Medicamento não encontrado"
    });
  }

  return res.status(200).json(medicamento);
}

function cadastrarMedicamento(req, res) {
  const { nome, dosagem, intervalo, horarios } = req.body;

  if (!nome || !dosagem || !intervalo) {
    return res.status(400).json({
      mensagem: "Nome, dosagem e intervalo são obrigatórios"
    });
  }

  const novoMedicamento = {
    id: medicamentos.length + 1,
    nome,
    dosagem,
    intervalo,
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

function atualizarMedicamento(req, res) {
  const { id } = req.params;
  const { nome, dosagem, intervalo, horarios } = req.body;

  const medicamento = medicamentos.find(
    m => m.id == id
  );

  if (!medicamento) {
    return res.status(404).json({
      mensagem: "Medicamento não encontrado"
    });
  }

  // Atualiza as propriedades se elas foram enviadas no body
  medicamento.nome = nome || medicamento.nome;
  medicamento.dosagem = dosagem || medicamento.dosagem;
  medicamento.intervalo = intervalo || medicamento.intervalo;
  medicamento.horarios = horarios || medicamento.horarios;

  // Salva a lista atualizada de medicamentos com o item alterado no disco
  salvarDados("medicamentos.json", medicamentos);

  return res.status(200).json({
    mensagem: "Medicamento atualizado com sucesso",
    medicamento
  });
}

function deletarMedicamento(req, res) {
  const { id } = req.params;

  const index = medicamentos.findIndex(
    m => m.id == id
  );

  if (index === -1) {
    return res.status(404).json({
      mensagem: "Medicamento não encontrado"
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