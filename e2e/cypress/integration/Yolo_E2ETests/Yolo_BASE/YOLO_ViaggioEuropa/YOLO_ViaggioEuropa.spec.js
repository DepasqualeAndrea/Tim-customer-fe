var env = Cypress.env()

describe('T-22 Reachability form viaggio europa with login', () => {


  let user = ''
  let token = ''

  beforeEach('Before each test', () => {
    cy.server()
    localStorage.setItem('token', token)
    localStorage.setItem('user', user)
  })


  it('T-22 Reaches Yolo home page', () => {
    cy.visit(env.url)
    cy.wait(5000)
    cy.url().should('equal', env.url + '/home')
  })


  it('T-22 Clicks ok on cookie banner', () => {
    cy.get('.cc-btn').click()
  })


  it('T-22 Reaches login page', () => {
    cy.get('.user-btn > .nav-link').click()
    cy.url().should('equal', env.url + '/login')
  })


  it('T-22 Compiles login form', () => {

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


  it('T-22 Reaches products page', () => {

    cy.route('GET', '/api/v1/product/all/1').as('products')

    cy.get('#Livello_1').click()
    cy.get('#dropdownProdotti').click()
    cy.get('.nav-item.show > .dropdown-menu > [data-index="0"]').click()

    cy.wait('@products').its('status').should('equal', 200)
    cy.url().should('equal', env.url + '/prodotti')
  })


  it('T-22 Reaches form viaggio europa', () => {
    cy.get('.nav > :nth-child(4) > .nav-link').click()
    cy.get(':nth-child(3) > .flex-column > .go-to-arrow').click()
    cy.url().should('equal', env.url + '/preventivatore;code=axa-europ-travel')
  })

  
  it('T-22 Logout', () => {
    cy.get('.user-btn > .nav-link').click()
    cy.get('.private-area-sidebar-menu-container > ul > :nth-child(6) > a').click()
  })
})