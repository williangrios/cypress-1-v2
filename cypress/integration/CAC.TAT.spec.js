/// <reference types="Cypress" />

describe("Central de atendimento ao cliente", function () {

  beforeEach(function() {
    cy.visit("./src/index.html");
  });

  it("Verifica o título da aplicação", function () {
    cy.title().should("be.equal", "Central de Atendimento ao Cliente TAT");
  });

  it('Preenche os campos obrigatórios e envia o formulário', function() {
    cy.get('#firstName').type('willian ', {delay:0});
    cy.get('#lastName').type(' goncalves rios');
    cy.get('#email').type('williangrios@yahoo.com.br');
    cy.get('#open-text-area').type('observações gerais');
    cy.get('button[type="submit"]').click();
    cy.get('.success').should('be.visible');
  })

  it ('Exibe mensagem de erro ao submeter o form com um email com formatação inválida', function(){
    cy.get('#firstName').type('willian ', {delay:0});
    cy.get('#lastName').type(' goncalves rios');
    cy.get('#email').type('williangrios@yahoo.com.br');
    cy.get('#open-text-area').type('observações gerais');
    cy.get('button[type="submit"]').click();
    cy.get('.error').should('be.visible');
  })

  it('Campo telefone continua vazio se digitar valor não numérico', function(){
    cy.get('#phone').type('abdfgadfgc').should('have.value', '');
  })

  it('Exige que o telefone seja preenchido caso checkbox esteja marcado', function(){
    cy.get('#firstName').type('willian ', {delay:0});
    cy.get('#lastName').type(' goncalves rios');
    cy.get('#phone-checkbox').click()
    cy.get('#email').type('williangrios@yahoo.com.br');
    cy.get('#open-text-area').type('observações gerais');

    cy.get('button[type="submit"]').click();
    cy.get('.error').should('be.visible');
  })

  it('Preenche e limpa os campos após enviar', function(){
    cy.get('#firstName').type('willian').should('have.value', 'willian').clear().should('have.value', '');
    cy.get('#lastName').type('rios').should('have.value', 'rios').clear().should('have.value', '')
    cy.get('#email').type('email').should('have.value', 'email').clear().should('have.value', '');
  })

  it('Não permite enviar sem preencher os campos', function(){
    cy.get('button[type="submit"]').click();
    cy.get('.error').should('be.visible');
  })

  it('Não permite enviar sem preencher os campos', function(){
    cy.get('button[type="submit"]').click();
    cy.get('.error').should('be.visible');
  })

  it.only('Envia form usando comando customizado', function() {
    cy.fillMandatoryFieldsAndSubmit();
  })

});
