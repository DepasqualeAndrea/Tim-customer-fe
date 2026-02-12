var env = Cypress.env() 
describe('T-91 Test Yolo Protezione Pandemia',()=>{

    beforeEach(()=>{
        cy.wait(1500)
    })
    
    it('T-91 Landing page',()=>{
        cy.visit(env.url+'/preventivatore;code=pmi-rbm-pandemic')
    
    })

    it('T-91 Action click',()=>{
        cy.get('[data-cy=pmi-pandemic-quotator__option-1-title]').click({force:true})
        cy.get('[data-cy=pmi-pandemic-quotator__add-insured-button]').click({force:true})
        cy.get('[data-cy=pmi-pandemic-quotator__add-insured-button]').click({force:true})
        cy.get('[data-cy=pmi-pandemic-quotator-addons__pndmc-b]').click({force:true})
        cy.get('[data-cy=pmi-pandemic-quotator-addons__pndmc-c]').click({force:true})


    })
    it('T-91 Quoting',()=>{
        cy.get('[data-cy=pmi-pandemic-quotator__quotation-price]').contains('46,60')
    })
    it('T-91 Click Acquista',()=>{
        cy.get('[data-cy=pmi-pandemic-quotator__purchase-button]').click({force:true})
    })
    it('T-91 Shopping Cart wording and price check', () => {
        cy.get('[data-cy=das-shopping-cart__product-header]').contains(' Yolo Protezione Pandemia ')
        cy.get('[data-cy=das-shopping-cart__durata-name]').contains('Durata')
        cy.get('[data-cy=das-shopping-cart__durata-value]').contains('1 ANNO')
        cy.get('[data-cy=das-shopping-cart__protezione-pandemia-name]').contains('Protezione Pandemia')
        cy.get('[data-cy=das-shopping-cart__protezione-pandemia-amount]').contains('17,80')
        cy.get('[data-cy=das-shopping-cart__consulenza-medica-telefonica-di-alta-specializzazione-name]').contains('Consulenza medica telefonica di alta specializzazione')
        cy.get('[data-cy=das-shopping-cart__consulenza-medica-telefonica-di-alta-specializzazione-amount]').contains('24,40')
        cy.get('[data-cy=das-shopping-cart__indennita-da-quarantena-obbligatoria--name]').should('have.text',' Indennità da quarantena obbligatoria	 ')
        cy.get('[data-cy=das-shopping-cart__indennita-da-quarantena-obbligatoria--amount]').contains('4,40')
        cy.get('[data-cy=das-shopping-cart__totale-prodotto-name]').should('have.text',' Totale prodotto ')
        cy.get('[data-cy=das-shopping-cart__totale-prodotto-amount]').contains('46,60')

    })
    

})

