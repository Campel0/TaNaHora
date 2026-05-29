const pool = require("../db");

async function listarMedicamentos(req, res) {
  const usuarioId = req.usuarioLogado.id;
  try {
    const result = await pool.query("SELECT * FROM medicamentos WHERE usuario_id = $1", [usuarioId]);
    return res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ mensagem: "Erro ao listar medicamentos" });
  }
}

async function buscarMedicamento(req, res) {
  const { id } = req.params;
  const usuarioId = req.usuarioLogado.id;
  try {
    const result = await pool.query("SELECT * FROM medicamentos WHERE id = $1 AND usuario_id = $2", [id, usuarioId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ mensagem: "Medicamento não encontrado" });
    }
    return res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ mensagem: "Erro ao buscar medicamento" });
  }
}

async function cadastrarMedicamento(req, res) {
  const { nome, dosagem, intervalo, horarios, horaInicio } = req.body;
  const usuarioId = req.usuarioLogado.id;

  if (!nome || !dosagem || !intervalo || !horaInicio) {
    return res.status(400).json({
      mensagem: "Nome, dosagem, intervalo e horário inicial são obrigatórios"
    });
  }

  try {
    const result = await pool.query(
      `INSERT INTO medicamentos (usuario_id, nome, dosagem, intervalo, hora_inicio, horarios) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [usuarioId, nome, dosagem, intervalo, horaInicio, horarios || []]
    );

    return res.status(201).json({
      mensagem: "Medicamento cadastrado com sucesso",
      medicamento: result.rows[0]
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ mensagem: "Erro ao cadastrar medicamento" });
  }
}

async function atualizarMedicamento(req, res) {
  const { id } = req.params;
  const { nome, dosagem, intervalo, horarios, horaInicio } = req.body;
  const usuarioId = req.usuarioLogado.id;

  try {
    const check = await pool.query("SELECT * FROM medicamentos WHERE id = $1 AND usuario_id = $2", [id, usuarioId]);
    if (check.rows.length === 0) {
      return res.status(404).json({ mensagem: "Medicamento não encontrado ou acesso não autorizado" });
    }

    const current = check.rows[0];
    const newNome = nome || current.nome;
    const newDosagem = dosagem || current.dosagem;
    const newIntervalo = intervalo || current.intervalo;
    const newHorarios = horarios || current.horarios;
    const newHoraInicio = horaInicio || current.hora_inicio;

    const result = await pool.query(
      `UPDATE medicamentos 
       SET nome = $1, dosagem = $2, intervalo = $3, horarios = $4, hora_inicio = $5 
       WHERE id = $6 AND usuario_id = $7 RETURNING *`,
      [newNome, newDosagem, newIntervalo, newHorarios, newHoraInicio, id, usuarioId]
    );

    return res.status(200).json({
      mensagem: "Medicamento atualizado com sucesso",
      medicamento: result.rows[0]
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ mensagem: "Erro ao atualizar medicamento" });
  }
}

async function deletarMedicamento(req, res) {
  const { id } = req.params;
  const usuarioId = req.usuarioLogado.id;

  try {
    const result = await pool.query("DELETE FROM medicamentos WHERE id = $1 AND usuario_id = $2 RETURNING *", [id, usuarioId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ mensagem: "Medicamento não encontrado ou acesso não autorizado" });
    }

    return res.status(200).json({ mensagem: "Medicamento removido com sucesso" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ mensagem: "Erro ao deletar medicamento" });
  }
}

module.exports = {
  listarMedicamentos,
  buscarMedicamento,
  cadastrarMedicamento,
  atualizarMedicamento,
  deletarMedicamento
};