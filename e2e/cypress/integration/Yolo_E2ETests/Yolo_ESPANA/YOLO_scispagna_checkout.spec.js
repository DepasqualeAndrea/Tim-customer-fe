var env = Cypress.env()

describe('T-62 T-66 T-70 T-71 T-72 test_yolo_scispagna_checkout', () => {

    let user = ''
    let token = ''

    beforeEach(() => { 
        cy.server()
        localStorage.setItem('token', token) 
        localStorage.setItem('user', user)
    });

    it('T-61 Visit', () => {
        cy.visit(env.url + '/login')
        cy.wait(6000) //wait all xhrs on first load
    })

    it('T-61 Click ok banner cookie', () => {
        cy.get('.cc-btn').click({ force : true })
    })

    it('T-61 Sign in', () => {

        cy.route('POST', '/api/legacy/users/sign_in').as('sign_in')
        cy.route('GET','/api/legacy/users/*').as('users')

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

   

    it('T-61 Click Prodotti', () => {
        cy.route('GET','/api/v1/product/all/1').as('products')
        cy.get('#Livello_1').click({ force: true }); 
        cy.wait('@products')
    })

    it('T-62 click su yolo esqui', () => {
        cy.get('.slick-current > :nth-child(1) > .slide > .slick-track-product').should('be.visible').click({ force: true });
    })

    it('T-62 click su continuar', () => {
        cy.get('#submit-test').should('be.visible').click({ force: true })
    });

    it('T-62 controllo url', () => {
        cy.url().should('include', '/apertura/insurance-info')
    })

    it('T-62 wording pagina checkout1', () => {
        cy.get('app-checkout-card-recap > :nth-child(1) > :nth-child(1) > .step-title').contains('Yolo esquí Gold')
        cy.get('.col-lg-10 > :nth-child(1) > :nth-child(1)').contains('Tipo de paquete:')
        cy.get(':nth-child(1) > :nth-child(2) > b').contains('Yolo esquí Gold')
        cy.get('.col-lg-10 > :nth-child(2) > :nth-child(1)').contains('Asegurados:')
        cy.get(':nth-child(2) > :nth-child(2) > b').contains('1')
        cy.get('app-checkout-card-period > :nth-child(1) > .col-12 > .step-title').contains('PERÍODO')
        cy.get('app-checkout-card-period > :nth-child(1) > .col-12 > span').contains('* campos obligatorios')

    });

    it('T-62 wording pagina checkout2', () => {
        cy.get(':nth-child(2) > .input-wrapper > label.pl-3').contains('Fecha de fin de cobertura')
        cy.get('.col-10').contains(' La cobertura será válida en las fechas indicadas solo si la compras antes de comenzar tu viaje a la estación de esquí ')
        cy.get('app-checkout-card-insured-subjects > :nth-child(1) > :nth-child(1) > .step-title').contains('ASEGURADOS')
        cy.get('.form-big-checkbox').contains(' El tomador es también el asegurado ')
        cy.get('.mb-3 > .step-title').contains('DATOS PERSONALES 1')
        cy.get('span > i').contains('todos los campos son obligatorios')
        cy.get('app-checkout-card-insured-subjects > :nth-child(1) > .mt-2 > .row > :nth-child(2)').should('be.visible').contains('Nombre')

    })

    it('T-62 wording pagina checkout3', () => {
        cy.get('.mt-2 > .row > :nth-child(3)').should('be.visible').contains('Apellidos')
        cy.get('.mt-2 > .row > :nth-child(4)').should('be.visible').contains('Fecha de nacimiento')
        cy.get('[data-cy=shopping-cart__product-header]').contains('Yolo esquí Gold')
        cy.get('[data-cy=das-shopping-cart__costo-unitario-name]').contains('Costo Unitario')
        cy.get('[data-cy=das-shopping-cart__total-name]').contains('Total')
        cy.get('[data-cy=das-shopping-cart__total-amount]').contains('6,98')
    })

    it('T-62 Controllo immagini del checkout', () => {
        cy.get('.product-icon').should('be.visible').invoke('attr', 'src').should('include', 'sci_gold.png')
        cy.get('.col-1').should('be.visible')
    });

    it('T-62 Controllo check e unchecked della checkbox', () => {
        cy.get('[type="checkbox"]').check()
        cy.get('[type="checkbox"]').uncheck()
    });

    it('T-62 Controllo calendario Fecha inicio de cobertura', () => {
        cy.get('#datepicker-startdate-test').click({ force: true })
        cy.get('.dropdown-menu').find('.btn-light').not('.disabled').last().click({ force: true })
    });

    it('T-62 Controllo calendario Fecha de nacimiento', () => {
        cy.get('#datepicker-test').click({ force: true })
        cy.get('.dropdown-menu').find('.ngb-dp-day').not('.disabled').last().click({ force: true })
    });

    it('T-62 controllo select', () => {
        cy.get('#select-familygrade0').should('be.visible').contains('Parentesco')
        cy.get("#select-familygrade0").select('Marido/Mujer');
        cy.get("#select-familygrade0").select('Hijo/Hija');
        cy.get("#datepicker-test").focus().clear()
        cy.get("#datepicker-test").type('11/02/1980')
        cy.get("#select-familygrade0").select('Otro');
    });


    it('T-62 checkbox', () => {
        cy.get('[data-cy=check1]').click({ force: true })

    })

    // it('T-62 test form assicurato',()=>{
    //     cy.get('[data-cy=chekout-step-info__insured-1-first-name]').type('Maria')
    //     cy.get('[data-cy=chekout-step-info__insured-1-last-name]').type('Sgarlati')
    //     cy.get('[data-cy=chekout-step-info__insured-1-family-grade]').select('spouse')
    // })

    it('T-62 continuar', () => {
        cy.route('PUT', '/api/legacy/checkouts/*').as('checkouts')
        cy.get('.d-none > [data-cy=chekout-step-info__continue-button]').click({ force: true })
        cy.wait('@checkouts')
    })


    it('T-66 (1) wording Fase 2', () => {
        cy.get('app-checkout-card-recap > :nth-child(1) > :nth-child(1) > .step-title').contains('Yolo esquí Gold')
        cy.get('.col-lg-10 > :nth-child(1) > :nth-child(1)').contains('Tipo de paquete:')
        cy.get(':nth-child(1) > :nth-child(2) > b').contains('Yolo esquí Gold')
        cy.get('.col-lg-10 > :nth-child(2) > :nth-child(1)').contains('Asegurados:')
        cy.get(':nth-child(2) > :nth-child(2) > b').contains('1')
    })


    it('T-66 (2) wording fase 2', () => {
        cy.get('[data-cy=shopping-cart__product-header]').contains('Yolo esquí Gold')
        cy.get('[data-cy=das-shopping-cart__costo-unitario-name]').contains('Costo Unitario')
        cy.get('[data-cy=das-shopping-cart__total-name]').contains('Total')
        cy.get('[data-cy=das-shopping-cart__total-amount]').contains('6,98')
        cy.get('form.ng-untouched > :nth-child(1) > .col-12').contains('CONTRATANTE')
        cy.get('form.ng-untouched > :nth-child(2) > .col-12').contains('Todos los campos son obligatorios')
    })


    it('T-66 Immagini Fase 2', () => {
        cy.get('.product-icon').invoke('attr', 'src').should('eq', 'https://yolo-es-integration.s3.amazonaws.com/spree/images/attachments/7/small/sci_gold.png?1574267336')
    })


    it('T-66 (1)Form Fase 2', () => {
        cy.get(':nth-child(3) > :nth-child(1) > label').contains('Nombre').siblings().invoke('val').should('be.not.empty')
        cy.get(':nth-child(3) > :nth-child(2) > label').contains('Apellidos').siblings().invoke('val').should('be.not.empty')
        cy.get(':nth-child(4) > :nth-child(1) > label').contains('DNI').siblings().invoke('val').should('be.not.empty')
        cy.get(':nth-child(4) > :nth-child(2) > label').contains('Número de teléfono ').siblings().invoke('val').should('be.not.empty')

    })

    it('T-66 (2) Form Fase 2',()=>{
        cy.get(':nth-child(5) > .form-label-group > label').contains('Fecha de nacimiento').siblings().invoke('val').should('be.not.empty')
        cy.get(':nth-child(5) > :nth-child(2)').contains('País de nacimiento ').siblings().invoke('val').should('be.not.empty')
        cy.get(':nth-child(7) > .col-12 > label').contains('Dirección de residencia').siblings().invoke('val').should('be.not.empty')
        cy.get(':nth-child(8) > :nth-child(1) > label').contains('Ciudad de residencia').siblings().invoke('val').should('be.not.empty')
        cy.get(':nth-child(8) > :nth-child(2) > label').contains('Código postal').siblings().invoke('val').should('be.not.empty')
        cy.get(':nth-child(9) > :nth-child(1)').contains('País de residencia')

    })

    it('T-66 (3) Form Fase 2', () => {
        cy.route('PUT','/api/legacy/checkouts/*').as('checkouts')
        cy.get('#residentialCountry').select('Spain', { force: true })
        cy.get(':nth-child(9) > :nth-child(2)').contains('Provincia de residencia')
        cy.get('#residentialStates').select('Galicia', { force: true })
        cy.get('[data-cy=das-checkout-address__continue-button]').click({ force: true })
        cy.wait('@checkouts')
    })

     it('T-70 Form Fase 3', () => {

        cy.get('#continuaStep3_test').should('be.disabled')

        //tutte le risposte a si
        for(let j = 1; j < 6; j++){
            cy.get(':nth-child(' + j + ') > .answer-container > :nth-child(1) > .form-big-radio > .checkmark').click({ force: true })
        }
     })

    // it('T-70 Form Fase 3', () => {

    //     cy.get('#continuaStep3_test').should('be.disabled')

    //     //tutte le risposte a si
    //     for(let j = 1; j < 6; j++){
    //         cy.get(':nth-child(' + j + ') > .answer-container > :nth-child(1) > .form-big-radio > .checkmark').click({ force: true })
    //     }
        
    //     var table = [] 

    //     //controllo messaggi di errore no e messaggio no contesto
    //     for (let i = 0; i < 32; i++) {

    //         table = (i).toString(2).padStart(5, 0).split("")
    //         // console.log(i)
    //         // console.table(table)

    //         for (var j = 0; j < 5; j++) {

    //             scelta = parseInt(table[j]) + 2
    //             let pos = j + 1

    //             cy.get(':nth-child(' + pos + ') > .answer-container > :nth-child(' + scelta + ') > .form-big-radio > .checkmark').click({ force: true })

    //             switch(scelta){

    //                 case 2:
    //                     cy.get(':nth-child(6) > .question')
    //                         .should('be.visible')
    //                         .should('have.text', 'Declaro de no querer responder a las preguntas indicadas en el “Cuestionario de coherencia de la cobertura del seguro”, consciente que ésto obstaculiza la evaluación de idoneidad del contrato relativa a mis necesidades de seguro y que deseo suscribir el Contrato igualmente.')

    //                     cy.get('#continuaStep3_test').should('be.disabled')
    //                     break;

    //                 case 3:
    //                     cy.get(':nth-child(' +  pos + ') > .answer-container > .error > div')
    //                         .should('be.visible')
    //                         .should('have.text',' Respondiendo NO, la cobertura actual resulta no conforme a tus exigencias, por lo tanto non es suscribible. ')
                        
    //                     cy.get('#continuaStep3_test').should('be.disabled')
    //                     break;
    //             }
    //         }         
    //     }

        


    //     //tutte le risposte a si
    //     for(let j = 1; j < 6; j++){
    //         cy.get(':nth-child(' + j + ') > .answer-container > :nth-child(1) > .form-big-radio > .checkmark').click({ force: true })
    //     }

    //     //tutte le risposte a si con un no contesto e il check del si nella domanda 6 che viene visualizzata
    //     for(let j = 1; j < 6; j++){

    //         cy.get(':nth-child(' + j + ') > .answer-container > :nth-child(2) > .form-big-radio > .checkmark').click({ force: true })

    //         cy.get('#continuaStep3_test')
    //         .should('be.disabled')

    //         cy.get(':nth-child(6) > .answer-container > :nth-child(1) > .form-big-radio > .checkmark').click({ force: true })

    //         cy.get('#continuaStep3_test')
    //         .should('not.be.disabled')

    //         cy.get(':nth-child(' + j + ') > .answer-container > :nth-child(1) > .form-big-radio > .checkmark').click({ force: true })

    //         cy.get('#continuaStep3_test')
    //         .should('not.be.disabled')
    //     }
        
    //     const todaysDate = Cypress.moment().format('DD/MM/YYYY')

    //     cy.get('.row-shadowed > .step-title').should('have.text', 'CUESTIONARIO PARA LA ADECUACIÓN DE LA COBERTURA DE SEGURO ')
    //     cy.get('.subtext').should('have.text', '* campos obligatorios')
    //     cy.get(':nth-child(1) > .question')
    //         .should('have.text', '¿Está interesado en recibir ayuda si necesita ayuda mientras practica un deporte de invierno?')
    //     cy.get(':nth-child(2) > .question')
    //         .should('have.text', '¿Está interesado en protegerse tanto del daño que ha sufrido como del daño que ha causado al practicar un deporte de invierno?')
    //     cy.get(':nth-child(3) > .question')
    //         .should('have.text', '¿Sabe que la cobertura sólo es válida para deportes de invierno amateur en instalaciones o áreas utilizadas para este fin?')
    //     cy.get(':nth-child(4) > .question')
    //         .should('have.text', '¿Conoce usted alguna exclusión de cobertura en el conjunto de la información precontractual? (descargar)')
    //     cy.get(':nth-child(5) > .question')
    //         .should('have.text', '¿Conoce la presencia de límites máximos, franquicias y descubiertos en el conjunto de información precontractual? (descargar)')
    //     cy.get(' .row-shadowed > :nth-child(4)')
    //         .should('have.text', ' El Tomador declara haber respondido completa y verazmente al cuestionario para evaluar la idoneidad del contrato, asumiendo toda la responsabilidad y confirmando que el contrato propuesto cumple con sus propias necesidades de seguro. ')
    //     cy.get('.mt-3')
    //         .should('have.text', 'FECHA: ' + todaysDate)
    // })

    it('T-70 click continuar',()=>{
        cy.get('#continuaStep3_test')
        .should('not.be.disabled')
        .click({ force : true })
    })

    // it('T-70 Form Fase 3', () => {

    //     var table = [] 

    //     for (let i = 0; i < 243; i++) {

    //         table = (i).toString(3).padStart(5, 0).split("")

    //         for (var j = 0; j < 5; j++) {

    //             table[j] = parseInt(table[j]) + 1

    //             cy.get(':nth-child(' + (j + 1) + ') > .answer-container > :nth-child(' + table[j] + ') > .form-big-radio > .checkmark').click({ force: true })

    //             switch(table[j]){
    //                 case 2:
    //                     cy.get(':nth-child(6) > .question')
    //                         .should('be.visible')
    //                         .should('have.text', 'Declaro de no querer responder a las preguntas indicadas en el “Cuestionario de coherencia de la cobertura del seguro”, consciente que ésto obstaculiza la evaluación de idoneidad del contrato relativa a mis necesidades de seguro y que deseo suscribir el Contrato igualmente.')
    //                     break;
    //                 case 3:
    //                     cy.get(':nth-child(' +  (j + 1) + ') > .answer-container > .error > div')
    //                         .should('be.visible')
    //                         .should('have.text',' Respondiendo NO, la cobertura actual resulta no conforme a tus exigencias, por lo tanto non es suscribible. ')
    //                     break;
    //             }
    //         }
            
    //     }

    // })


    // it('T-70 Form Fase 3', () => {
    //     var table = [] //0=disabled,1=enabled,2=forced
    //     const todaysDate = Cypress.moment().format('DD/MM/YYYY')
    //     cy.get('#continuaStep3_test').should('be.disabled')
    //     for (let i = 1; i < 6; i++) {
    //         cy.get(':nth-child(' + i + ') > .answer-container > :nth-child(3) > .form-big-radio > .checkmark').click({ force: true })
    //     }
    //     for (let i = 0; i < 32; i++) {
    //         table = (i).toString(2).padStart(5, 0).split("")
    //         for (var j = 1; j < 6; j++) {
    //             if (table[j - 1] === '1') {
    //                 //console.table(table)
    //                 cy.get(':nth-child(' + j + ') > .answer-container > :nth-child(2) > .form-big-radio > .checkmark').click({ force: true })
    //                 if (j !== 1) {
    //                     cy.get(':nth-child(6) > .question').should('be.visible')
    //                 }
    //             } else {
    //                 cy.get(':nth-child(' + j + ') > .answer-container > :nth-child(3) > .form-big-radio > .checkmark').click({ force: true })
    //             }
    //         }
    //     }
    //     for (let i = 1; i < 6; i++) {
    //         cy.get(':nth-child(' + i + ') > .answer-container > :nth-child(1) > .form-big-radio > .checkmark').click({ force: true })
    //     }

    //     cy.get('.row-shadowed > .step-title').should('have.text', 'CUESTIONARIO PARA LA ADECUACIÓN DE LA COBERTURA DE SEGURO ')
    //     cy.get('.subtext').should('have.text', '* campos obligatorios')
    //     cy.get(':nth-child(1) > .question')
    //         .should('have.text', '¿Está interesado en recibir ayuda si necesita ayuda mientras practica un deporte de invierno?')
    //     cy.get(':nth-child(2) > .question')
    //         .should('have.text', '¿Está interesado en protegerse tanto del daño que ha sufrido como del daño que ha causado al practicar un deporte de invierno?')
    //     cy.get(':nth-child(3) > .question')
    //         .should('have.text', '¿Sabe que la cobertura sólo es válida para deportes de invierno amateur en instalaciones o áreas utilizadas para este fin?')
    //     cy.get(':nth-child(4) > .question')
    //         .should('have.text', '¿Conoce usted alguna exclusión de cobertura en el conjunto de la información precontractual? (descargar)')
    //     cy.get(':nth-child(5) > .question')
    //         .should('have.text', '¿Conoce la presencia de límites máximos, franquicias y descubiertos en el conjunto de información precontractual? (descargar)')
    //     cy.get(' .row-shadowed > :nth-child(4)')
    //         .should('have.text', ' El Tomador declara haber respondido completa y verazmente al cuestionario para evaluar la idoneidad del contrato, asumiendo toda la responsabilidad y confirmando que el contrato propuesto cumple con sus propias necesidades de seguro. ')
    //     cy.get('.mt-3')
    //         .should('have.text', 'FECHA: ' + todaysDate)

    //     cy.get('#continuaStep3_test').should('not.have.class', 'disabled')
    //         .click({ force: true })
    // })


    it('T-71(1) Wording Fase 4', () => {

        cy.get('app-checkout-card-recap > :nth-child(1) > :nth-child(1) > .step-title').contains(' Yolo esquí Gold ')
        cy.get('.col-lg-10 > :nth-child(1) > :nth-child(1)').contains('Tipo de paquete:')
        cy.get(':nth-child(1) > :nth-child(2) > b').contains('Yolo esquí Gold')
        cy.get('.col-lg-10 > :nth-child(2) > :nth-child(1)').contains('Asegurados:')
        cy.get('app-checkout-card-contraente-recap > :nth-child(1) > :nth-child(1) > .title').contains(' Datos personales ')
        cy.get('app-checkout-card-survey-recap > :nth-child(1) > :nth-child(1) > .title').contains('Cuestionario')

    })


    it('(2) Wording Fase 4', () => {
        cy.get('.mt-3 > .row > .col-lg-10').contains(' Completado ')
        cy.get('h4.step-title').contains('PAGO')
        cy.get('h4.step-title').siblings('span').contains('* campos obligatorios')
        cy.get('.col-lg-6').contains('Agregar una tarjeta de crédito')
        cy.get(':nth-child(5) > .row > .btn').contains('Agregar')
        cy.get('.row.ng-untouched > :nth-child(1) > :nth-child(1) > .col-12 > .step-title').contains('¿Tiene un código de descuento / afiliado?')
        cy.get('.form-label-group > .btn').contains('Aplicar')
        cy.get('form.ng-untouched > :nth-child(1) > .step-title').contains('IMPORTANTE')
        cy.get('form.ng-untouched > :nth-child(2)').contains(' Para continuar, descargue los tres archivos adjuntos y acepte las siguientes condiciones: ')


    })


    it('(3) Wording Fase 4 prima parte', () => {
        cy.get('form.ng-untouched > :nth-child(1) > .step-title').contains('IMPORTANTE')
        cy.get('form.ng-untouched > :nth-child(2)').contains('Para continuar, descargue los tres archivos adjuntos y acepte las siguientes condiciones:')

    })
    

    it('(3) Wording Fase 4 seconda parte1', () => {
        cy.get('app-checkout-step-payment > :nth-child(1) > :nth-child(1) > :nth-child(1)').contains('Declaro que he leído el')
        cy.get('app-checkout-step-payment > :nth-child(1) > :nth-child(1) > :nth-child(1)').contains('Modelo único de Información Precontractual')
        cy.get('app-checkout-step-payment > :nth-child(1) > :nth-child(1) > :nth-child(1)').contains('56 Reglamento IVASS No. 40/2018')
    })


    it('(3) Wording Fase 4 seconda parte2', () => {
        cy.get('form.ng-untouched').contains('Declaro que he leído el')
        cy.get('form.ng-untouched').contains('Documento de Información precontractual')
        cy.get('form.ng-untouched').contains('incluida la Política de privacidad, y acepto completamente las condiciones del seguro')
    })


    it('politica de privacidad', () => {
        cy.get('[data-new-window="true"]').invoke('attr', 'href').should('include', '/privacy')
    })


    it(' modelo informacion precontractual', () => {
        cy.route('GET', '/api/v1/documents/precontractual/send?email=be.e2e.test@gmail.com&name=Mario&surname=Rossi&productName=Yolo*').as('modelo')
        cy.get('[data-cy=chekout-step-payment__document-information-note-flag]').click({ force: true })
        cy.wait('@modelo').its('status').should('eq', 200)
    })


    it(' documento informacion precontractual', () => {
        cy.route('GET', '/api/v1/documents/infoSet/send?userId=64&productId=2').as('documento')
        cy.get('[data-cy=chekout-step-payment__document-privacy-policy-flag]').click({ force: true })
        cy.wait('@documento').its('status').should('eq', 200)
    })


    it('(4) Wording Fase 4', () => {
        cy.get('.d-none > .btn-secondary').contains('Volver')
        cy.get('#continuaStep4_test').contains('CONFIRMAR Y PAGAR')
        cy.get('[data-cy=shopping-cart__product-header]').contains('Yolo esquí Gold')
        cy.get('[data-cy=das-shopping-cart__costo-unitario-name]').contains('Costo Unitario')
        cy.get('[data-cy=das-shopping-cart__total-name]').contains('Total')
    })


    it('T-71 Immagini Fase4', () => {
        cy.get('.product-icon').invoke('attr', 'src').should('eq', 'https://yolo-es-integration.s3.amazonaws.com/spree/images/attachments/7/small/sci_gold.png?1574267336')
        cy.get('.anagraphic-icon').invoke('attr', 'src').should('eq', '/assets/images/icons/contraente.svg')
        cy.get('.survey-icon').invoke('attr', 'src').should('eq', '/assets/images/icons/questionario.svg')
    })


    it('T-72 Logout', () => {
        cy.get('.user-profile > a').click({ force: true })
        cy.get('.private-area-sidebar-menu-container > ul > :nth-child(6) > a').click({ force: true })
    })
})