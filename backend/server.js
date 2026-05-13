const express = require("express");
const app = express();

const usuarioRoutes = require("./routes/usuarioRoutes");

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ mensagem: "API TaNaHora funcionando" });
});

app.use("/usuarios", usuarioRoutes);

app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});