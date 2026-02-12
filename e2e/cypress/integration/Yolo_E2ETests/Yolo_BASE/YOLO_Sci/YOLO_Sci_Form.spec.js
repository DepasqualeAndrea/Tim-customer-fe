var env = Cypress.env();

describe('T-41 T-42 Test sci form', () => {

  let user = ''
  let token = ''

  beforeEach('Before each test', () => {
    cy.server()
    localStorage.setItem('token', token)
    localStorage.setItem('user', user)
  })


  it('T-41 Reaches Yolo home page', () => {
    cy.visit(env.url)
    cy.wait(5000)
    cy.url().should('equal', env.url + '/home')
  })


  it('T-41 Clicks ok on cookie banner', () => {
    cy.get('.cc-btn').click()
  })


  it('T-41 Reaches login page', () => {
    cy.get('.user-btn > .nav-link').click()
    cy.url().should('equal', env.url + '/login')
  })


  it('T-41 Compiles login form', () => {

    cy.route('POST', '/api/legacy/users/sign_in').as('sign_in')
    cy.route('GET', '/api/legacy/users/*').as('users')

    cy.get('#email').type(env.email)
    cy.get('#password').type(env.password)
    cy.get('#login-btn-test-test').click()

    cy.wait('@sign_in')
      .then((res) => {
        token = res.response.body.token
        user.token = null
        user = JSON.stringify(res.response.body)
      })

    cy.wait('@users')
  })


  it('T-41 Reaches products page', () => {

    cy.route('GET', '/api/v1/product/all/1').as('products')

    cy.get('#Livello_1').click()
    cy.get('#dropdownProdotti').click()
    cy.get('.nav-item.show > .dropdown-menu > [data-index="0"]').click()

    cy.wait('@products').its('status').should('equal', 200)
    cy.url().should('equal', env.url + '/prodotti')
  })


  it('T-41 Reaches form sci', () => {
    cy.get('.nav > :nth-child(3) > .nav-link').click()
    cy.get(':nth-child(1) > .flex-column > .go-to-arrow').click()
    cy.url().should('include', env.url + '/preventivatore;code=erv-mountain-')
  })

  it('T-41 T-42 Tests form wording', () => {
    cy.get('.d-inline-block > .headline').should('have.text', 'Con Yolo Sci la sicurezza ha… pista libera!')
    cy.get('#cardQuotator > .card-body > :nth-child(1) > .col').first().should('have.text', 'Yolo Sci Gold')
    cy.get('#cardQuotator > .card-body > .mb-3 > .col-12 > .card-section-title').first().should('have.text', 'Numero di persone assicurate')
    cy.get('#quantity').invoke('val').should('eq', '1')
    cy.get('.nav > :nth-child(1) > .nav-link').should('have.text', 'Yolo Sci Gold ')
    let stringa = ""
    for (let i = 1; i < 4; i++) {
      if (i === 1) {
        stringa = i + ' giorno'
      }
      else {
        stringa = i + ' giorni'
      }
      if (i === 3) {
        stringa = '6 giorni'
      }
      cy.get('#cardQuotator > .card-body > :nth-child(3) > .col-12 > .row > :nth-child(' + i + ') > .btn')
        .first()
        .should('have.text', stringa)
    }
    cy.get('#cardQuotator > .card-body > :nth-child(3) > .col-12 > .row > :nth-child(4) > .btn')
      .first()
      .should('have.text', 'Stagione')
    cy.get('#erv-mountain-gold > [ng-reflect-ng-switch="quotator_people_variants"] > app-quotator-pepole-variants > #cardQuotator > .card-body > .purchase > :nth-child(1) > :nth-child(2) > .purchase-price')
      .first()
      .invoke('text')
      .should('be.equal', '3,99 € ')
    cy.get('#submit-test').should('have.text', 'Acquista')
    cy.get('#cardQuotator > :nth-child(2) > .col-12 > .inf-package')
      .first()
      .should('have.text', 'Scarica il set informativo precontrattuale')
    cy.get('#cardQuotator > .justify-content-center > .provider-text')
      .first()
      .invoke('text')
      .should('be.equal', ' Prodotto offerto in collaborazione con  ')
  })

  it('T-41 T-42 Tests form images', () => {
    cy.get('#cardQuotator > .card-body > :nth-child(1) > .col-auto > .product-icon-box > .fp-image')
      .first()
      .should('be.visible')
      .invoke('attr', 'src').should('eq', env.awsUrl + env.sciGoldSci)

    cy.get('.provider-logo > img')
      .should('be.visible')
      .invoke('attr', 'src').should('eq', env.awsUrl + env.sciGoldErgo)
  })

  it('T-41 T-42 Fascicolo Informativo', () => {
    cy.get('#cardQuotator > :nth-child(2) > .col-12 > .inf-package')
      .first()
      .invoke('attr', 'href')
      .should('eq', env.awsUrl + env.sciGoldPdf)
  })

  it('T-41 T-42 Tests form functions', () => {
    let b_p = [3.99, 6.99, 18.99, 36.00];
    for (let j = 1; j < 5; j++) {
      console.log('Giorni ' + j)
      cy.get('#cardQuotator > .card-body > :nth-child(3) > .col-12 > .row > :nth-child(' + j + ') > .btn')
        .first()
        .click({ force: true })
      for (let i = 0; i < 20; i++) {
        cy.wait(150)
        cy.get('#quantity').invoke('val').should('eq', String(i + 1))
        let b_p_str = (b_p[j - 1] * (i + 1)).toFixed(2)
        b_p_str = b_p_str.replace('.', ',')
        console.log(b_p_str)
        cy.get('#erv-mountain-gold > [ng-reflect-ng-switch="quotator_people_variants"] > app-quotator-pepole-variants > #cardQuotator > .card-body > .purchase > :nth-child(1) > :nth-child(2) > .purchase-price')
          .first()
          .should('have.text', b_p_str + ' € ')
        cy.get('#cardQuotator > .card-body > .mb-3 > .col-12 > .ml-0 > :nth-child(3) > .fa').first().click({ force: true })
      }
      for (let i = 0; i < 20; i++) {
        cy.get('#cardQuotator > .card-body > .mb-3 > .col-12 > .ml-0 > :nth-child(1) > .fa').first().click({ force: true })
      }
      cy.wait(1000)
    }
  })

  it('T-41 T-42 Tests form button', () => {
    cy.get('#submit-test').first().click({ force: true })
  })

  it('T-41 Logout', () => {
    cy.get('.user-profile > a').click()
    cy.get('.private-area-sidebar-menu-container > ul > :nth-child(6) > a').click()
  })
})