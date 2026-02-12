cy.clearLocalStorage = () => {
}

describe('login', () => {
    var tokenLocal = '';
    var user = '';

    before(() => {
        cy.loginSignIn()
            .then((resp) => resp.body)
            .then((body) => {
                const { token } = body;
                user = body;
                user.token = null;
                user = JSON.stringify(user);
                tokenLocal = token;
            })
        Cypress.Cookies.preserveOnce('session_id', 'remember_token');
    });

    beforeEach(() => {
        localStorage.setItem('token', tokenLocal);
        localStorage.setItem('user', user);
    });

    after(() => {
        cy.logoutCheBanca();
    })


    it('redirect site', () => {
        cy.visit('/prodotti');

        cy.get('.username').should('be.visible');
    });


    it('productselectionBikePremium', () => {
        cy.wait(3000).then(() => {
            cy.get('#scopridipiu-test')
                .click();
            cy.get('#product_test4')
                .click();
            cy.get('#ge-bike-premium')
                .click({force: true});
        })
    })


    it('compileQuotator', () => {

        cy.get('#select-age7')
            .click({force:true});
        cy.get('#add-test')
            .click({force: true});
        cy.get('#applicaBike_test')
            .click({force: true});
        cy.get(':nth-child(1) > .toggle-select > .addon-image')
            .click({force: true});
        cy.get(':nth-child(2) > .toggle-select > .addon-image')
            .click({force: true});
        cy.get('#procediAcquistoBike_test')
            .click({force: true});
    });


})