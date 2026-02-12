var env = Cypress.env()

describe('T-86 test_yolo_sportspagna_Ageprice', () =>{
  const todaysDate = Cypress.moment().format('DD/MM/')

      beforeEach('Wait 2 seconds',()=>{
        cy.wait(2000)
      })
   
      it('T-86 Visit Sport', ()=>{
        cy.visit(env.url+'/preventivatore;code=chubb-deporte-rec,chubb-deporte')
      })

      it('T-86 Select Bowling', ()=>{
        cy.get('[data-cy=sport-quotator__select-sport]').select("BOWLING")
      })

      it('T-86 Select Age',()=>{
        cy.get('[data-cy=sport-quotator__select-insureds-age]').click({force: true})
        cy.get('[data-cy=age-selector__number-of-insureds-25-add]').click({ force : true })
        cy.get('[data-cy=age-selector__number-of-insureds-25-display]').invoke('val').should('be.equal','1')
      })

      it('T-86 Click Aplicar',()=>{
          cy.get('[data-cy=age-selector__submit-button]').click({ force : true })
      })

      it('T-86 Add Addon and Dias',()=>{
        cy.get('[data-cy=sport-quotator__sport-equip-button]').click({ force : true })
        cy.get('[data-cy=sport-quotator__7-days-button]').click({ force : true })
      })

      it('T-86 Controllo Prezzo',()=>{
        cy.get('[data-cy=sport-quotator__quotation-price]').contains('4,67 €')
      })

      it('T-86 Continuar',()=>{
        cy.get('[data-cy=sport-quotator__purchase-button]').click({ force : true })          
      })

      it('T-86 Controllo Prezzi Shopping Cart',()=>{
        cy.get('[data-cy=das-shopping-cart__yolo-sport-amount]').contains('3,50 €')
        cy.get('[data-cy=das-shopping-cart__equipamiento-deportivo-amount]').contains('1,17 €')
        cy.get('[data-cy=das-shopping-cart__total-amount]').contains('4,67 €')
      })

      it('T-86 Click sulla checkbox', ()=>{
        cy.get('[data-cy=chekout-step-info__instant-checkbox]').check() //click sulla checkbox 
        cy.get('[data-cy=chekout-step-info__insure-instant-info]').should('be.visible') //controllo che venga mostrato chekout-step-info__insure-instant-info
      })

      it('T-86 Compilazione form anni da 4 a 24', ()=>{
        cy.get('[data-cy=chekout-step-info__insured-1-first-name]').type('Pedro') //assegno il nome Pedro
        cy.get('[data-cy=chekout-step-info__insured-1-last-name]').type('Perez') //assegno il cognome Pedro
        cy.get('[data-cy=chekout-step-info__insured-1-birth-date]').clear().type(todaysDate+'2016') //assegno la data
        cy.get('[data-cy=chekout-step-info__insured-1-family-grade]').select('Hijo/Hija')//seleziono hijo/hija
        cy.get('[data-cy=chekout-step-info__continue-button]').click({force:true})//click su continuar
      })
      
      it('T-86 Controllo importi corretti shopping cart', ()=>{
        cy.get('[data-cy=das-shopping-cart__yolo-sport-amount]').contains('3,50 €')
        cy.get('[data-cy=das-shopping-cart__equipamiento-deportivo-amount]').contains('1,17 €')
        cy.get('[data-cy=das-shopping-cart__total-amount]').contains('4,67 €')
      })

      it('T-86 Ritorno allo step precendente', ()=>{
        cy.get('[data-cy=das-checkout-address__back-button-login]').click({force: true})     
        
      })

      it('T-86 Compilazione form', ()=>{
        cy.get('[data-cy=chekout-step-info__insured-1-first-name]').type('Pedro') //assegno il nome Pedro
        cy.get('[data-cy=chekout-step-info__insured-1-last-name]').type('Perez') //assegno il cognome Pedro
        cy.get('[data-cy=chekout-step-info__insured-1-birth-date]').focus().clear().type(todaysDate+'1956') //assegno la data
        cy.get('[data-cy=chekout-step-info__insured-1-family-grade]').select('Hijo/Hija')//seleziono hijo/hija
        cy.get('[data-cy=chekout-step-info__continue-button]').click({force: true})//click su continuar
      })
      
      it('T-86 Controllo importi cambiando fascia età',() =>{
        cy.wait(1000)
        cy.get('[data-cy=das-shopping-cart__yolo-sport-amount]').contains('4,78 €')//should('have.text','4,78 €')
        cy.get('[data-cy=das-shopping-cart__equipamiento-deportivo-amount]').contains('1,59 €')
        cy.get('[data-cy=das-shopping-cart__total-amount]').contains('6,37 €')
        cy.get('[data-cy=shopping-cart__price-change-reason-label]').should('be.visible')
      })
      


 })




