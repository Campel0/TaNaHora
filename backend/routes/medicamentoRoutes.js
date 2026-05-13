const express = require("express");
const router = express.Router();

const {
  listarMedicamentos,
  buscarMedicamento,
  cadastrarMedicamento,
  atualizarMedicamento,
  deletarMedicamento
} = require("../controllers/medicamentoController");

router.get("/", listarMedicamentos);
router.get("/:id", buscarMedicamento);
router.post("/", cadastrarMedicamento);
router.put("/:id", atualizarMedicamento);
router.delete("/:id", deletarMedicamento);

module.exports = router;