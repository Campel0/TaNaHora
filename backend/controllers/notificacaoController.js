const medicamentosDb = require("../data/medicamentos");
const historicoDb = require("../data/historico");

function listarNotificacoes(req, res) {
  const usuarioId = req.usuarioLogado.id;
  const medicamentos = medicamentosDb.get().filter(m => m.usuarioId === usuarioId);
  if (medicamentos.length === 0) {
    return res.status(404).json({
      mensagem: "Nenhum medicamento cadastrado"
    });
  }

  const notificacoes = medicamentos.map(medicamento => ({
    medicamentoId: medicamento.id,
    mensagem: `Tomar ${medicamento.nome} - ${medicamento.dosagem}`,
    horarios: medicamento.horarios
  }));

  return res.status(200).json(notificacoes);
}

function registrarStatus(req, res) {
  const { medicamentoId, status } = req.body;

  if (!medicamentoId || !status) {
    return res.status(400).json({
      mensagem: "medicamentoId e status são obrigatórios"
    });
  }

  if (status !== "Tomado" && status !== "Pular") {
    return res.status(400).json({
      mensagem: "Status deve ser Tomado ou Pular"
    });
  }

  const medicamentos = medicamentosDb.get();
  const medicamento = medicamentos.find(
    m => m.id == medicamentoId && m.usuarioId === req.usuarioLogado.id
  );

  if (!medicamento) {
    return res.status(404).json({
      mensagem: "Medicamento não encontrado"
    });
  }

  const historico = historicoDb.get();
  const registro = {
    id: historico.length > 0 ? Math.max(...historico.map(h => h.id)) + 1 : 1,
    usuarioId: req.usuarioLogado.id,
    medicamentoId,
    medicamento: medicamento.nome,
    data: new Date().toLocaleDateString(),
    hora: new Date().toLocaleTimeString(),
    status
  };

  historico.push(registro);
  historicoDb.set(historico);

  return res.status(200).json({
    mensagem: "Status registrado com sucesso",
    registro
  });
}

module.exports = {
  listarNotificacoes,
  registrarStatus
};