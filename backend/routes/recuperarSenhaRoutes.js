const express = require("express");
const router = express.Router();

const {
  recuperarSenha
} = require("../controllers/recuperarSenhaController");

router.post("/recuperar-senha", recuperarSenha);

module.exports = router;