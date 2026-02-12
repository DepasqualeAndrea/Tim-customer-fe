import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { DocumentAcceptance } from 'app/core/models/componentfeatures/documentacceptance/documentacceptance.model';
import { CheckoutModule } from 'app/modules/checkout/checkout.module';
import { ComponentFeaturesService } from 'app/core/services/componentFeatures.service';
import { ComponentToDocumentConverter } from './converters/component-to-document.converter';

@Injectable({
    providedIn: 'root'
})
export class DocumentAcceptanceService {
    constructor(
        private http: HttpClient,
        private componentFeatures: ComponentFeaturesService,
        private documentConverter: ComponentToDocumentConverter
    ) {}


    public getDocumentAcceptance(componentFeatureName: string, productCode: string): DocumentAcceptance {
        const documentAcceptanceComponent = this.componentFeatures.getComponent(componentFeatureName);

        this.documentConverter.ruleName = productCode;
        const documents: DocumentAcceptance = this.documentConverter.convert(documentAcceptanceComponent);

        return documents;
    }
}
