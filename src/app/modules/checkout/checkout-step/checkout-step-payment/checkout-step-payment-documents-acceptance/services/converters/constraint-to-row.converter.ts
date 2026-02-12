import { Converter } from './converter.interface';
import { Constraint } from 'app/core/models/componentfeatures/constraint.model';
import { DocumentRow } from 'app/core/models/componentfeatures/documentacceptance/document-row.model';
import { Injectable } from '@angular/core';
import { CheckoutModule } from 'app/modules/checkout/checkout.module';

@Injectable({
    providedIn: 'root'
})
export class ConstraintToRowConverter implements Converter<Constraint, DocumentRow> {
    convert(source: Constraint): DocumentRow {
      const row: DocumentRow = new DocumentRow();
      Object.assign(row, source.value);
      return row;
    }

}
