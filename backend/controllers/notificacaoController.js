const medicamentos = require("../data/medicamentos");
const historico = require("../data/historico");
// Importamos a função salvarDados do dbHelper para gravar as alterações em disco
const { salvarDados } = require("../data/dbHelper");

/**
 * Retorna as notificações de medicamentos pendentes apenas do usuário logado.
 */
function listarNotificacoes(req, res) {
  const usuarioId = req.usuarioLogado.id;

  // Filtramos apenas os medicamentos pertencentes ao usuário logado
  const meusMedicamentos = medicamentos.filter(
    m => m.usuarioId === usuarioId
  );

  if (meusMedicamentos.length === 0) {
    return res.status(404).json({
      mensagem: "Nenhum medicamento cadastrado"
    });
  }

  // Mapeamos a lista de notificações com base apenas nos remédios do próprio usuário
  const notificacoes = meusMedicamentos.map(medicamento => ({
    medicamentoId: medicamento.id,
    mensagem: `Tomar ${medicamento.nome} - ${medicamento.dosagem}`,
    horarios: medicamento.horarios
  }));

  return res.status(200).json(notificacoes);
}

/**
 * Registra se o usuário logado tomou ou pulou o seu próprio remédio.
 */
function registrarStatus(req, res) {
  const { medicamentoId, status } = req.body;
  const usuarioId = req.usuarioLogado.id;

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

  // Buscamos o medicamento garantindo que ele pertence ao usuário que está tentando registrar
  const medicamento = medicamentos.find(
    m => m.id == medicamentoId && m.usuarioId === usuarioId
  );

  if (!medicamento) {
    return res.status(404).json({
      mensagem: "Medicamento não encontrado ou acesso não autorizado"
    });
  }

  // Criamos o registro de histórico incluindo o 'usuarioId' para segregação futura
  const registro = {
    id: historico.length + 1,
    usuarioId, // Vincula o registro do histórico ao usuário que realizou a ação
    medicamentoId,
    medicamento: medicamento.nome,
    data: new Date().toLocaleDateString(),
    hora: new Date().toLocaleTimeString(),
    status
  };

  // Adicionamos o registro na lista de histórico em memória
  historico.push(registro);

  // Gravamos o histórico atualizado no arquivo 'historico.json' no disco
  salvarDados("historico.json", historico);

  return res.status(200).json({
    mensagem: "Status registrado com sucesso",
    registro
  });
}

module.exports = {
  listarNotificacoes,
  registrarStatus
};
