const { HttpXhrBackend } = require("@angular/common/http");

var env = Cypress.env();

describe('T-87 checkout sport spagna', () => {

    var tokenLocal = '';
    var user = '';

    beforeEach(() => {

        cy.server()
        cy.route('PUT','/api/legacy/checkouts/*').as('checkouts')
        cy.route('GET','/api/v1/product/all/*').as('loading')
        cy.route('POST', '/api/legacy/chubb/quote_sport').as('quotes')

        localStorage.setItem('token', tokenLocal);
        localStorage.setItem('user', user);
        Cypress.Cookies.preserveOnce('session_id', 'remember_token');
    });

    before(() => {
        const options = {
            method: 'POST',
            failOnStatusCode: false,
            url: env.url + env.api_url,
            body: {
                cipher: false,
                user: {
                    email: Cypress.env('email'),
                    password: Cypress.env('password')
                }
            },
        };
        cy.request(options)
            .then((resp) => resp.body)
            .then((body) => {
                const { token } = body;
                user = body;
                user.token = null;
                user = JSON.stringify(user);
                tokenLocal = token;
            })

    });

    it('T-87 Visit pagina', () => {
        cy.visit(env.url + '/preventivatore;code=chubb-deporte-rec,chubb-deporte')
        cy.wait('@loading')
    })

    it('T-87 Compilazione form', () => {
        cy.get('[data-cy=sport-quotator__select-sport]').select('TENIS')
        cy.get('[data-cy=sport-quotator__select-insureds-age]').click({ force: true })
        cy.get('[data-cy=age-selector__number-of-insureds-25-add]').click({ force: true })
        cy.get('[data-cy=age-selector__number-of-insureds-25-add]').click({ force: true })
        cy.get('[data-cy=age-selector__submit-button]').click({ force: true })
        cy.get('[data-cy=sport-quotator__sport-equip-button]').click({ force: true })
        cy.get('[data-cy=sport-quotator__sport-rc-button]').click({ force: true })
        cy.get('[data-cy=sport-quotator__1-month-button]').click({ force: true })
        cy.wait('@quotes')
        cy.get('[data-cy=sport-quotator__quotation-price]').contains('43,74')
        cy.get('[data-cy=sport-quotator__purchase-button]').first().click({ force: true })
    })

    it('T-87 Checkout Step-1', () => {
        cy.get('[data-cy=check1]').click({ force: true })
        cy.get('[data-cy=chekout-step-info__insured-1-first-name]').type('aaaa')
        cy.get('[data-cy=chekout-step-info__insured-1-last-name]').type('bbbb')
        cy.get('[data-cy=chekout-step-info__insured-1-birth-date]').focus().clear()
        cy.get('[data-cy=chekout-step-info__insured-1-birth-date]').type('17/03/2016')
        cy.get('[data-cy=chekout-step-info__insured-1-family-grade]').select('Hijo/Hija')
    })

    it('T-87 Click bottone continuar to step 2', () => {
        cy.get('[data-cy=chekout-step-info__continue-button]').click({ force: true })
    })

    it('T-87 Test prezzi ricalcolati', () => {
        cy.get('[data-cy=shopping-cart__price-change-reason-label]').should('have.text', ' Las fechas de nacimiento no corresponden a los rangos de edad establecidos inicialmente por este motivo, el precio ha sido recalculado ')
    })

    it('T-87 Click bottone volver', () => {
        cy.get('[data-cy=das-checkout-address__back-button]').click({ force: true })
    })

    it('T-87 Controllo Dati Step 1', () => {
        cy.get('[data-cy=chekout-step-info__insured-1-first-name]').invoke('val').should('eq', 'Aaaa')
        cy.get('[data-cy=chekout-step-info__insured-1-last-name]').invoke('val').should('eq', 'Bbbb')
        cy.get('[data-cy=chekout-step-info__insured-1-birth-date]').invoke('val').should('eq', '17/03/2016')
        cy.get('[data-cy=chekout-step-info__insured-1-family-grade]').invoke('val').should('eq', 'son')
    })

    it('T-87 Click bottone continuar to step 2', () => {
        cy.get('[data-cy=chekout-step-info__continue-button]').click({ force: true })
        
        cy.wait('@checkouts')
    })

    it('T-87 Click bottone continuar to step 3', () => {
        
        cy.get('[data-cy=das-checkout-address__continue-button]').first().click({ force: true })
        cy.wait('@checkouts')
    })

    it('T-87 Test dati assicurati step 3', () => {

        cy.get('div > b').click({force:true})
        cy.get('app-checkout-card-recap-insured-subjects > :nth-child(1) > :nth-child(2) > :nth-child(1) > span').contains('Aaaa Bbbb')
        cy.get('app-checkout-card-recap-insured-subjects > :nth-child(1) > :nth-child(2) > :nth-child(2) > span').contains('Mario Rossi')
    })

    it('T-87 Ritorna allo step 1', () => {
        cy.get('.btn.btn-secondary.mx-1').click({ force: true })
        cy.get('[data-cy=das-checkout-address__back-button]').click({ force: true })
    })

    it('T-87 Untick el tomador es tambien el asegurado', () => {
        cy.get('[data-cy=check1]').click({ force: true })
        cy.get('[data-cy=chekout-step-info__insured-2-first-name]').type('cccc')
        cy.get('[data-cy=chekout-step-info__insured-2-last-name]').type('dddd')
        cy.get('[data-cy=chekout-step-info__insured-2-birth-date]').focus().clear()
        cy.get('[data-cy=chekout-step-info__insured-2-birth-date]').type('12/04/1983')
        cy.get('[data-cy=chekout-step-info__insured-2-family-grade]').select('Hijo/Hija')
    })

    it('T-87 Continuar fino allo step 3', () => {
        cy.get('.d-none > [data-cy=chekout-step-info__continue-button]').click({force:true})
        cy.get('[data-cy=das-checkout-address__continue-button]').first().click({ force: true })
    })

    it('T-87 Test dati assicurati step 3', () => {

        cy.get('div > b').click({force:true})
        cy.get('app-checkout-card-recap-insured-subjects > :nth-child(1) > :nth-child(2) > :nth-child(1) > span').contains('Aaaa Bbbb')
        cy.get('app-checkout-card-recap-insured-subjects > :nth-child(1) > :nth-child(2) > :nth-child(2) > span').contains('cccc dddd')
    })

    it('T-87 Check response step 4 pagamento',()=>{

        var arr = {
                    "insurance_holders": [
                        {
                            "relationship": "son",
                            "firstname": "Cccc",
                            "lastname": "Dddd",
                            "birth_date": "1983-04-12"
                        },
                        {
                            "relationship": "son",
                            "firstname": "Aaaa",
                            "lastname": "Bbbb",
                            "birth_date": "2016-03-17"
                        }
                    ]
                }
            
        
       

        

        cy.get('#answer-46').check({force:true})
        cy.get('#answer-49').check({force:true})
        cy.get('#answer-52').check({force:true})
        cy.get('#continuaStep3_test').click({ force : true })

       

        cy.wait('@checkouts').then((xhr) => {
            expect(xhr.response.body.line_items[0].insured_entities.insurance_holders[0]).to.include(arr.insurance_holders[0])
            expect(xhr.response.body.line_items[0].insured_entities.insurance_holders[1]).to.include(arr.insurance_holders[1])
        })

    })
        

})