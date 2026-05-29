const pool = require("../db");

async function listarHistorico(req, res) {
  const usuarioId = req.usuarioLogado.id;

  try {
    const result = await pool.query("SELECT * FROM historico WHERE usuario_id = $1", [usuarioId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ mensagem: "Nenhum registro de administração encontrado" });
    }

    return res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ mensagem: "Erro ao listar histórico" });
  }
}

async function buscarHistoricoPorMedicamento(req, res) {
  const { medicamentoId } = req.params;
  const usuarioId = req.usuarioLogado.id;

  try {
    const result = await pool.query("SELECT * FROM historico WHERE medicamento_id = $1 AND usuario_id = $2", [medicamentoId, usuarioId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ mensagem: "Nenhum registro encontrado para este medicamento" });
    }

    return res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ mensagem: "Erro ao buscar histórico por medicamento" });
  }
}

module.exports = {
  listarHistorico,
  buscarHistoricoPorMedicamento
};