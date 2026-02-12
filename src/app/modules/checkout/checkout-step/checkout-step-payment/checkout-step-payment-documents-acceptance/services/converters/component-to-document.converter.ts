import { Injectable } from '@angular/core';
import { DocumentAcceptance } from 'app/core/models/componentfeatures/documentacceptance/documentacceptance.model';
import { Converter } from './converter.interface';
import { CheckoutModule } from 'app/modules/checkout/checkout.module';
import { Component } from 'app/core/models/componentfeatures/component.model';
import { ComponentFeaturesService } from 'app/core/services/componentFeatures.service';
import { Rule } from 'app/core/models/componentfeatures/rule.model';
import { RuleToRowsConverter } from './rule-to-rows.converter';
import {DocumentRow} from '../../../../../../../core/models/componentfeatures/documentacceptance/document-row.model';
import {Rules} from '../../../../../../../core/models/componentfeatures/rules.model';

@Injectable({
    providedIn: 'root'
})
export class ComponentToDocumentConverter implements Converter<Component, DocumentAcceptance> {
    private _ruleName: string = 'rows';

    set ruleName(name: string) {
      this._ruleName = name;
    }
    get ruleName(): string {
      return this._ruleName;
    }

    constructor(
        private ruleToRows: RuleToRowsConverter,
        private componentFeaturesService: ComponentFeaturesService
    ) {}

    private getRule(source: Component): Rule {
      const rules: Rules = this.componentFeaturesService.getRules(source);
      const ruleIndex: number = rules.findIndex(rule => new RegExp(rule.name).test(this.ruleName));
      if(ruleIndex >= 0) {
        return rules[ruleIndex];
      }

      return this.componentFeaturesService.getRule('rows', source);
    }

    convert(source: Component): DocumentAcceptance {
        const doc: DocumentAcceptance = new DocumentAcceptance();
        const rowsRule: Rule = this.getRule(source);
        if(!!rowsRule) {
            doc.rows = this.ruleToRows.convert(rowsRule);
        } else {
            doc.rows = [];
        }

        // papery doc
        const paperyIndex: number = doc.rows.findIndex(row => row.rowName === 'papery-doc');
        if(paperyIndex >= 0) {
            doc.paperyDocs = doc.rows[paperyIndex];
            doc.rows.splice(paperyIndex, 1);
        } else {
          doc.paperyDocs = new DocumentRow();
          doc.paperyDocs.enabled = false;
        }
        return doc;
    }

}
