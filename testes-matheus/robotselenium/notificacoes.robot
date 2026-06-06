*** Settings ***
Library    SeleniumLibrary

Test Teardown    E fecha o navegador

*** Variables ***
${URL_LOGIN}             http://127.0.0.1:8080/index.html
${URL_NOTIFICACOES}      http://127.0.0.1:8080/notificacoes.html
${BROWSER}               chrome

${INPUT_EMAIL}           id=email
${INPUT_SENHA}           id=senha
${BOTAO_ENTRAR}          xpath=//button[contains(., "Entrar")]

${LISTA_NOTIFICACOES}    id=listaNotificacoes

${BOTAO_TOMADO}          xpath=//button[contains(@onclick, "registrarStatus") and contains(@onclick, "'16'") and contains(@onclick, "Tomado")]
${BOTAO_PULAR}           xpath=//button[contains(@onclick, "registrarStatus") and contains(@onclick, "'16'") and contains(@onclick, "Pular")]

${MENSAGEM_STATUS}       xpath=(.//*[normalize-space(text()) and normalize-space(.)='✅'])[1]/following::span[1]

${EMAIL_COM_MEDICAMENTO}       matheus@email.com
${SENHA_COM_MEDICAMENTO}       396285a

${EMAIL_SEM_MEDICAMENTO}       usuariosh@email.com
${SENHA_SEM_MEDICAMENTO}       123456


*** Test Cases ***
CT01 - Deve registrar medicamento como Tomado pela tela de notificações
    Dado que o usuário está autenticado com medicamento cadastrado
    E acessa a tela de notificações
    Quando selecionar a opção Tomado
    Então o sistema deve apresentar mensagem de status registrado com sucesso

CT02 - Deve registrar medicamento como Pular pela tela de notificações
    Dado que o usuário está autenticado com medicamento cadastrado
    E acessa a tela de notificações
    Quando selecionar a opção Pular
    Então o sistema deve apresentar mensagem de status registrado com sucesso

CT03 - Deve informar quando não houver medicamento cadastrado
    Dado que o usuário está autenticado sem medicamento cadastrado
    E acessa a tela de notificações
    Então o sistema deve apresentar mensagem de nenhum medicamento cadastrado

CT04 - Deve bloquear acesso sem autenticação
    Dado que o usuário não está autenticado
    Quando acessar diretamente a tela de notificações
    Então o sistema deve redirecionar para a tela de login


*** Keywords ***
Dado que o usuário está autenticado com medicamento cadastrado
    Open Browser    ${URL_LOGIN}    ${BROWSER}
    Maximize Browser Window
    Wait Until Element Is Visible    ${INPUT_EMAIL}    10s
    Input Text        ${INPUT_EMAIL}    ${EMAIL_COM_MEDICAMENTO}
    Input Password    ${INPUT_SENHA}    ${SENHA_COM_MEDICAMENTO}
    Click Button      ${BOTAO_ENTRAR}
    Sleep    2s

Dado que o usuário está autenticado sem medicamento cadastrado
    Open Browser    ${URL_LOGIN}    ${BROWSER}
    Maximize Browser Window
    Wait Until Element Is Visible    ${INPUT_EMAIL}    10s
    Input Text        ${INPUT_EMAIL}    ${EMAIL_SEM_MEDICAMENTO}
    Input Password    ${INPUT_SENHA}    ${SENHA_SEM_MEDICAMENTO}
    Click Button      ${BOTAO_ENTRAR}
    Sleep    2s

E acessa a tela de notificações
    Go To    ${URL_NOTIFICACOES}
    Wait Until Element Is Visible    ${LISTA_NOTIFICACOES}    10s
    Sleep    1s

Quando selecionar a opção Tomado
    Wait Until Element Is Visible    ${BOTAO_TOMADO}    10s
    Click Button    ${BOTAO_TOMADO}

Quando selecionar a opção Pular
    Wait Until Element Is Visible    ${BOTAO_PULAR}    10s
    Click Button    ${BOTAO_PULAR}

Então o sistema deve apresentar mensagem de status registrado com sucesso
    Wait Until Element Is Visible    ${MENSAGEM_STATUS}    10s
    Element Should Contain    ${MENSAGEM_STATUS}    Status registrado com sucesso

Então o sistema deve apresentar mensagem de nenhum medicamento cadastrado
    Wait Until Page Contains    Nenhum medicamento cadastrado    10s

Dado que o usuário não está autenticado
    Open Browser    ${URL_NOTIFICACOES}    ${BROWSER}
    Maximize Browser Window
    Execute Javascript    localStorage.removeItem("token"); localStorage.removeItem("usuario"); localStorage.removeItem("token_tanahora"); localStorage.removeItem("usuario_tanahora");
    Reload Page
    Sleep    1s

Quando acessar diretamente a tela de notificações
    Go To    ${URL_NOTIFICACOES}
    Sleep    2s

Então o sistema deve redirecionar para a tela de login
    Location Should Contain    index.html

E fecha o navegador
    Close All Browsers