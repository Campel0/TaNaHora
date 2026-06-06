*** Settings ***
Documentation    CT-MAT-01 - Validação da exibição do aviso de medicamento no horário configurado.
Library          SeleniumLibrary

Test Teardown    Fechar navegador


*** Variables ***
${URL_LOGIN}             http://127.0.0.1:8080/index.html
${URL_MEDICAMENTOS}      http://127.0.0.1:8080/medicamentos.html
${URL_NOTIFICACOES}      http://127.0.0.1:8080/notificacoes.html
${BROWSER}               chrome

${EMAIL}                 matheus@email.com
${SENHA}                 396285a

${INPUT_EMAIL}           id=email
${INPUT_SENHA}           id=senha
${BOTAO_ENTRAR}          xpath=//button[contains(., "Entrar")]

${INPUT_NOME}            id=nome
${INPUT_DOSAGEM}         id=dosagem
${INPUT_INTERVALO}       id=intervalo
${INPUT_HORA_INICIO}     id=horaInicio
${BOTAO_CADASTRAR}       xpath=//button[@onclick='cadastrarMedicamento()']

${LISTA_NOTIFICACOES}    id=listaNotificacoes

${BOTAO_TOMADO}          xpath=//button[contains(@onclick, "registrarStatus") and contains(@onclick, "Tomado")]
${BOTAO_PULAR}           xpath=//button[contains(@onclick, "registrarStatus") and contains(@onclick, "Pular")]

${NOME_MEDICAMENTO}      medicamento
${DOSAGEM}               500mg
${INTERVALO}             8h


*** Test Cases ***
CT-MAT-01 - Aviso nao deve aparecer antes do horario configurado
    [Documentation]    Valida se um medicamento cadastrado com horário futuro aparece indevidamente na tela de avisos antes do horário.
    Dado que o usuário está autenticado
    E cadastra um medicamento com horário futuro
    Quando acessar a tela de notificações antes do horário configurado
    Então o aviso do medicamento não deve aparecer antes do horário

CT-MAT-01B - Aviso deve sair apos selecionar Tomado
    [Documentation]    Valida se o aviso deixa de aparecer após o usuário registrar o medicamento como Tomado.
    Dado que o usuário está autenticado
    E cadastra um medicamento com horário futuro
    Quando acessar a tela de notificações
    E selecionar a opção Tomado
    Então o aviso do medicamento deve deixar de aparecer


*** Keywords ***
Dado que o usuário está autenticado
    Open Browser    ${URL_LOGIN}    ${BROWSER}
    Maximize Browser Window
    Wait Until Element Is Visible    ${INPUT_EMAIL}    10s
    Input Text        ${INPUT_EMAIL}    ${EMAIL}
    Input Password    ${INPUT_SENHA}    ${SENHA}
    Click Button      ${BOTAO_ENTRAR}
    Sleep             2s

E cadastra um medicamento com horário futuro
    ${hora_futura}=    Gerar horario futuro
    Set Test Variable    ${HORARIO_FUTURO}    ${hora_futura}

    Go To    ${URL_MEDICAMENTOS}
    Wait Until Element Is Visible    ${INPUT_NOME}    10s

    Clear Element Text    ${INPUT_NOME}
    Input Text           ${INPUT_NOME}           ${NOME_MEDICAMENTO}

    Clear Element Text    ${INPUT_DOSAGEM}
    Input Text           ${INPUT_DOSAGEM}        ${DOSAGEM}

    Clear Element Text    ${INPUT_INTERVALO}
    Input Text           ${INPUT_INTERVALO}      ${INTERVALO}

    Clear Element Text    ${INPUT_HORA_INICIO}
    Input Text           ${INPUT_HORA_INICIO}    ${HORARIO_FUTURO}

    Click Button    ${BOTAO_CADASTRAR}
    Sleep           2s

Quando acessar a tela de notificações antes do horário configurado
    Go To    ${URL_NOTIFICACOES}
    Wait Until Element Is Visible    ${LISTA_NOTIFICACOES}    10s
    Sleep    2s

Quando acessar a tela de notificações
    Go To    ${URL_NOTIFICACOES}
    Wait Until Element Is Visible    ${LISTA_NOTIFICACOES}    10s
    Sleep    2s

Então o aviso do medicamento não deve aparecer antes do horário
    Element Should Not Contain    ${LISTA_NOTIFICACOES}    ${NOME_MEDICAMENTO}

E selecionar a opção Tomado
    Wait Until Element Is Visible    ${BOTAO_TOMADO}    10s
    Click Button    ${BOTAO_TOMADO}
    Sleep    2s

Então o aviso do medicamento deve deixar de aparecer
    Reload Page
    Wait Until Element Is Visible    ${LISTA_NOTIFICACOES}    10s
    Sleep    2s
    Element Should Not Contain    ${LISTA_NOTIFICACOES}    ${NOME_MEDICAMENTO}

Gerar horario futuro
    ${agora}=     Get Time    epoch
    ${futuro}=    Evaluate    int(${agora}) + 600
    ${hora}=      Evaluate    __import__('datetime').datetime.fromtimestamp(${futuro}).strftime('%H:%M')
    RETURN        ${hora}

Fechar navegador
    Close All Browsers