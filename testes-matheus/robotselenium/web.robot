*** Settings ***
Library    SeleniumLibrary

*** Variables ***
${URL}        https://www.google.com/
${BROWSER}    chrome

*** Test Cases ***
Abrir google.com
    Open Browser    ${URL}    ${BROWSER}
    Sleep    2s
    ${title}=    Get Title
    Should Contain    ${title}    Google
    Close Browser