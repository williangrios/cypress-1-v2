/// <reference types="Cypress" />

describe("Central de atendimento ao cliente", function () {

  beforeEach(function() {
    cy.visit("./src/index.html");
  });

  it("Verifica o título da aplicação", function () {
    cy.title().should("be.equal", "Central de Atendimento ao Cliente TAT");
  });

  const TIME_4_SECONDS = 4000;
  it('Preenche os campos obrigatórios e envia o formulário', function() {
    //congelando o relogio do navegador
    cy.clock()
    cy.get('#firstName').type('willian ', {delay:0});
    cy.get('#lastName').type(' goncalves rios');
    cy.get('#email').type('williangrios@yahoo.com.br');
    cy.get('#open-text-area').type('observações gerais');
    cy.contains('button', 'Enviar').click();
    cy.get('.success').should('be.visible');
    //avançando 4 segundos
    cy.tick(TIME_4_SECONDS)
    cy.get('.success').should('not.be.visible');
  })

  it ('Exibe mensagem de erro ao submeter o form com um email com formatação inválida', function(){
    cy.get('#firstName').type('willian ', {delay:0});
    cy.get('#lastName').type(' goncalves rios');
    cy.get('#email').type('williangrios@yahoo,com.br');
    cy.get('#open-text-area').type('observações gerais');
    cy.contains('button', 'Enviar').click();
    cy.get('.error').should('be.visible');
  })

  it('Campo telefone continua vazio se digitar valor não numérico', function(){
    cy.get('#phone').type('abdfgadfgc').should('have.value', '');
  })

  it('Exige que o telefone seja preenchido caso checkbox esteja marcado', function(){
    cy.get('#firstName').type('willian ', {delay:0});
    cy.get('#lastName').type(' goncalves rios');
    cy.get('#phone-checkbox').check()
    cy.get('#email').type('williangrios@yahoo.com.br');
    cy.get('#open-text-area').type('observações gerais');

    cy.contains('button', 'Enviar').click();
    cy.get('.error').should('be.visible');
  })

  it('Preenche e limpa os campos após enviar', function(){
    cy.get('#firstName').type('willian').should('have.value', 'willian').clear().should('have.value', '');
    cy.get('#lastName').type('rios').should('have.value', 'rios').clear().should('have.value', '')
    cy.get('#email').type('email').should('have.value', 'email').clear().should('have.value', '');
  })

  it('Não permite enviar sem preencher os campos', function(){
    cy.contains('button', 'Enviar').click();
    cy.get('.error').should('be.visible');
  })

  it('Não permite enviar sem preencher os campos', function(){
    cy.contains('button', 'Enviar').click();
    cy.get('.error').should('be.visible');
  })

  it('Envia form usando comando customizado', function() {
    cy.fillMandatoryFieldsAndSubmit();
  })

  it ('Seleciona produto youtube pelo rótulo/texto', function(){
    cy.get('#product').select('YouTube').should('have.value', 'youtube');
  })

  it('Seleciona opção Mentoria mas agora por seu valor', function(){
    cy.get('#product').select('mentoria').should('have.value', 'mentoria');
  })

  it ('Selecionando o Blog pelo indice', function (){
    cy.get('#product').select(1).should('have.value', 'blog');
  })

  it ('Marca o tipo de atendimento feedback', function (){
    cy.get('input[type="radio"][value="feedback"]').check().should('have.value', 'feedback')
  })

  it('Marca cada um dos tipos de atendimento', function() {
    cy.get('input[type="radio"]') //conferindo se selecionei o radiobutton que tem apenas 3 opções
      .should('have.length', 3)
      .each(function ($radio){ //o each recebe uma função de callback que pega cada um dos elementos do array
        cy.wrap($radio).check() //marco cada um dos elementos (um por vez)
        cy.wrap($radio).should('be.checked') //checo se está marcado
      })
  })

  it('Marca ambos os checkboxes e depois desmarca o ultimo', function (){
    cy.get('input[type="checkbox"]').check() //aqui vai marcar todos os checkboxes
      .should('be.checked') //verificando se todos estao marcados
      .last() //aqui vai pegar o ultimo
      .uncheck() //desmarcando apenas o ultimo
      .should('not.be.checked') //conferindo se não está checado
  })

  it('seleciona arquivo da pasta fixture', function(){
    cy.get('input[type="file"]#file-upload')
    .should('not.have.value')
    .selectFile('./cypress/fixtures/example.json') //aqui o caminho relativo é sempre considerando o arquivo cypress.json
    .should(function($input){
      expect($input[0].files[0].name).to.equal('example.json')
    })
  })

  it('seleciona arquivo simulando drag and drop', function(){
    cy.get('input[type="file"]#file-upload')
    .should('not.have.value')
    .selectFile('./cypress/fixtures/example.json', {action: 'drag-drop'}) 
    .should(function($input){
      expect($input[0].files[0].name).to.equal('example.json')
    })
  })

  it('seleciona arquivo para a qual foi dado um alias', function(){
    cy.fixture('example.json').as('sampleFile')
    cy.get('#file-upload')
    .selectFile('@sampleFile') 
    .should(function($input){
      expect($input[0].files[0].name).to.equal('example.json')
    })
  })

  it('Verifica que a politica de privacidade abra em outra aba sem necessidade de um clique', function(){
    cy.get('#privacy a').should('have.attr', 'target', '_blank')
  })

  it('Acessa a página de política de privacidade removendo o target e então clicando no link', function(){
    cy.get('#privacy a').invoke('removeAttr', 'target').click()
    cy.contains('Talking About Testing').should('be.visible')
  })

  it('Exibe e esconde as mensagens de sucesso e erro usando o invoke', function (){
    cy.get('.success')
      .should('not.be.visible')
      .invoke('show')
      .should('be.visible')
      .and('contain', "Mensagem enviada com sucesso.")
      .invoke('hide')
      .should('not.be.visible')
  })

  it ('preenche campo de texto usando o invoke', function () {
    const longText = Cypress._.repeat( '0123456789', 200)
    cy.get('#open-text-area')
    .invoke('val', longText)
    .should('have.value', longText)
  })

  it('faz uma requisição http', function (){
    cy.request('https://cac-tat.s3.eu-central-1.amazonaws.com/index.html')
      .should(function(response) {
        const {status, statusText, body} = response;
        expect(status).to.equal(200)
        expect(statusText).to.equal('OK')
        expect(body).to.include('CAC TAT')
      })
  })

  it.only('encontra o gato escondido', function (){
    cy.get('#cat')
      .should('not.be.visible')
      .invoke('show')
      .should('be.visible')
  })

});
