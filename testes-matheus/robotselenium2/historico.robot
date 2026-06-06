*** Settings ***
Library    SeleniumLibrary

Test Teardown    E fecha o navegador

*** Variables ***
${URL_LOGIN}          http://127.0.0.1:8080/index.html
${URL_HISTORICO}      http://127.0.0.1:8080/historico.html
${BROWSER}            chrome

${INPUT_EMAIL}        id=email
${INPUT_SENHA}        id=senha
${BOTAO_ENTRAR}       xpath=//button[contains(., "Entrar")]

${LISTA_HISTORICO}    id=lista
${ITEM_HISTORICO}     xpath=//ul[@id='lista']/li

${EMAIL_COM_HISTORICO}       matheus@email.com
${SENHA_COM_HISTORICO}       396285a

${EMAIL_SEM_HISTORICO}       usuariosh@email.com
${SENHA_SEM_HISTORICO}       123456


*** Test Cases ***
CT01 - Deve exibir pelo menos um item no histórico
    Dado que o usuário está autenticado com histórico existente
    Quando acessar a tela de histórico
    Então o sistema deve exibir pelo menos um item no histórico

CT02 - Deve validar ausência de itens no histórico
    Dado que o usuário está autenticado sem histórico existente
    Quando acessar a tela de histórico
    Então o sistema não deve exibir itens de histórico

CT03 - Deve bloquear acesso ao histórico sem autenticação
    Dado que o usuário não está autenticado
    Quando acessar diretamente a tela de histórico
    Então o sistema deve redirecionar para a tela de login


*** Keywords ***
Dado que o usuário está autenticado com histórico existente
    Open Browser    ${URL_LOGIN}    ${BROWSER}
    Maximize Browser Window
    Wait Until Element Is Visible    ${INPUT_EMAIL}    10s
    Input Text        ${INPUT_EMAIL}    ${EMAIL_COM_HISTORICO}
    Input Password    ${INPUT_SENHA}    ${SENHA_COM_HISTORICO}
    Click Button      ${BOTAO_ENTRAR}
    Sleep    2s

Dado que o usuário está autenticado sem histórico existente
    Open Browser    ${URL_LOGIN}    ${BROWSER}
    Maximize Browser Window
    Wait Until Element Is Visible    ${INPUT_EMAIL}    10s
    Input Text        ${INPUT_EMAIL}    ${EMAIL_SEM_HISTORICO}
    Input Password    ${INPUT_SENHA}    ${SENHA_SEM_HISTORICO}
    Click Button      ${BOTAO_ENTRAR}
    Sleep    2s

Quando acessar a tela de histórico
    Go To    ${URL_HISTORICO}
    Wait Until Element Is Visible    ${LISTA_HISTORICO}    10s
    Sleep    1s

Então o sistema deve exibir pelo menos um item no histórico
    Wait Until Element Is Visible    ${ITEM_HISTORICO}    10s
    Page Should Contain Element    ${ITEM_HISTORICO}

Então o sistema não deve exibir itens de histórico
    Wait Until Element Is Visible    ${LISTA_HISTORICO}    10s
    Page Should Not Contain Element    ${ITEM_HISTORICO}

Dado que o usuário não está autenticado
    Open Browser    ${URL_HISTORICO}    ${BROWSER}
    Maximize Browser Window
    Execute Javascript    localStorage.removeItem("token"); localStorage.removeItem("usuario"); localStorage.removeItem("token_tanahora"); localStorage.removeItem("usuario_tanahora");
    Reload Page
    Sleep    1s

Quando acessar diretamente a tela de histórico
    Go To    ${URL_HISTORICO}
    Sleep    2s

Então o sistema deve redirecionar para a tela de login
    Location Should Contain    index.html

E fecha o navegador
    Close All Browsers