*** Settings ***
Library    SeleniumLibrary

Suite Setup       Open Browser    ${URL}    ${BROWSER}
Suite Teardown    SeleniumLibrary.Close Browser
Test Setup        Navegar para a tela de recuperar senha

*** Variables ***
${URL}                 http://localhost:3001/recuperar-senha.html
${BROWSER}             chrome

${EL_EMAIL}            id=email
${EL_BOTAO}            xpath=//button[contains(text(),'Enviar Link')]
${EL_MENSAGEM}         id=mensagem

*** Test Cases ***
CT01 - Deve validar email vazio
    Dado que o usuario informa o email    ${EMPTY}
    Quando solicitar a recuperacao
    Entao o sistema deve apresentar a mensagem    Digite o e-mail

CT02 - Deve validar email nao cadastrado
    Dado que o usuario informa o email    naoexiste@email.com
    Quando solicitar a recuperacao
    Entao o sistema deve apresentar a mensagem    E-mail não encontrado

CT03 - Deve enviar link para email cadastrado
    Dado que o usuario informa o email    usuario_cadastrado@email.com
    Quando solicitar a recuperacao
    Entao o sistema deve apresentar a mensagem    Link enviado para o e-mail

*** Keywords ***
Navegar para a tela de recuperar senha
    Go To    ${URL}
    Maximize Browser Window
    Wait Until Element Is Visible    ${EL_EMAIL}    timeout=10s

Dado que o usuario informa o email
    [Arguments]    ${valor}=${EMPTY}
    Clear Element Text    ${EL_EMAIL}
    Run Keyword If    '${valor}' != '${EMPTY}'    Input Text    ${EL_EMAIL}    ${valor}

Quando solicitar a recuperacao
    Click Element    ${EL_BOTAO}
    Sleep    2s

Entao o sistema deve apresentar a mensagem
    [Arguments]    ${texto_esperado}
    Wait Until Element Contains    ${EL_MENSAGEM}    ${texto_esperado}    timeout=7s
