const express = require("express");
const router = express.Router();

const {
  listarHistorico,
  buscarHistoricoPorMedicamento
} = require("../controllers/historicoController");

router.get("/", listarHistorico);
router.get("/:medicamentoId", buscarHistoricoPorMedicamento);

module.exports = router;