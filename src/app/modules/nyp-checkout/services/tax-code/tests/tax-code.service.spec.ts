import { TestBed } from '@angular/core/testing';

import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import moment from 'moment';
import { TaxCodeService } from '../tax-code.service';

describe('TaxCodeService', () => {
  let service: TaxCodeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaxCodeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  } );

  describe( 'taxCodeConsistencyValidator', () => {
    it( 'should return null for valid tax code consistency', () => {
      const formGroup = new UntypedFormGroup( {
        name: new UntypedFormControl( 'Mario' ),
        surname: new UntypedFormControl( 'Rossi' ),
        taxCode: new UntypedFormControl( 'RSSMRA85M01H501Z' ),
        birthDate: new UntypedFormControl( moment( '1985-08-01' ).toISOString() )
      } );

      const validatorFn = service.taxCodeConsistencyValidator( 'name', 'surname', 'taxCode', 'birthDate' );
      const result = validatorFn( formGroup );

      expect( result ).toBeNull();
    } );

    it('should return an error for mismatched surname code', () => {
      const formGroup = new UntypedFormGroup({
        name: new UntypedFormControl('Mario'),
        surname: new UntypedFormControl('Verdi'),
        taxCode: new UntypedFormControl('RSSMRA85M01H501Z'),
        birthDate: new UntypedFormControl(moment('1985-08-01').toISOString())
      });
      const validatorFn = service.taxCodeConsistencyValidator('name', 'surname', 'taxCode', 'birthDate');
      const result = validatorFn(formGroup);

      expect(result).toEqual({ taxCodeMismatch: true });
    } );

    it('should return an error for mismatched birth date', () => {
      const formGroup = new UntypedFormGroup({
        name: new UntypedFormControl('Mario'),
        surname: new UntypedFormControl('Rossi'),
        taxCode: new UntypedFormControl('RSSMRA85M01H501Z'),
        birthDate: new UntypedFormControl(moment('1990-08-01').toISOString())
      });

      const validatorFn = service.taxCodeConsistencyValidator('name', 'surname', 'taxCode', 'birthDate');
      const result = validatorFn(formGroup);

      expect(result).toEqual({ taxCodeMismatch: true });
    } );

    it('should return null if tax code field is empty', () => {
      const formGroup = new UntypedFormGroup({
        name: new UntypedFormControl('Mario'),
        surname: new UntypedFormControl('Rossi'),
        taxCode: new UntypedFormControl(''),
        birthDate: new UntypedFormControl(moment('1985-08-01').toISOString())
      });

      const validatorFn = service.taxCodeConsistencyValidator('name', 'surname', 'taxCode', 'birthDate');
      const result = validatorFn(formGroup);

      expect(result).toBeNull();
    });
  } );

  describe('private methods', () => {
    it('should generate correct surname code', () => {
      const result = (service as any).generateSurnameCode('Rossi');
      expect(result).toBe('RSS');
    });

    it('should generate correct name code', () => {
      const result = (service as any).generateNameCode('Mario');
      expect(result).toBe('MRA');
    });

    it('should generate correct month code', () => {
      const result = (service as any).generateMonthCode('1985-08-01');
      expect(result).toBe('M');
    });

    it('should generate correct day codes', () => {
      const result = (service as any).generateDaysCode('1985-08-01');
      expect(result).toEqual(['01', '41']);
    });

    it('should extract correct surname from tax code', () => {
      const result = (service as any).extractSurnameFromTaxCode('RSSMRA85M01H501Z');
      expect(result).toBe('RSS');
    });

    it('should extract correct name from tax code', () => {
      const result = (service as any).extractNameFromTaxCode('RSSMRA85M01H501Z');
      expect(result).toBe('MRA');
    });

    it('should extract correct day from tax code', () => {
      const result = (service as any).extractDayFromTaxCode('RSSMRA85M01H501Z');
      expect(result).toBe('01');
    });
  });
});
