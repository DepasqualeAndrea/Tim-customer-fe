import { EventEmitter, Input, Output, Directive } from "@angular/core";
import { CheckoutStepInsuranceInfoProduct } from "../../checkout-step-insurance-info/checkout-step-insurance-info.model";
import { CheckoutStepPaymentDocumentsAcceptance } from "../checkout-step-payment.model";

@Directive()
export class DocumentsAcceptanceConfigs {
  @Input() product: CheckoutStepInsuranceInfoProduct;
  @Input() documentsAcceptance: CheckoutStepPaymentDocumentsAcceptance;
  @Input() informationPackage: string;
  @Input() secondaryInformativeSet = null;
  @Input() secondarySetDocumentName: string;
  @Input() doubleInformativeSet = null;
  @Input() doubleSetInfo: any;
  @Input() addQuixaConsent = false;
  @Input() hideTitle = false;
  @Input() hideDisclaimer = false;
  @Input() hideTitleSection = false;
  @Input() validationErrorsVisible = false;
  @Input() validationErrors: any[];
  @Input() showHeaderRows: boolean = true; 

  @Output() documentAcceptanceChangeEvent: EventEmitter<CheckoutStepPaymentDocumentsAcceptance> = new EventEmitter<CheckoutStepPaymentDocumentsAcceptance>();
}