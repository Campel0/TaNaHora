const express = require("express");
const router = express.Router();

const {
  listarNotificacoes,
  registrarStatus
} = require("../controllers/notificacaoController");

router.get("/", listarNotificacoes);
router.post("/", registrarStatus);
router.post("/status", registrarStatus);

module.exports = router;