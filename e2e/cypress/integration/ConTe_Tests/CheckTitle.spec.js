// <reference types="cypress" />

describe('CheckTitle', function () {

    it('visit', function () {
      cy.visit('https://conte-viaggi-sys.yolo-insurance.com/');
      cy.get('head').contains('conte')
      
      

    });
});