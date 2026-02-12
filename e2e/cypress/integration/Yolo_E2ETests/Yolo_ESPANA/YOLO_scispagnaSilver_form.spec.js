var env = Cypress.env();

describe('T-61 yolospagnagold',()=>{

  let user = ''
  let token = ''

  beforeEach(() => { 
      cy.server()
      localStorage.setItem('token', token) 
      localStorage.setItem('user', user)
  });

  
  it('T-61 Visit', () => {
    cy.visit(env.url + '/login')
    cy.wait(6000) //wait all xhrs on first load
  })

  it('T-61 Sign in', () => {

    cy.route('POST', '/api/legacy/users/sign_in').as('sign_in')

    cy.get('#email').type(Cypress.env('email'))
    cy.get('#password').type(Cypress.env('password'))
    cy.get('#login-btn-test-test').click()

    cy.wait('@sign_in')
      .then((res) => {
          token = res.response.body.token
          user.token = null
          user = JSON.stringify(res.response.body)
      })
  })

  it('T-61 Click Prodotti', ()=>{
    cy.get('#Livello_1').click({force:true});  // vado in prodotti cliccando su Yolo
  })

  it('T-61 Click Sci',()=>{
      cy.get('.slick-current > :nth-child(1) > .slide > .slick-track-product').contains('YOLO ESQUÍ').click({force:true})
      cy.url().should('include', env.url + '/preventivatore;code=esqui')
  })

  it('T-61 Click Silver', ()=>{
      cy.get('.nav > :nth-child(2) > .nav-link').click({force:true})
  })

  it('T-61 Wording Sci Silver',()=>{
      cy.get('#esqui-silver').contains('Yolo esquí Silver')
      cy.get('#esqui-silver').contains('Número de personas aseguradas')
      cy.get('#quantity').invoke('val').should('eq','1')
      cy.get('#esqui-silver').contains('1 día')
      cy.get('#esqui-silver').contains('2 días')
      cy.get('#esqui-silver').contains('6 días')
      cy.get('#esqui-silver').contains('Continuar')
      cy.get('#esqui-silver').contains('Descarga el documento de información precontractual')
      cy.get('#esqui-silver').contains('Producto ofrecido en colaboración con')
      cy.get('#esqui-silver').contains('Hasta:')
  })

  it('T-61 Sci Silver Immagini', ()=>{
    cy.get('.fp-image').last().should('be.visible').invoke('attr','src').should('include','sci_silver.png')
    cy.get(' #cardQuotator > .justify-content-center > .text-center > .provider-logo > img').should('be.visible').invoke('attr','src').should('include','logo_erv.png')
  })

  it('T-61 Sci Silver Link',()=>{
      cy.get(' #cardQuotator > :nth-child(2) > .col-12 > .inf-package').last()
      .should('be.visible').invoke('attr','href').should('include','https://yolo-es-integration.s3.amazonaws.com/spree/products/information_packages/000/000/001/original/Conditiones_Generales_e_Particulares_Yolo_Esqui_Silver_29112019.pdf?1575040892')
  })


  it('T-61 Sci Silver Pulsanti1',()=>{
    let base = 4.90
    for(let a=1;a<20;a++){
      console.log(a)
      cy.wait(150)
      cy.get('#esqui-silver > [ng-reflect-ng-switch="quotator_people_variants"] > app-quotator-pepole-variants > #cardQuotator > .card-body > .mb-3 > .col-12 > .ml-0 > .col-md-4 > [data-cy=quotator-people-variants__insureds-number-display]').last().invoke('val').should('eq',String(a))
     
      let moltiplica = (base*(a))
      moltiplica = (moltiplica.toFixed(2)).replace('.',',')
      console.log(moltiplica)
      cy.get(' #esqui-silver > [ng-reflect-ng-switch="quotator_people_variants"] > app-quotator-pepole-variants > #cardQuotator > .card-body > .purchase > :nth-child(1) > :nth-child(2) > .purchase-price').last()
      .should('have.text',moltiplica+' € ')
      cy.get('#cardQuotator > .card-body > .mb-3 > .col-12 > .ml-0 > :nth-child(3)')
     .last().click({force:true})
    }

  })

  it('num Personas goes back to 1', () => {

    cy.get('#esqui-silver > [ng-reflect-ng-switch="quotator_people_variants"] > app-quotator-pepole-variants > #cardQuotator > .card-body > .mb-3 > .col-12 > .ml-0 > .col-md-4 > [data-cy=quotator-people-variants__insureds-number-display]').invoke('val').then((numPersone) => {

      let i = parseInt(numPersone, 10)

      for (i == 1; i--;) {
        cy.get('#esqui-silver > [ng-reflect-ng-switch="quotator_people_variants"] > app-quotator-pepole-variants > #cardQuotator > .card-body > .mb-3 > .col-12 > .ml-0 > [data-cy=quotator-people-variants__subtract-insured-button]')
          .click({ force: true })
      }

    })
  })

  it('T-61 Sci Silver Pulsanti 2',()=>{
    cy.get('#cardQuotator > .card-body > :nth-child(3) > .col-12 > .row > :nth-child(2) > .btn').last().click({force:true})
    let base = 8.73
    for(let a=1;a<20;a++){
      cy.get('#esqui-silver > [ng-reflect-ng-switch="quotator_people_variants"] > app-quotator-pepole-variants > #cardQuotator > .card-body > .mb-3 > .col-12 > .ml-0 > .col-md-4 > [data-cy=quotator-people-variants__insureds-number-display]').last().invoke('val').should('eq',String(a))
      
      
    
      let moltiplica = (base*(a))
     moltiplica = (moltiplica.toFixed(2)).replace('.',',')
      console.log(moltiplica)
      cy.get(' #esqui-silver > [ng-reflect-ng-switch="quotator_people_variants"] > app-quotator-pepole-variants > #cardQuotator > .card-body > .purchase > :nth-child(1) > :nth-child(2) > .purchase-price').last()
      .should('have.text',moltiplica+' € ')

      cy.get('#cardQuotator > .card-body > .mb-3 > .col-12 > .ml-0 > :nth-child(3)')
     .last().click({force:true})

    }

  })

  it('num Personas goes back to 1', () => {

    cy.get('#esqui-silver > [ng-reflect-ng-switch="quotator_people_variants"] > app-quotator-pepole-variants > #cardQuotator > .card-body > .mb-3 > .col-12 > .ml-0 > .col-md-4 > [data-cy=quotator-people-variants__insureds-number-display]').invoke('val').then((numPersone) => {

      let i = parseInt(numPersone, 10)

      for (i == 1; i--;) {
        cy.get('#esqui-silver > [ng-reflect-ng-switch="quotator_people_variants"] > app-quotator-pepole-variants > #cardQuotator > .card-body > .mb-3 > .col-12 > .ml-0 > [data-cy=quotator-people-variants__subtract-insured-button]')
          .click({ force: true })
      }

    })
  })

  it('T-61 Sci Silver Pulsanti 3',()=>{
    cy.get('#cardQuotator > .card-body > :nth-child(3) > .col-12 > .row > :nth-child(3) > .btn').last().click({force:true})
    let base = 26.23
    for(let a=1;a<20;a++){
      cy.get('#esqui-silver > [ng-reflect-ng-switch="quotator_people_variants"] > app-quotator-pepole-variants > #cardQuotator > .card-body > .mb-3 > .col-12 > .ml-0 > .col-md-4 > [data-cy=quotator-people-variants__insureds-number-display]').last().invoke('val').should('eq',String(a))
      let moltiplica = (base*(a))
     moltiplica = (moltiplica.toFixed(2)).replace('.',',')
      console.log(moltiplica)
      cy.get(' #esqui-silver > [ng-reflect-ng-switch="quotator_people_variants"] > app-quotator-pepole-variants > #cardQuotator > .card-body > .purchase > :nth-child(1) > :nth-child(2) > .purchase-price').last()
      .should('have.text',moltiplica+' € ')
      cy.get('#cardQuotator > .card-body > .mb-3 > .col-12 > .ml-0 > :nth-child(3)')
     .last().click({force:true})
    }

  })

  it('T-61 Bottone',()=>{
    cy.get('#esqui-silver > [ng-reflect-ng-switch="quotator_people_variants"] > app-quotator-pepole-variants > #cardQuotator > .card-body > .purchase > .text-sm-right').click({ force : true })
  })





})