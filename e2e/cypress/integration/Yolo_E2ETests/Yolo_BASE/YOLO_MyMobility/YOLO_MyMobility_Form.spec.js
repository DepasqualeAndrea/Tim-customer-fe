var env = Cypress.env()

describe('T-51 Test my mobility form', () => {

    let user = ''
    let token = ''

    beforeEach('Before each test', () => {
        cy.server()
        localStorage.setItem('token', token)
        localStorage.setItem('user', user)
    })


    it('T-51 Reaches Yolo home page', () => {
        cy.visit(env.url)
        cy.wait(5000)
        cy.url().should('equal', env.url + '/home')
    })


    it('T-51 Clicks ok on cookie banner', () => {
        cy.get('.cc-btn').click()
    })


    it('T-51 Reaches login page', () => {
        cy.get('.user-btn > .nav-link').click()
        cy.url().should('equal', env.url + '/login')
    })


    it('T-51 Compiles login form', () => {

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


    it('T-51 Reaches products page', () => {

        cy.route('GET', '/api/v1/product/all/1').as('products')

        cy.get('#Livello_1').click()
        cy.get('#dropdownProdotti').click()
        cy.get('.nav-item.show > .dropdown-menu > [data-index="0"]').click()

        cy.wait('@products').its('status').should('equal', 200)
        cy.url().should('equal', env.url + '/prodotti')
    })


    it('T-51 Reaches form my mobility', () => {
        cy.get('.nav > :nth-child(4) > .nav-link').click()
        cy.get(':nth-child(5) > .flex-column > .go-to-arrow').click()
        cy.url().should('equal', env.url + '/preventivatore;code=allianz-mymobility')
    })


    it('T-51 Tests form wording', () => {
        cy.get('.mb-4 > .col').should('be.visible').contains('Yolo My Mobility')
        cy.get('.card-section-title').should('be.visible').contains('Quanti giorni vuoi coprire?')
        cy.get('.inf-package').should('be.visible').contains(' Scarica il set informativo precontrattuale ')
        cy.get('.provider-text').should('be.visible').contains(' Prodotto offerto in collaborazione con ')
    })


    it('T-51 Tests form images', () => {
        cy.get('.fp-image').should('be.visible').invoke('attr', 'src').should('eq', env.awsUrl + env.myMobAuto)
        cy.get('.provider-logo > img').should('be.visible').invoke('attr', 'src').should('eq', env.awsUrl + env.myMobAllianz)
        cy.get('.inf-package').should('be.visible').invoke('attr', 'href').should('eq', env.awsUrl + env.myMobPdf)
    })


    it('T-51 Tests form buttons', () => {
        cy.get(':nth-child(1) > .btn').should('be.visible').click()
        cy.get(':nth-child(2) > .btn').should('be.visible').click()
        cy.get(':nth-child(3) > .btn').should('be.visible').click()
        cy.get('#submit-test').should('be.visible')
    })


    it('T-51 Tests form select', () => {

        //seleziona tutte le possibilità 
        cy.get('#select-transports').click()
        for (let i = 1; i < 10; i++) {
            cy.get('#transport-' + i).check()
        }

        //click applica
        cy.get('.transports-box > .text-center > .btn-animation').click()

        //controlla se nell'input ci sono tutte le label
        for (let i = 1; i < 10; i++) {
            cy.get('button.form-control.text-left').should('have.text',' La tua auto, Car sharing, Taxi e car pooling, La tua moto, Scooter sharing, La tua bicicletta, Bike sharing, Treno, Traghetto ')
        }

    })


    it('T-51 Logout', () => {
        cy.get('.user-btn > .nav-link').click()
        cy.get('.private-area-sidebar-menu-container > ul > :nth-child(6) > a').click()
    })
})