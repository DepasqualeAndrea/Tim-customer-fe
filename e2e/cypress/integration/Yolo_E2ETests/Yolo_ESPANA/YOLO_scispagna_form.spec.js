var env = Cypress.env();

describe('T-61 yolospagnagold', () => {

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

  it('T-61 Click Prodotti', () => {
    cy.get('#Livello_1').click({ force: true });  // vado in prodotti cliccando su Yolo
  })

  it('T-61 Click Sci', () => {
    cy.get('.slick-current > :nth-child(1) > .slide > .slick-track-product').contains('YOLO ESQUÍ').click({ force: true })
    cy.url().should('include', env.url + '/preventivatore;code=esqui')
  })

  it('T-61 Wording Gold', () => {
    cy.get('.nav > :nth-child(1) > .nav-link').contains('Yolo esquí Gold ')
    cy.get('#esqui-gold').contains('Yolo esquí Gold')
    cy.get('#esqui-gold').contains('Número de personas aseguradas')
    cy.get('#quantity').invoke('val').should('eq', '1')
    cy.get('#esqui-gold').contains('1 día')
    cy.get('#esqui-gold').contains('2 días')
    cy.get('#esqui-gold').contains('6 días')
    cy.get('#esqui-gold').contains('Continuar')
    cy.get('#esqui-gold').contains('Descarga el documento de información precontractual')
    cy.get('#esqui-gold').contains('Producto ofrecido en colaboración con')
    cy.get('#esqui-gold').contains('Hasta:')
  })

  it('T-61 Sci Gold immagini', () => {
    cy.get('[src="https://yolo-es-integration.s3.amazonaws.com/spree/images/attachments/7/original/sci_gold.png?1574267336"]').should('be.visible')
    cy.get('[src="https://yolo-es-integration.s3.amazonaws.com/yolo/providers/images/000/000/004/original/logo_erv.png?1583854223"]').should('be.visible')
  })

  it('T-61 Sci Gold Link', () => {
    cy.get('#cardQuotator > :nth-child(2) > .col-12 > .inf-package').first()
      .should('have.attr', 'href').should('include', 'https://yolo-es-integration.s3.amazonaws.com/spree/products/information_packages/000/000/002/original/Conditiones_Generales_e_Particulares_Yolo_Esqui_Gold_29112019.pdf?1575040886')
  })


  it('T-61 Sci Gold Pulsanti 1', () => {
    let base = 6.98
    for (let a = 1; a < 20; a++) {
      cy.get('#esqui-gold > [ng-reflect-ng-switch="quotator_people_variants"] > app-quotator-pepole-variants > #cardQuotator > .card-body > .mb-3 > .col-12 > .ml-0 > .col-md-4 > [data-cy=quotator-people-variants__insureds-number-display]').invoke('val').should('eq', String(a))

      let moltiplica = (base * (a))
      moltiplica = (moltiplica.toFixed(2)).replace('.', ',')
      console.log(moltiplica)
      cy.get('#esqui-gold > [ng-reflect-ng-switch="quotator_people_variants"] > app-quotator-pepole-variants > #cardQuotator > .card-body > .purchase > :nth-child(1) > :nth-child(2) > .purchase-price').first()
        .should('have.text', moltiplica + ' € ')

      cy.get('#esqui-gold > [ng-reflect-ng-switch="quotator_people_variants"] > app-quotator-pepole-variants > #cardQuotator > .card-body > .mb-3 > .col-12 > .ml-0 > [data-cy=quotator-people-variants__add-insured-button]')
        .first().click({ force: true })

    }

  })


  it('num Personas goes back to 1', () => {

    cy.get('#esqui-gold > [ng-reflect-ng-switch="quotator_people_variants"] > app-quotator-pepole-variants > #cardQuotator > .card-body > .mb-3 > .col-12 > .ml-0 > .col-md-4 > [data-cy=quotator-people-variants__insureds-number-display]').invoke('val').then((numPersone) => {

      let i = parseInt(numPersone, 10)

      for (i == 1; i--;) {
        cy.get('#esqui-gold > [ng-reflect-ng-switch="quotator_people_variants"] > app-quotator-pepole-variants > #cardQuotator > .card-body > .mb-3 > .col-12 > .ml-0 > [data-cy=quotator-people-variants__subtract-insured-button]')
          .click({ force: true })
      }

    })
  })


  it('T-61 Sci Gold Pulsanti 2', () => {
    cy.get('#cardQuotator > .card-body > :nth-child(3) > .col-12 > .row > :nth-child(2) > .btn').first().click({ force: true })
    let base = 12.23
    for (let a = 1; a < 20; a++) {
      cy.get('#esqui-gold > [ng-reflect-ng-switch="quotator_people_variants"] > app-quotator-pepole-variants > #cardQuotator > .card-body > .mb-3 > .col-12 > .ml-0 > .col-md-4 > [data-cy=quotator-people-variants__insureds-number-display]').invoke('val').should('eq', String(a))



      let moltiplica = (base * (a))
      moltiplica = (moltiplica.toFixed(2)).replace('.', ',')
      console.log(moltiplica)
      cy.get('#esqui-gold > [ng-reflect-ng-switch="quotator_people_variants"] > app-quotator-pepole-variants > #cardQuotator > .card-body > .purchase > :nth-child(1) > :nth-child(2) > .purchase-price').first()
        .should('have.text', moltiplica + ' € ')

      cy.get('#esqui-gold > [ng-reflect-ng-switch="quotator_people_variants"] > app-quotator-pepole-variants > #cardQuotator > .card-body > .mb-3 > .col-12 > .ml-0 > [data-cy=quotator-people-variants__add-insured-button]')
        .first().click({ force: true })

    }

  })


  it('num Personas goes back to 1', () => {
    
    cy.get('#esqui-gold > [ng-reflect-ng-switch="quotator_people_variants"] > app-quotator-pepole-variants > #cardQuotator > .card-body > .mb-3 > .col-12 > .ml-0 > .col-md-4 > [data-cy=quotator-people-variants__insureds-number-display]').invoke('val').then((numPersone) => {

      let i = parseInt(numPersone, 10)

      for (i == 1; i--;) {
        cy.get('#esqui-gold > [ng-reflect-ng-switch="quotator_people_variants"] > app-quotator-pepole-variants > #cardQuotator > .card-body > .mb-3 > .col-12 > .ml-0 > [data-cy=quotator-people-variants__subtract-insured-button]')
          .click({ force: true })
      }

    })
  })


  it('T-61 Sci Gold Pulsanti 3', () => {
    cy.get('#cardQuotator > .card-body > :nth-child(3) > .col-12 > .row > :nth-child(3) > .btn').first().click({ force: true })
    let base = 33.23
    for (let a = 1; a < 20; a++) {
      cy.get('#esqui-gold > [ng-reflect-ng-switch="quotator_people_variants"] > app-quotator-pepole-variants > #cardQuotator > .card-body > .mb-3 > .col-12 > .ml-0 > .col-md-4 > [data-cy=quotator-people-variants__insureds-number-display]').invoke('val').should('eq', String(a))

      let moltiplica = (base * (a))
      moltiplica = (moltiplica.toFixed(2)).replace('.', ',')
      console.log(moltiplica)
      cy.get('#esqui-gold > [ng-reflect-ng-switch="quotator_people_variants"] > app-quotator-pepole-variants > #cardQuotator > .card-body > .purchase > :nth-child(1) > :nth-child(2) > .purchase-price').first()
        .should('have.text', moltiplica + ' € ')

      cy.get('#esqui-gold > [ng-reflect-ng-switch="quotator_people_variants"] > app-quotator-pepole-variants > #cardQuotator > .card-body > .mb-3 > .col-12 > .ml-0 > [data-cy=quotator-people-variants__add-insured-button]')
        .first().click({ force: true })

    }
  })


  it('T-61 bottone', () => {
    cy.get('#esqui-gold > [ng-reflect-ng-switch="quotator_people_variants"] > app-quotator-pepole-variants > #cardQuotator > .card-body > .purchase > .text-sm-right').first().click({ force : true })
  })
})