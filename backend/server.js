const express = require("express");
const app = express();

const usuarioRoutes = require("./routes/usuarioRoutes");
const authRoutes = require("./routes/authRoutes");
const recuperarSenhaRoutes = require("./routes/recuperarSenhaRoutes");

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    mensagem: "API TaNaHora funcionando"
  });
});

app.use("/usuarios", usuarioRoutes);
app.use("/", authRoutes);
app.use("/", recuperarSenhaRoutes);

app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});