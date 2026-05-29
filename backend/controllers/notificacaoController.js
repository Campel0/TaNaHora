const pool = require("../db");

async function listarNotificacoes(req, res) {
  const usuarioId = req.usuarioLogado.id;

  try {
    const result = await pool.query("SELECT * FROM medicamentos WHERE usuario_id = $1", [usuarioId]);
    const meusMedicamentos = result.rows;

    if (meusMedicamentos.length === 0) {
      return res.status(404).json({ mensagem: "Nenhum medicamento cadastrado" });
    }

    const notificacoes = meusMedicamentos.map(medicamento => ({
      medicamentoId: medicamento.id,
      mensagem: `Tomar ${medicamento.nome} - ${medicamento.dosagem}`,
      horarios: medicamento.horarios
    }));

    return res.status(200).json(notificacoes);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ mensagem: "Erro ao listar notificações" });
  }
}

async function registrarStatus(req, res) {
  const { medicamentoId, status } = req.body;
  const usuarioId = req.usuarioLogado.id;

  if (!medicamentoId || !status) {
    return res.status(400).json({ mensagem: "medicamentoId e status são obrigatórios" });
  }

  if (status !== "Tomado" && status !== "Pular") {
    return res.status(400).json({ mensagem: "Status deve ser Tomado ou Pular" });
  }

  try {
    const medicamentoQuery = await pool.query("SELECT * FROM medicamentos WHERE id = $1 AND usuario_id = $2", [medicamentoId, usuarioId]);
    
    if (medicamentoQuery.rows.length === 0) {
      return res.status(404).json({ mensagem: "Medicamento não encontrado ou acesso não autorizado" });
    }

    const medicamento = medicamentoQuery.rows[0];

    const data = new Date().toLocaleDateString();
    const hora = new Date().toLocaleTimeString();

    const insertQuery = await pool.query(
      `INSERT INTO historico (usuario_id, medicamento_id, medicamento, data, hora, status) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [usuarioId, medicamentoId, medicamento.nome, data, hora, status]
    );

    return res.status(200).json({
      mensagem: "Status registrado com sucesso",
      registro: insertQuery.rows[0]
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ mensagem: "Erro ao registrar status" });
  }
}

module.exports = {
  listarNotificacoes,
  registrarStatus
};