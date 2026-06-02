*** Settings ***
Library    SeleniumLibrary

Suite Setup       Open Browser    ${URL}    ${BROWSER}
Suite Teardown    SeleniumLibrary.Close Browser
Test Setup        Navegar para a tela de login

*** Variables ***
${URL}                 http://localhost:3001/index.html
${BROWSER}             chrome

${EL_EMAIL}            id=email
${EL_SENHA}            id=senha
${EL_BOTAO}            xpath=//button[contains(text(),'Entrar')]
${EL_MENSAGEM}         id=mensagem

*** Test Cases ***
CT01 - Deve realizar login com credenciais validas
    Dado que o usuario informa o email    usuario_cadastrado@email.com
    E informa a senha    senha_correta
    Quando solicitar o login sem aguardar
    Entao o sistema deve redirecionar para    medicamentos.html

CT02 - Deve validar email vazio
    Dado que o usuario informa o email    ${EMPTY}
    E informa a senha    12345678
    Quando solicitar o login
    Entao o sistema deve apresentar a mensagem    E-mail e senha são obrigatórios

CT03 - Deve validar senha vazia
    Dado que o usuario informa o email    usuario@email.com
    E informa a senha    ${EMPTY}
    Quando solicitar o login
    Entao o sistema deve apresentar a mensagem    E-mail e senha são obrigatórios

CT04 - Deve validar credenciais invalidas
    Dado que o usuario informa o email    usuario@email.com
    E informa a senha    senha_errada
    Quando solicitar o login
    Entao o sistema deve apresentar a mensagem    Usuário ou senha inválidos

*** Keywords ***
Navegar para a tela de login
    Go To    ${URL}
    Maximize Browser Window
    Wait Until Element Is Visible    ${EL_EMAIL}    timeout=10s

Dado que o usuario informa o email
    [Arguments]    ${valor}=${EMPTY}
    Clear Element Text    ${EL_EMAIL}
    Run Keyword If    '${valor}' != '${EMPTY}'    Input Text    ${EL_EMAIL}    ${valor}

E informa a senha
    [Arguments]    ${valor}=${EMPTY}
    Clear Element Text    ${EL_SENHA}
    Run Keyword If    '${valor}' != '${EMPTY}'    Input Password    ${EL_SENHA}    ${valor}

Quando solicitar o login
    Click Element    ${EL_BOTAO}
    Sleep    2s

Quando solicitar o login sem aguardar
    Click Element    ${EL_BOTAO}

Entao o sistema deve apresentar a mensagem
    [Arguments]    ${texto_esperado}
    Wait Until Element Contains    ${EL_MENSAGEM}    ${texto_esperado}    timeout=7s

Entao o sistema deve redirecionar para
    [Arguments]    ${pagina}
    Wait Until Location Contains    ${pagina}    timeout=10s
