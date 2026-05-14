const express = require("express");
const cors = require("cors");

const app = express();

const usuarioRoutes = require("./routes/usuarioRoutes");
const medicamentoRoutes = require("./routes/medicamentoRoutes");
const notificacaoRoutes = require("./routes/notificacaoRoutes");
const historicoRoutes = require("./routes/historicoRoutes");
const authRoutes = require("./routes/authRoutes");
const recuperarSenhaRoutes = require("./routes/recuperarSenhaRoutes");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    mensagem: "API TaNaHora funcionando"
  });
});

app.use("/usuarios", usuarioRoutes); // Cadastro de usuário deve ser público
// Importamos o middleware de autenticação
const { authMiddleware } = require("./middlewares/authMiddleware");

// As rotas abaixo passam a exigir um Token válido para serem acessadas
app.use("/medicamentos", authMiddleware, medicamentoRoutes);
app.use("/notificacoes", authMiddleware, notificacaoRoutes);
app.use("/historico", authMiddleware, historicoRoutes);

app.use("/", authRoutes);
app.use("/", recuperarSenhaRoutes);

app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});