const historicoDb = require("../data/historico");

function listarHistorico(req, res) {
  const historico = historicoDb.get();
  if (historico.length === 0) {
    return res.status(404).json({
      mensagem: "Nenhum registro de administração encontrado"
    });
  }

  return res.status(200).json(historico);
}

function buscarHistoricoPorMedicamento(req, res) {
  const { medicamentoId } = req.params;

  const historico = historicoDb.get();
  const registros = historico.filter(
    h => h.medicamentoId == medicamentoId
  );

  if (registros.length === 0) {
    return res.status(404).json({
      mensagem: "Nenhum registro encontrado para este medicamento"
    });
  }

  return res.status(200).json(registros);
}

module.exports = {
  listarHistorico,
  buscarHistoricoPorMedicamento
};