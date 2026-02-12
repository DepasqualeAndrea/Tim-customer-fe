var env = Cypress.env();

describe('T-46 T-47 T-44 Test elettrodomestici form', () => {

    let user = ''
    let token = ''

    beforeEach('Before each test', () => {
        cy.server()
        localStorage.setItem('token', token)
        localStorage.setItem('user', user)
    })


    it('T-44 Reaches Yolo home page', () => {
        cy.visit(env.url)
        cy.wait(5000)
        cy.url().should('equal', env.url + '/home')
    })


    it('T-44 Clicks ok on cookie banner', () => {
        cy.get('.cc-btn').click()
    })


    it('T-44 Reaches login page', () => {
        cy.get('.user-btn > .nav-link').click()
        cy.url().should('equal', env.url + '/login')
    })


    it('T-44 Compiles login form', () => {

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


    // it('T-44 Reaches products page', () => {

    //    // cy.route('GET', '/api/v1/product/all/1').as('products')

    //     cy.get('#Livello_1').click()
    //     cy.get('#dropdownProdotti').click()
    //     cy.get('.nav-item.show > .dropdown-menu > [data-index="0"]').click()

    //    // cy.wait('@products').its('status').should('equal', 200)
    //     cy.url().should('equal', env.url + '/prodotti')
    // 

    it('T-13 Reaches Elettrodomestici product',()=>{
        cy.visit(env.url + '/preventivatore;code=cc-appliances')
        cy.wait(5000)
    })


    it('T-44 Reaches form elettrodomestici page', () => {
       // cy.get('.nav > :nth-child(1) > .nav-link').click()
       // cy.get(':nth-child(1) > .flex-column > .go-to-arrow').click()
        cy.url().should('equal', env.url + '/preventivatore;code=cc-appliances')
    })

    it('T-46 Tests Header wording "Yolo Elettrodomestici"', () => {
        cy.get('.card-body > :nth-child(1) > .col').should('have.text', 'Yolo Elettrodomestici')
    })

    it('T-46 Tests wording "Tipo di pacchetto"', () => {
        cy.get('.card-section-title').should('have.text', 'Tipo di pacchetto')
    })

    it('T-46 Tests wording "Elettrodomestici 3"', () => {
        cy.get(':nth-child(1) > .btn').should('have.text', 'Elettrodomestici 3')
    })

    it('T-46 Tests wording "Elettrodomestici 5+1"', () => {
        cy.get(':nth-child(2) > .btn').should('have.text', 'Elettrodomestici 5+1')
    })

    it('T-46 Tests wording p descrizione', () => {
        cy.get('.description > p').should('have.text', 'Una copertura in estensione di garanzia per massimo 3 elettrodomestici di cui 1 della categoria lavaggio, ad eccezione del televisore che è escluso')
    })

    it('T-46 Tests wording prezzo Elettrodomestici 3', () => {
        cy.get('.purchase-price').should('have.text', '7,99 €  /mese')
    })

    it('T-46 Tests wording prezzo Elettrodomestici 5+1', () => {
        cy.get(':nth-child(2) > .btn').click()
        cy.get('.purchase-price').should('have.text', '16,99 €  /mese')
    })

    it('T-46 Tests wording btn "ACQUISTA"', () => {
        cy.get('#submit-test').should('have.text', 'Acquista')
    })

    it('T-46 Tests wording "Scarica il fascicolo informativo', () => {
        cy.get('.inf-package').should('have.text', ' Scarica il set informativo precontrattuale ')
    })

    it('T-46 Tests wording "Prodotto offerto in collaborazione con Cover Care"', () => {
        cy.get('.provider-text').should('have.text', ' Prodotto offerto in collaborazione con  ')
    })

    it('T-47 Tests img lavatrice', () => {
        cy.get('.fp-image').should('be.visible')
            .invoke('attr', 'src').should('eq', env.awsUrl + env.eleFrigo)
    })

    it('T-47 Tests img Covercare', () => {
        cy.get('.provider-logo > img').should('be.visible')
            .invoke('attr', 'src').should('eq', env.awsUrl + env.eleCover)
    })

    it('T-44 Tests click Elettrodomestici 5+1', () => {
        cy.get(':nth-child(2) > .btn').click()
        cy.get('.purchase-price').should('have.text', '16,99 €  /mese')
    })

    it('T-44 Tests click Elettrodomestici 3', () => {
        cy.get(':nth-child(1) > .btn').click()
        cy.get('.purchase-price').should('have.text', '7,99 €  /mese')
    })

    it('T-44 Tests href Scarica il fascicolo informativo', () => {
        cy.get('.inf-package')
            .invoke('attr', 'href').should('eq', env.awsUrl + env.elePdf)
    })

    it('T-44 Tests click Acquista', () => {
        cy.get('#submit-test').click()
        cy.url().should('eq', env.url + '/apertura/insurance-info')
    })

    it('T-44 Logout', () => {
        cy.get('.user-profile > a').click()
        cy.get('.private-area-sidebar-menu-container > ul > :nth-child(6) > a').click()
    })
})