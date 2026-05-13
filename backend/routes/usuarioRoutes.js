const express = require("express");
const router = express.Router();

const {
  listarUsuarios,
  cadastrarUsuario
} = require("../controllers/usuarioController");

router.get("/", listarUsuarios);
router.post("/", cadastrarUsuario);

module.exports = router;