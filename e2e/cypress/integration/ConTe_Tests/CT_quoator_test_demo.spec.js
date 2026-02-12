describe('QuotatorLegacyTest', function () {

    it('visit', function () {
      cy.visit('https://conte-viaggi-demo.yolo-insurance.com/');

    })

    beforeEach(function () {
        cy
        .request('GET', 'https://viaggi.conte.it/api/v1/tenantInfo')
        .then((response) => {
          expect(response.body).to.be.an('object');
         })
          cy
        .request('GET','https://conte-viaggi-sys.yolo-insurance.com/api/legacy/axa/areas')
        .then((response) => {
          expect(response.body).to.be.an('object');
        })
      })

    it('compile-data', function (){
      cy.get('.cnt-input').click()
      cy.get('ngb-datepicker').find('.ngb-dp-day').not('.disabled').first().click({force: true})
      cy.get('#axa-assistance-gold > div[_ngcontent-c10=""] > app-viaggi-ct > .simulator > .input-container > :nth-child(2) > .date').click()
      cy.get('ngb-datepicker').find('.ngb-dp-day').not('.disabled').first().click({force: true})
     
    })

    it('Select', function (){
      cy.get('#select-destination.form-item__element.form-item__element--select').eq(1).select('Cuba', {force: true});
    })

   it('click', function () {
    cy.get('#axa-assistance-gold > div[_ngcontent-c10=""] > app-viaggi-ct > .simulator > .row-submit > .conte--btn').click({force: true})
    
    cy.wait(20000).then(() => {
      cy.url().should('eq', 'https://staging.yolo-insurance.com/dashboard/checkout')
    })
    
   })
});  

