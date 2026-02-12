import { Rule } from 'app/core/models/componentfeatures/rule.model';
import { DocumentRow } from 'app/core/models/componentfeatures/documentacceptance/document-row.model';
import { Converter } from './converter.interface';
import { ConstraintToRowConverter } from './constraint-to-row.converter';
import { Injectable } from '@angular/core';
import { CheckoutModule } from 'app/modules/checkout/checkout.module';

@Injectable({
    providedIn: 'root'
})
export class RuleToRowsConverter implements Converter<Rule, DocumentRow[]>{

    constructor(
        private constraintToRowConverter: ConstraintToRowConverter    
    ) {}

    convert(source: Rule): DocumentRow[] {
        const rows: DocumentRow[] = [];
        source.constraints.forEach(cons => rows.push(this.constraintToRowConverter.convert(cons)));

        return rows;
    }
    
}