Cypress.Commands.add('fillMandatoryFieldsAndSubmit', function (){
    cy.get('#firstName').type('willian ', {delay:0});
    cy.get('#lastName').type(' goncalves rios');
    cy.get('#email').type('williangrios@yahoo.com.br');
    cy.get('#open-text-area').type('observações gerais', {delay:200});
    cy.contains('button', 'Enviar').click();
})