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

  const historico = historicoDb.get();

  const notificacoes = medicamentos.map(medicamento => {
    // Busca o histórico de tomadas desse medicamento, ordenando do mais recente para o mais antigo
    const historicoMedicamento = historico
      .filter(h => h.medicamentoId == medicamento.id && h.status === "Tomado")
      .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

    let ultimaDoseStr = "Ainda não tomado";
    let proximaDoseStr = "Tomar agora";

    if (historicoMedicamento.length > 0) {
      const ultimaDose = historicoMedicamento[0];
      ultimaDoseStr = `${ultimaDose.data} às ${ultimaDose.hora}`;
      
      if (ultimaDose.timestamp && medicamento.intervalo) {
         const proximaDoseTimestamp = ultimaDose.timestamp + (medicamento.intervalo * 60 * 60 * 1000);
         const proximaDoseData = new Date(proximaDoseTimestamp);
         proximaDoseStr = `${proximaDoseData.toLocaleDateString()} às ${proximaDoseData.toLocaleTimeString()}`;
      }
    }

    return {
      medicamentoId: medicamento.id,
      mensagem: `Tomar ${medicamento.nome} - ${medicamento.dosagem}`,
      horarios: medicamento.horarios,
      ultimaDose: ultimaDoseStr,
      proximaDose: proximaDoseStr
    };
  });

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
    timestamp: Date.now(),
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