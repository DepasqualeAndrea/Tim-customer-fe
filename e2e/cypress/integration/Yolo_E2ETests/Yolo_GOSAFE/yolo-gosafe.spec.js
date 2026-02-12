var env = Cypress.env()
//----TODO:
//----1 finire i dati anafici nella chiamata Creation Retail Order
//---fare un metodo che restituisce una stardate dalla data odierna (Creation Retail Order)
//----2020-07-20 11:40
//-----fare un metodo che restituisce una expiration date  dalla data odierna (Create Order From Retail Order)
//----2020-07-20 14:40
describe('Test GoSafe', () =>{
    var clientEmail = 'm.galante@be-tse.it';
    var clientPassword = 'Yolo1234';
    var tokenLocal = '';
    var user = '';
    var payload_id = null;
    var clientToken='';
    var client='';
    var idPolicy = '';

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
                'authorization'    : tokenLocal,       
              },
            body: {
                    "type":"NetInsurance::GoSafe::RetailerOrder",
                    "retailer": "govolt",
                    "payload": {
                        "rental_price": 20,
                        "firstname": "Marco",
                        "lastname": "Gentile",
                        "taxcode": "GNTMRC92A01G273J",
                        "birth_date": "01-01-1992",
                        "address1": "Via Vai 4",
                        "phone": "123456789",
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
                'authorization' : tokenLocal,       
              },
            body: {
                    "payload_id": payload_id,
                    "order_attributes": {
                        "line_items_attributes": {
                            "0": {
                                "variant_id": 231,
                                "expiration_date": expirationDate
                            }
                        }
                    },
                    "user_attributes": {
                        "email": "m.galante@be-tse.it",
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
        })
    });

    it('Should Login in Yolo', () => {  
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        cy.visit('https://whitelabel-sys.yolo-insurance.com/login');
        cy.wait(2000)
        cy.get('#email').type(clientEmail);
        cy.get('#password').type(clientPassword);
        cy.route('GET','https://whitelabel-sys.yolo-insurance.com/api/legacy/users/*').as('user')
        cy.get('#login-btn-test-test').click();  
        cy.wait('@user').then(response=> {
        clientToken = localStorage.token;
        client = localStorage.user;    
        });
    });

    it('Should Open policy-detail in Yolo', () => {
        console.log("open policy") 
        console.log(client)
        cy.wait(3000)
        localStorage.setItem('token', clientToken);
        localStorage.setItem('user', client);
        cy.visit(`https://whitelabel-sys.yolo-insurance.com/private-area/policy/${idPolicy}`);
    });
    //--------login
    //--------apri dettaglio polizza
    //--------controllare che i campi sono valorizzati correttamente

 
    // 231 consumo
    // 232 1 giorno
    // 233 3 giorni
    // 234 7 giorni
    // 235 30 giorni

});

