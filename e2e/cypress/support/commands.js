// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add('loginSignIn', () => {
    const options = {
        method: 'POST',
        failOnStatusCode: false,
        url: Cypress.env('API_sign_in'),
        body: {
            cipher: false,
            user:{
                email: Cypress.env('auth_email'),
                password: Cypress.env('auth_password'),

            }
        },
    };
    cy.request(options);
});

Cypress.Commands.add('loginSignInYolo', () => {
    const options = {
        method: 'POST',
        failOnStatusCode: false,
        url: Cypress.env('API_sign_in'),
        body: {
            cipher: false,
            user:{
                email: Cypress.env('yolo_email'),
                password: Cypress.env('yolo_pswd')
            }
        },
    };
    cy.request(options);
});


Cypress.Commands.add('logoutCheBanca', ()=>{
    cy.get('#logout_test').click({force: true});
})
