const medicamentosDb = require("../data/medicamentos");

function listarMedicamentos(req, res) {
  const usuarioId = req.usuarioLogado.id;
  const medicamentos = medicamentosDb.get().filter(m => m.usuarioId === usuarioId);
  return res.status(200).json(medicamentos);
}

function buscarMedicamento(req, res) {
  const { id } = req.params;

  const medicamentos = medicamentosDb.get();
  const medicamento = medicamentos.find(
    m => m.id == id && m.usuarioId === req.usuarioLogado.id
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

  const medicamentos = medicamentosDb.get();
  const novoMedicamento = {
    id: medicamentos.length > 0 ? Math.max(...medicamentos.map(m => m.id)) + 1 : 1,
    usuarioId: req.usuarioLogado.id,
    nome,
    dosagem,
    intervalo,
    horarios: horarios || []
  };

  medicamentos.push(novoMedicamento);
  medicamentosDb.set(medicamentos);

  return res.status(201).json({
    mensagem: "Medicamento cadastrado com sucesso",
    medicamento: novoMedicamento
  });
}

function atualizarMedicamento(req, res) {
  const { id } = req.params;
  const { nome, dosagem, intervalo, horarios } = req.body;

  const medicamentos = medicamentosDb.get();
  const medicamento = medicamentos.find(
    m => m.id == id && m.usuarioId === req.usuarioLogado.id
  );

  if (!medicamento) {
    return res.status(404).json({
      mensagem: "Medicamento não encontrado"
    });
  }

  medicamento.nome = nome || medicamento.nome;
  medicamento.dosagem = dosagem || medicamento.dosagem;
  medicamento.intervalo = intervalo || medicamento.intervalo;
  medicamento.horarios = horarios || medicamento.horarios;

  medicamentosDb.set(medicamentos);

  return res.status(200).json({
    mensagem: "Medicamento atualizado com sucesso",
    medicamento
  });
}

function deletarMedicamento(req, res) {
  const { id } = req.params;

  const medicamentos = medicamentosDb.get();
  const index = medicamentos.findIndex(
    m => m.id == id && m.usuarioId === req.usuarioLogado.id
  );

  if (index === -1) {
    return res.status(404).json({
      mensagem: "Medicamento não encontrado"
    });
  }

  medicamentos.splice(index, 1);
  medicamentosDb.set(medicamentos);

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