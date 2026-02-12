var env = Cypress.env()

describe('T-06 MiFido checkout', () => {


    var tokenLocal = ''
    var user = ''

    beforeEach(() => {
        localStorage.setItem('token', tokenLocal);
        localStorage.setItem('user', user);
        Cypress.Cookies.preserveOnce('session_id', 'remember_token');
        cy.wait(1000)
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
    
   let giorno
   let mese
   let anno

    it('T-06 Visit preventivatore', () => {
        cy.visit(env.url + "/preventivatore;code=net-pet-gold,net-pet-silver")
    })

    it("T-06 Test quotator price", () => {
        cy.get('[data-cy=conf-layout__yolo-mifido-silver-tab]').click({force:true})
        cy.get("[data-cy=quotator-basic__quotation-price]").contains("7,00 €")
    })

    it("T-06 Click continua", () => {
        cy.get("[data-cy=quotator-basic__purchase-button]").last().click({ force: true })
    })

    it("T-07 Test click bottone ho un gatto", () => {
        cy.get("[data-cy=net-pet-checkout-info__select-cat-button]").click({ force: true })
        cy.get("[data-cy=net-pet-checkout-info__select-cat-image]").parent(".pet-choice").last().should('have.class', 'selected-pet')
        cy.get("[data-cy=net-pet-checkout-info__select-dog-image]").parent(".pet-choice").last().should('have.class', 'unselected-pet')
    })

    it("T-07 Test click bottone ho un cane", () => {
        cy.get("[data-cy=net-pet-checkout-info__select-dog-button]").click({ force: true })
        cy.get("[data-cy=net-pet-checkout-info__select-cat-image]").parent(".pet-choice").last().should('have.class', 'unselected-pet')
        cy.get("[data-cy=net-pet-checkout-info__select-dog-image]").parent(".pet-choice").last().should('have.class', 'selected-pet')
    })

    it("T-07 Test click immagine ho un gatto", () => {
        cy.get("[data-cy=net-pet-checkout-info__select-cat-image]").click({ force: true })
        cy.get("[data-cy=net-pet-checkout-info__select-cat-image]").parent(".pet-choice").last().should('have.class', 'selected-pet')
        cy.get("[data-cy=net-pet-checkout-info__select-dog-image]").parent(".pet-choice").last().should('have.class', 'unselected-pet')
    })

    it("T-07 Test click immagine ho un cane", () => {
        cy.get("[data-cy=net-pet-checkout-info__select-dog-image]").click({ force: true })
        cy.get("[data-cy=net-pet-checkout-info__select-cat-image]").parent(".pet-choice").last().should('have.class', 'unselected-pet')
        cy.get("[data-cy=net-pet-checkout-info__select-dog-image]").parent(".pet-choice").last().should('have.class', 'selected-pet')
    })

    it("T-07 Compilazione nome animale", () => {
        cy.get('[data-cy=net-pet-checkout-info__pet-name]').type("fuffi")
    })

    it("T-07 Compilazione data nascita animale", () => {
        cy.get('[data-cy=net-pet-checkout-info__pet-birthdate]').click({ force: true })
        cy.get('ngb-datepicker').find('.ngb-dp-day').not('.disabled').last().click({ force: true })
        let selectedDate;
        cy.get('[data-cy=net-pet-checkout-info__pet-birthdate]')
            .invoke('val')
            .then(inputValue => {
                selectedDate = inputValue;
                giorno = selectedDate.substring(0, 2);
                mese = selectedDate.substring(3, 5);
                anno = selectedDate.substring(6, 10);
            }
            );

        
        
       
         
        
    })
   

    it("T-07 Controllo card degli step non ancora completati", () => {
        cy.get('[data-cy=chekout-uncompleted-step__contraente-card]').should('be.visible')
        cy.get('[data-cy=chekout-uncompleted-step__questionario-di-adeguatezza-card]').should('be.visible')
        cy.get('[data-cy=chekout-uncompleted-step__pagamento-card]').should('be.visible')
    })

    it("T-07 Click continua", () => {
        cy.get('[data-cy=chekout-step-info__continue-button]').click({force:true})
    })

    it("T-08 Controllo shopping-cart", () => {
        cy.get('.row-shadowed > :nth-child(1) > .product-name').should('be.visible')
        cy.get('[data-cy=checkout-cost-item-details__product-name]').contains('YOLO MiFido Silver')
        cy.get('[data-cy=checkout-cost-item-details__price]').contains('€7,00')
        var startdate = Cypress.moment().format('MM/YYYY')
        var enddate = Cypress.moment().add(1, 'month').format('MM/YYYY')
        cy.get('[data-cy=checkout-cost-item-details__validity-coverage]').contains(startdate)
        cy.get('[data-cy=checkout-cost-item-details__validity-coverage]').contains(enddate)
        cy.get('[data-cy=checkout-cost-item-details__dropdown-button] > img').click({force:true})
        cy.get('[data-cy=checkout-cost-item-details__rimborso-spese-veterinarie-per-intervento-item]').contains('Rimborso spese veterinarie per intervento')
        cy.get('[data-cy=checkout-cost-item-details__rimborso-spese-veterinarie-senza-intervento-item]').contains('Rimborso spese veterinarie senza intervento')
    })

    it('T-08 Controllo card dati contraente', () => {
        cy.get('app-insurance-info-completed.ng-star-inserted > .row-shadowed').should('be.visible')
        cy.get('[data-cy=chekout-step-info-completed__title]').contains('Dati Assicurazione')
        cy.get('[data-cy=chekout-step-info-completed__tipo-animale-label]').contains(' Tipo Animale: ')
        cy.get('[data-cy=chekout-step-info-completed__nome-label]').contains(' Nome: ')
        cy.get('[data-cy=chekout-step-info-completed__data-di-nascita-label]').contains(' Data di nascita: ')
        cy.get('app-insurance-info-completed.ng-star-inserted > .row-shadowed > .info-container > img').should('be.visible')
        cy.get('[data-cy=chekout-step-info-completed__tipo-animale-label] > b').contains('Cane')
        cy.get('[data-cy=chekout-step-info-completed__nome-label] > b').contains('fuffi')

        
        cy.get('[data-cy=chekout-step-info-completed__data-di-nascita-label] > b').contains(giorno)
        cy.get('[data-cy=chekout-step-info-completed__data-di-nascita-label] > b').contains(mese)
        cy.get('[data-cy=chekout-step-info-completed__data-di-nascita-label] > b').contains(anno)
    })


    it('T-08 Controllo card dati assicurazione', () => {
        cy.get('app-insurance-holder-completed.ng-star-inserted > .row-shadowed').should('be.visible')
        cy.get('app-insurance-holder-completed.ng-star-inserted > .row-shadowed > :nth-child(1) > h3').contains('Contraente')
        cy.get('app-insurance-holder-completed.ng-star-inserted > .row-shadowed > .info-container > .info > :nth-child(1)').contains(' Marco Galante ')
        cy.get('app-insurance-holder-completed.ng-star-inserted > .row-shadowed > .info-container > .info > :nth-child(2)').contains(' GLNMRC92D25F839F ')
        cy.get('app-insurance-holder-completed.ng-star-inserted > .row-shadowed > .info-container > .info > :nth-child(3)').contains(' Viale Mentana 1, Palermo ')
        cy.get('app-insurance-holder-completed.ng-star-inserted > .row-shadowed > .info-container > img').should('be.visible')
    })

    it('T-08 Controllo step non completati', () => {
        cy.get('[data-cy=chekout-uncompleted-step__pagamento-card]').should('be.visible')
    })

    it('T-08 Test questionario 1 risposta NO', () => {
        cy.get(":nth-child(1) > .answer-container > :nth-child(2) > .form-big-radio > .checkmark").click({ force: true })
        cy.get(".error > .ng-star-inserted").should("be.visible").contains("Rispondendo NO, la presente copertura risulta non adeguata alle tue esigenze, pertanto non è sottoscrivibile.")
    })

    it('T-08 Test questionario 2 risposta NO', () => {
        cy.get(":nth-child(2) > .answer-container > :nth-child(2) > .form-big-radio > .checkmark").click({ force: true })
        cy.get(":nth-child(2) > .answer-container > .error > .ng-star-inserted").should("be.visible").contains("Rispondendo NO, la presente copertura risulta non adeguata alle tue esigenze, pertanto non è sottoscrivibile.")
    })

    it('T-08 Test questionario 3 risposta NO', () => {
        cy.get(":nth-child(3) > .answer-container > :nth-child(2) > .form-big-radio > .checkmark").click({ force: true })
        cy.get(":nth-child(3) > .answer-container > .error > .ng-star-inserted").should("be.visible").contains("Rispondendo NO, la presente copertura risulta non adeguata alle tue esigenze, pertanto non è sottoscrivibile.")
    })

    it('T-08 Test questionario 1 risposta SI', () => {
        cy.get(":nth-child(1) > .answer-container > :nth-child(1) > .form-big-radio > .checkmark").click({ force: true })
        cy.get(":nth-child(1) > .answer-container > .error > .ng-star-inserted").should("not.exist")
    })

    it('T-08 Test questionario 2 risposta SI', () => {
        cy.get(":nth-child(2) > .answer-container > :nth-child(1) > .form-big-radio > .checkmark").click({ force: true })
        cy.get(":nth-child(2) > .answer-container > .error > .ng-star-inserted").should("not.exist")
    })

    it('T-08 Test questionario 3 risposta SI', () => {
        cy.get(":nth-child(3) > .answer-container > :nth-child(1) > .form-big-radio > .checkmark").click({ force: true })
        cy.get(":nth-child(3) > .answer-container > .error > .ng-star-inserted").should("not.exist")
    })

    it('T-08 Click bottone continua', () => {
        cy.get("#continuaStep3_test").click({ force: true })
    })

    it('T-08 Test titolo Questionario di adeguatezza', () => {
        cy.get('[data-cy=chekout-step-survey-completed__title]').should('have.text','Questionario di adeguatezza')
    })

    it('T-08 Test sottotitolo Completato', () => {
        cy.get('[data-cy=chekout-step-survey-completed__state] > b').should('have.text','Completato')
    })

    it('T-08 Test descrizione', () => {
        cy.get('[data-cy=chekout-step-survey-completed__description]').should('have.text','Il prodotto risulta essere adeguato alle esigenze del cliente')
    })

    it('T-08 Check flag set informativo', () => {
        cy.get('.checkbox').click({ force: true })
    })

    it('T-08 Test card step precedenti non presenti', () => {
        cy.get("[data-cy=chekout-uncompleted-step__contraente-card]").should('not.exist')
        cy.get("[data-cy=chekout-uncompleted-step__questionario-di-adeguatezza-card]").should('not.exist')
        cy.get("[data-cy=chekout-uncompleted-step__pagamento-card]").should('not.exist')
    })

    it('T-08 Click bottone continua', () => {
        cy.get('#continuaStep4_test').click({ force: true })
    })

    it('T-09 Test h2 acquisto completato', () => {
        cy.get('h2').should('have.text','Complimenti, il tuo acquisto è stato completato con successo!')
    })

    it('T-09 Logout', () => {
        cy.get('.user-profile > a').click({ force : true })
        cy.get('.private-area-sidebar-menu-container > ul > :nth-child(6) > a').click({ force : true })

    })
})