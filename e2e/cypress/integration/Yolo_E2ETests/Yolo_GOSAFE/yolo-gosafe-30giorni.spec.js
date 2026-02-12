const { data } = require("jquery");

var env = Cypress.env()
//----TODO:
//----1 finire i dati anafici nella chiamata Creation Retail Order
//---fare un metodo che restituisce una stardate dalla data odierna (Creation Retail Order)
//----2020-07-20 11:40
//-----fare un metodo che restituisce una expiration date  dalla data odierna (Create Order From Retail Order)
//----2020-07-20 14:40
describe('Test GoSafe', () => {
    var clientEmail = 'bokisiw109@retqio.com';
    var clientPassword = 'Yolo1234';
    var tokenLocal = '';
    var user = '';
    var payload_id = null;
    var clientToken = '';
    var client = '';
    var idPolicy = '';
    var responseBody = {};
    const getStartDate = function getStartDate() {
        var initialStartdate = new Date();
        var startDateFormatted = initialStartdate.getFullYear() + '-' + (initialStartdate.getMonth() + 1) + '-' + initialStartdate.getDate() + ' ' + (initialStartdate.getHours() + 2) + ':' + initialStartdate.getMinutes();
        console.log(initialStartdate);
        console.log(startDateFormatted);
        return startDateFormatted;
    }
    const getExpirationDate = function getExpirationDate() {
        var initialExpirationDate = new Date();
        var expirationDateFormatted = initialExpirationDate.getFullYear() + '-' + (initialExpirationDate.getMonth() + 1) + '-' + initialExpirationDate.getDate() + ' ' + (initialExpirationDate.getHours() + 4) + ':' + initialExpirationDate.getMinutes();
        console.log(expirationDateFormatted);
        return expirationDateFormatted;
    }


    beforeEach(() => {
        cy.server();
        localStorage.setItem('token', clientToken);
        localStorage.setItem('user', client);
    })

    before(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        const options = {
            method: 'POST',
            url: 'https://yolo-integration.yolo-insurance.com/dashboard/api/v2/users/sign_in',
            body: {
                cipher: false,
                user: {
                    email: 'yologosafe@govolt.com',
                    password: 'Gosafeyolo2020!'
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
    it('Creation Retail Order', () => {
        const startDate = getStartDate();
        const options = {
            method: 'POST',
            url: 'https://yolo-integration.yolo-insurance.com/dashboard/api/v2/retailer_orders',
            headers: {
                'authorization': tokenLocal,
            },
            body: {
                "type": "NetInsurance::GoSafe::RetailerOrder",
                "retailer": "govolt",
                "payload": {
                    "rental_price": 20,
                    "firstname": "Marco",
                    "lastname": "Gentile",
                    "taxcode": "GNTMRC92D10F205P",
                    "birth_date": "10-04-1992",
                    "address1": "Via Vai 4",
                    "phone": "354546565",
                    "zipcode": "90100",
                    "city": "Palermo",
                    "state_id": 3844,
                    "country_id": 110,
                    "birth_city_id": 8398,
                    "birth_state_id": 3844,
                    "birth_country_id": 110,
                    "start_date": startDate,
                    "email": clientEmail,
                    "answers_attributes": [
                        {
                            "question_id": 126,
                            "answer_id": 350
                        },
                        {
                            "question_id": 127,
                            "answer_id": 352
                        },
                        {
                            "question_id": 128,
                            "answer_id": 354
                        }
                    ]
                }
            },
        };

        cy.request(options)
            .then((resp) => resp.body)
            .then((body) => {
                payload_id = body.payload_id;
                expect(payload_id).to.not.be.null;
            })
    });

    it('Create Order From Retail Order', () => {
        const expirationDate = getExpirationDate();
        const options = {
            method: 'POST',
            url: 'https://yolo-integration.yolo-insurance.com/dashboard/api/v2/orders/retailers',
            headers: {
                'authorization': tokenLocal,
            },
            body: {
                "payload_id": payload_id,
                "order_attributes": {
                    "line_items_attributes": {
                        "0": {
                            "variant_id": 235,
                            "expiration_date": expirationDate
                        }
                    }
                },
                "user_attributes": {
                    "email": "bokisiw109@retqio.com",
                    "firstname": "Marco",
                    "lastname": "Gentile"
                }
            }
        }

        cy.request(options)
            .then((resp) => resp.body)
            .then((body) => {
                getStartDate();
                getExpirationDate();
                console.log(body);
                idPolicy = body.insurances.running;
                responseBody = body
            })
    });


    it('Should Login in Yolo', () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        cy.visit('http://whitelabel-sys.yolo-insurance.com/login');
        cy.wait(2000)
        cy.get('#email').type(clientEmail);
        cy.get('#password').type(clientPassword);
        cy.route('GET', 'https://whitelabel-sys.yolo-insurance.com/api/legacy/users/*').as('user')
        cy.get('#login-btn-test-test').click();
        cy.wait('@user').then(response => {
            clientToken = localStorage.token;
            client = localStorage.user;
        });
    });

    it('Should Open policy-detail in Yolo', () => {
        console.log("open policy")
        console.log(client)
        localStorage.setItem('token', clientToken);
        localStorage.setItem('user', client);
        cy.visit(`http://whitelabel-sys.yolo-insurance.com/private-area/policy/${idPolicy}`);
    });
    //--------login
    //--------apri dettaglio polizza
    //--------controllare che i campi sono valorizzati correttamente

    it('Wording go-safe policy-details', () => {
        cy.wait(2000);
        cy.get('[data-cy=policy-detail-full__title]').contains('Yolo Go Safe')
        cy.get('[data-cy=policy-detail-full__open-claim]').contains('DENUNCIA UN SINISTRO')
        cy.get('[data-cy=policy-detail-recap-go-safe__policy-data]').contains('Dati polizza')
        cy.get('[data-cy=policy-detail-recap-go-safe__policy-number-label]').contains('Numero Polizza')
        cy.get('[data-cy=policy-detail-recap-go-safe__policy-status-label]').contains('Stato')
        cy.get('[data-cy=policy-detail-recap-go-safe__policy-start-date-label]').contains('Data attivazione')
        cy.get('[data-cy=policy-detail-recap-go-safe__policy-expiration-date-label]').contains('Data scadenza')
        cy.get('[data-cy=policy-detail-full__payment-method-title]').contains(/METODO DI PAGAMENTO/i)
        cy.get('[data-cy=policy-detail-full__payment-method-label]').contains('Metodo di pagamento')
        cy.get('[data-cy=policy-detail-full__payment-card-holder]').contains('Titolare')
        cy.get('[data-cy=policy-detail-full__payment-card-number]').contains('Numero carta')
        cy.get('[data-cy=policy-detail-full__payment-card-expiration]').contains('Scadenza')
        cy.get('[data-cy=policy-detail-full__external-redirect-info-part-1]').contains('Cliccando su “Apri un sinistro” verrai re-indirizzato al portale di');
        cy.get('[data-cy=policy-detail-full__external-redirect-info-part-2]').contains('per l’aggiunta di foto e descrizione dell’evento');
    })


    it('Policy-Data', () => {
        cy.wait(5000)
        cy.visit(`http://whitelabel-sys.yolo-insurance.com/private-area/policy/${idPolicy}`);
        startDate = responseBody.line_items[0].start_date;
        endDate = responseBody.line_items[0].expiration_date;
        var PolicyNumber = '';
        const options = {
            method: 'GET',
            url: `https://yolo-integration.yolo-insurance.com/dashboard/api/v2/insurances/${idPolicy}`,
            headers: {
                'authorization': clientToken,
            }
        }
        cy.request(options)
            .then((resp) => resp.body)
            .then((body) => {
                PolicyNumber = body.policy_number;
                cy.get('[data-cy=policy-detail-recap-go-safe__policy-number-valor]').contains(PolicyNumber);
            })
        cy.get('[data-cy=policy-detail-recap-go-safe__policy-start-date-valor]').contains(Cypress.moment(startDate).format('DD/MM/YYYY, HH:mm'));
        cy.get('[data-cy=policy-detail-recap-go-safe__policy-expiration-date-valor]').contains(Cypress.moment(endDate).format('DD/MM/YYYY, HH:mm'));
    })


    it('check-certificato', () =>{
        cy.get('[data-cy=policy-detail-recap-go-safe__policy-certificate]').should('be.visible');
    })


    // 231 consumo
    // 232 1 giorno
    // 233 3 giorni
    // 234 7 giorni
    // 235 30 giorni

    // https://whitelabel-sys.yolo-insurance.com/api/legacy/insurances/87974


    it('check-recesso', () => {
        cy.get('[data-cy=policy-detail-full__withdrawal] > a').contains('Vuoi recedere da questa polizza?');
        cy.get('[data-cy=policy-detail-full__withdrawal] > a').click();
        cy.get('#withdrawReason').type('test')
        cy.get('[data-cy=policy-detail-modal__withdrawl]').click();
        cy.route('PUT', '/api/legacy/insurances/${idPolicy}')
    })

});
