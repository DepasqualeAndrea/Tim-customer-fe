describe('QuotatorLegacyTest', function () {

    it('visit', function () {
      cy.visit('https://conte-viaggi-sys.yolo-insurance.com/');
    })

    beforeEach(function () {
      cy
      .request('GET', 'https://conte-viaggi-sys.yolo-insurance.com/api/legacy/axa/areas')
      .then((response) => {
        expect(response.body).to.be.an('object')
      })
    })

    it('compile-data', function (){
      cy.get('#inizioViaggio_test32').click()
      cy.get('ngb-datepicker').find('.ngb-dp-day').not('.disabled').first().click({force: true})
      cy.get('#fineViaggio_test32').click()
      cy.get('ngb-datepicker').find('.ngb-dp-day').not('.disabled').first().click({force: true})

    })

    it('Select', function (){
      cy.get('#selectDestination_test32').select('Cuba', {force: true});
    })

   it('click', function () {
    cy.get('#procediOra32').click({force: true})

    cy.wait(20000).then(() => {
      cy.url().should('eq', 'https://staging.yolo-insurance.com/dashboard/checkout')
    })
   })
});

