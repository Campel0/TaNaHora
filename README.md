# ⏰ TaNaHora - Sistema de Gerenciamento de Medicamentos

O **TaNaHora** é uma aplicação completa (Fullstack) projetada para auxiliar pacientes no controle diário de seus medicamentos, evitando esquecimentos e promovendo uma adesão rigorosa ao tratamento de saúde. 

A interface do usuário é construída com um design moderno e elegante baseado em **Glassmorphism** (efeito de vidro com desfoque de fundo), transições fluidas e um sistema de notificações dinâmico e não-bloqueante (Toasts).

---

## 🚀 Funcionalidades Principais

*   **🔐 Autenticação Segura:**
    *   Cadastro de novos usuários.
    *   Login autenticado com geração de Token JWT (JSON Web Token) válido por 2 horas.
    *   Criptografia de senhas no backend usando hashing seguro.
    *   Fluxo de recuperação de senha com mock de e-mail integrado.
*   **💊 CRUD de Medicamentos:**
    *   Cadastro de medicamentos definindo Nome, Dosagem (ex: 500mg), Intervalo (ex: 8h) e Horário de Início da primeira dose.
    *   Edição interativa através de um modal moderno sobreposto.
    *   Exclusão definitiva de medicamentos.
*   **⏰ Quadro de Avisos:**
    *   Quadro de notificações que informa dinamicamente as próximas doses baseando-se apenas nos medicamentos ativos da própria conta do usuário.
    *   Ações para marcar uma dose como **Tomada** ou **Pulada**.
*   **📜 Histórico de Administração:**
    *   Painel que registra a data, hora, nome do remédio e o status da dose (Tomado ou Pulado) para acompanhamento médico posterior.

---

## 🛡️ Arquitetura e Segurança (Backend)

O backend do sistema foi desenvolvido seguindo as melhores práticas modernas em Node.js e segurança:

1.  **Persistência de Dados (JSON Database):** 
    Os dados do sistema são salvos de forma persistente em disco na pasta `backend/data/` em arquivos JSON físicos (`usuarios.json`, `medicamentos.json` e `historico.json`). A leitura e gravação ocorrem de forma síncrona através de um helper seguro que garante a consistência das escritas.
2.  **Segurança de Senhas (Bcryptjs):**
    As senhas dos usuários nunca são guardadas em texto puro. No momento do cadastro, o backend gera um hash criptográfico irreversível (com complexidade de 10 salt rounds) usando a biblioteca `bcryptjs`. No login, a verificação compara os hashes de forma assíncrona.
3.  **Segregação Multiusuário (Multi-tenant):**
    Todas as ações de criação, leitura, atualização e exclusão (CRUD) de medicamentos, históricos e notificações são protegidas por um middleware de autenticação JWT. O backend filtra os dados comparando e validando as requisições com o ID contido nas informações seguras do Token (`req.usuarioLogado.id`), impossibilitando que um usuário acesse ou altere os dados de outro.

---

## 📁 Estrutura de Diretórios

O projeto está dividido em duas partes fundamentais:

```text
TaNaHora/
├── backend/
│   ├── controllers/      # Lógica de controle das requisições (Auth, Medicamentos, Histórico, etc.)
│   ├── data/             # Armazenamento em arquivos JSON e auxiliares de escrita
│   ├── middlewares/      # Interceptador JWT (proteção de rotas)
│   ├── routes/           # Mapeamento de endpoints da API
│   ├── server.js         # Arquivo de inicialização do servidor Express
│   └── package.json      # Dependências do backend (express, cors, jsonwebtoken, bcryptjs)
└── frontend/
    ├── css/
    │   └── style.css     # Estilização completa do layout Glassmorphism e Toasts animados
    ├── js/
    │   ├── api.js        # Wrapper fetchAutenticado e função global mostrarToast()
    │   ├── auth.js       # Controle de Login
    │   ├── medicamento.js# Manipulação da tela de Remédios (Cadastro, Edição, Deleção)
    │   ├── notificacao.js# Confirmação de status (Tomado/Pular)
    │   └── recuperar.js  # Solicitação de e-mail de recuperação
    ├── index.html        # Página de Login
    ├── cadastro.html     # Página de Cadastro de Usuário
    ├── medicamentos.html # Página de Painel Geral (CRUD)
    ├── notificacoes.html # Página de Avisos/Alarmes
    ├── historico.html    # Página de Logs/Histórico
    └── recuperar-senha.html # Página de Recuperação de Senha
```

---

## 🛠️ Tecnologias Utilizadas

*   **Backend:** Node.js, Express.js, CORS, JSON Web Token (JWT), Bcryptjs.
*   **Frontend:** HTML5 semântico, CSS3 Vanilla (Design responsivo, Animações `@keyframes`, Glassmorphism, Variáveis CSS, Toasts personalizados), Vanilla Javascript Moderno (ES6+, Fetch API assíncrona com `async/await`, manipulação de DOM).

---

## 🚀 Como Executar o Projeto Localmente

### 1. Inicializar o Backend

Entre na pasta do backend, instale as dependências e inicie o servidor:

```bash
cd backend
npm install
node server.js
```

O servidor da API estará rodando por padrão em: `http://localhost:3000`.

*Nota para usuários Windows:* Caso encontre problemas de Execution Policy ao rodar comandos npm no PowerShell, você pode executar a instalação e o início pelo CMD tradicional:
```cmd
cmd.exe /c "npm install"
node server.js
```

### 2. Abrir o Frontend

Como o frontend utiliza HTML, CSS e JS nativos do navegador, não há necessidade de compiladores ou pacotes adicionais. 
Basta abrir o arquivo principal **`frontend/index.html`** no seu navegador de preferência (Google Chrome, Microsoft Edge, Firefox, etc.) para começar a utilizar a plataforma.

