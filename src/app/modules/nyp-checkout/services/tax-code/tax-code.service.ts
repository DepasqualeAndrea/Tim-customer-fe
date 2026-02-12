import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import moment from 'moment';
import { taxCodeMonths } from './utils/tax-code.constants';
import { Months } from './utils/tax-code.types';

@Injectable({ providedIn: 'root' })
export class TaxCodeService {

  taxCodeConsistencyValidator(
    nameField: string,
    surnamemeField: string,
    taxCodeField: string,
    birthDateField: string
  ): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const name = formGroup.get( nameField )?.value?.toUpperCase();
      const surname = formGroup.get( surnamemeField )?.value?.toUpperCase();
      const taxCode = formGroup.get( taxCodeField )?.value?.toUpperCase();
      let birthDate = formGroup.get( birthDateField )?.value;
      
      if(birthDate && !Array.isArray(birthDate) && typeof birthDate === 'object'){
        birthDate = this.formatDateFromDatepicker(birthDate);
      }

      if ( !taxCode || !name || !surname || !birthDateField || !moment( birthDate ).isValid() ) return null;

      const expectedsurname = this.generateSurnameCode(surname);
      const expectedName = this.generateNameCode( name );
      const expectedDays = this.generateDaysCode( birthDate );
      const expectedBirthYear = moment( birthDate ).format( 'YY' );
      const expectedMonth = this.generateMonthCode( birthDate );

      const actualsurname = this.extractSurnameFromTaxCode(taxCode);
      const actualName = this.extractNameFromTaxCode( taxCode );
      const actualDay = this.extractDayFromTaxCode( taxCode );
      const actualBirthYear = this.extractYearFromTaxCode( taxCode );
      const actualMonth = this.extractMonthFromTaxCode( taxCode );

      if (actualsurname !== expectedsurname || actualName !== expectedName || !expectedDays.includes( actualDay ) || actualBirthYear !== expectedBirthYear || actualMonth !== expectedMonth ) return { taxCodeMismatch: true };

      return null;
    };
  }

  private generateSurnameCode(surname: string): string {
    const taxCodeSurname = `${this.extractConsonants( surname )}${this.extractVowels( surname )}XXX`;
    return taxCodeSurname.slice( 0, 3 ).toUpperCase();
  }

  private generateNameCode(name: string): string {
    let taxCodeName = this.extractConsonants( name );
    if (taxCodeName.length >= 4) taxCodeName = taxCodeName.charAt( 0 ) + taxCodeName.charAt( 2 ) + taxCodeName.charAt( 3 );
    else {
      taxCodeName += `${this.extractVowels( name )}XXX`;
      taxCodeName = taxCodeName.slice( 0, 3 );
    }
    return taxCodeName.toUpperCase();
  }

  private generateDaysCode( birthDate: string ): string[] {
    const birthDay = moment( birthDate ).format( 'DD' );
    return [birthDay, ( +birthDay + 40 ).toString()];
  }
  
  private generateMonthCode( birthDate: string ): string {
    const birthMonth = moment( birthDate ).format( 'MM' ) as Months;
    return taxCodeMonths[birthMonth];
  }

  private extractVowels (value: string): string {
    return value.replace( /[^AEIOU]/gi, '' );
  }

  private extractConsonants (value: string): string {
    return value.replace( /[^BCDFGHJKLMNPQRSTVWXYZ]/gi, '' );
  }

  private extractSurnameFromTaxCode( taxCode: string ): string {
    return taxCode.slice( 0, 3 );
  }

  private extractNameFromTaxCode( taxCode: string ): string {
    return taxCode.slice( 3, 6 );
  }

  private extractDayFromTaxCode( taxCode: string ): string {
    return taxCode.slice( 9, 11 );
  }

  private extractYearFromTaxCode( taxCode: string ): string {
    return taxCode.slice( 6, 8 );
  }

  private extractMonthFromTaxCode( taxCode: string ): string {
    return taxCode.slice( 8, 9 );
  }

  private formatDateFromDatepicker(date: {[key:string]: string}){
    return `${date['year']}-${date['month']}-${date['day']}`;
  }

}
