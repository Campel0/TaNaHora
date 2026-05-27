const historico = require("../data/historico");

/**
 * Retorna o histórico de administração de medicamentos apenas do usuário logado.
 */
function listarHistorico(req, res) {
  const usuarioId = req.usuarioLogado.id;

  // Filtramos os registros do histórico associados ao usuário logado
  const meuHistorico = historico.filter(
    h => h.usuarioId === usuarioId
  );

  if (meuHistorico.length === 0) {
    return res.status(404).json({
      mensagem: "Nenhum registro de administração encontrado"
    });
  }

  return res.status(200).json(meuHistorico);
}

/**
 * Retorna o histórico de um medicamento específico, garantindo que pertença ao usuário logado.
 */
function buscarHistoricoPorMedicamento(req, res) {
  const { medicamentoId } = req.params;
  const usuarioId = req.usuarioLogado.id;

  // Filtramos os registros comparando o ID do remédio e confirmando que pertença ao usuário ativo
  const registros = historico.filter(
    h => h.medicamentoId == medicamentoId && h.usuarioId === usuarioId
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