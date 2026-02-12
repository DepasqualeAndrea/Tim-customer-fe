var env = Cypress.env()

describe('T-23 Reachability form my mobility without login', () => {


    beforeEach('Before each test', () => {
        cy.server()
    })

    
    it('T-23 Reaches Yolo home page', () => {
        cy.visit(env.url)
        cy.wait(5000)
        cy.url().should('equal', env.url + '/home')
    })


    it('T-23 Clicks ok on cookie banner', () => {
        cy.get('.cc-btn').click()
    })


    it('T-23 Reaches products page', () => {

        cy.route('GET', '/api/v1/product/all/1').as('products')

        cy.get('#dropdownProdotti').click()
        cy.get('.nav-item.show > .dropdown-menu > [data-index="0"]').click()

        cy.wait('@products').its('status').should('equal', 200)
        cy.url().should('equal', env.url + '/prodotti')
    })


    it('T-23 Reaches form my mobility', () => {
        cy.get('.nav > :nth-child(4) > .nav-link').click()
        cy.get(':nth-child(5) > .flex-column > .go-to-arrow').click()
        cy.url().should('include', env.url + '/preventivatore;code=allianz-mymobility')
    })
})