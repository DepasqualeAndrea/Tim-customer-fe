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

    it('cookiepolyce', () => {
        cy.get(':nth-child(3) > .cc-btn')
            .click();
    })

    it('productselectionViaggioPremium', () => {
        cy.wait(3000).then(() => {
            cy.get('#scopridipiu-test')
                .click();
            cy.get('#product_test3')
                .click();
            cy.get('#ge-travel-premium')
                .click({force: true});
        })
    })

    it('compileQuotator', () => {

        cy.get('#datePicker2').click({ force: true })
        cy.get('ngb-datepicker').find('.ngb-dp-day').not('.disabled').first().click({ force: true })
        cy.get('ngb-datepicker').find('.ngb-dp-day').not('.disabled').first().click({ force: true })

        cy.get('#destinationSelect2')
            .select('Argentina', { force: true })
        cy.get('#select-age2')
            .click({force:true});
        cy.get(':nth-child(1) > :nth-child(4) > .js-add-quantity')
            .click({force: true});
        cy.get('.text-center > .btn')
            .click({force: true});
        cy.get(':nth-child(1) > .toggle-select > .addon-image')
            .click({force: true});
        cy.get('#procedi2')
            .click({force: true});
    });

    it('checkout_Step_1', () => {
        cy.get('#contractorIsInsured')
            .click();
        cy.get('#continuaStep1_test')
            .click();
    });


    it('checkout_Step_2', () => {
        cy.wait(5000).then(() => {
            cy.get('#continuaStep2_test')
                .click();
        })
    });

    it('checkout_Step_3', () => {
        cy.wait(5000).then(() => {
            cy.get('#answer-1')
                .click({ force: true });
            cy.get('#answer-5')
                .click({ force: true });

            cy.get('#continuaStep3_test')
                .click();
        })
    });

    it('checkout_Stpe_4', () => {
        cy.wait(5000).then(() => {
            cy.get('#wallet-3')
                .click({ force: true });
            cy.get('#informationPackage')
                .click();
            cy.get('#informationPrivacy1')
                .click();
            cy.get('#informationRule')
                .click();
            cy.get('#informationPrivacy2')
                .click();
            cy.get('#paperCopy')
                .click();
            cy.get('#continuaStep4_test')
                .click();
        })
    });

    it('PrivateArea', () => {
        cy.wait(5000).then(() => {
            cy.get('.btn-primary')
                .click({ force: true });
        })
    });

    it('PolicyDetails', () => {
        cy.wait(5000).then(() => {
            cy.get(':nth-child(1) > .card > .policy-info > .status > .no-contingency > .d-block')
                .click({ force: true });
        })
    });

    it('PeportsClaim', () => {
        cy.wait(5000).then(() => {
            cy.get('.btn')
                .click({ force: true });
        })

        cy.get('.input-wrapper > .form-control').click()
        cy.get('ngb-datepicker').find('.ngb-dp-day').not('.disabled').first().click({ force: true })

        cy.get('.md-textarea')
            .type('Test');
        cy.get('.m-1')
            .click();
        cy.get('.col-4')
            .click();
        cy.get('ul > :nth-child(3) > span')
            .click();

    });

});


