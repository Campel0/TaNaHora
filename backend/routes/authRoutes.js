const express = require("express");
const router = express.Router();

const { login } = require("../controllers/authController");

router.get("/login", (req, res) => {
  res.send("Rota de login ativa. Use POST para autenticar.");
});

router.post("/login", login);

module.exports = router;