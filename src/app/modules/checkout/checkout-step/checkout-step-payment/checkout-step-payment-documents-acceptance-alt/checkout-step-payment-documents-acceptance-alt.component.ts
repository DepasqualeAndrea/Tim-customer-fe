import {Component, Input, OnInit} from '@angular/core';
import {AbstractControl, UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {DataService} from '@services';
import { ComponentFeaturesService } from 'app/core/services/componentFeatures.service';
import {KenticoTranslateService} from 'app/modules/kentico/data-layer/kentico-translate.service';
import {ToastrService} from 'ngx-toastr';
import {Observable, of} from 'rxjs';
import {catchError, take} from 'rxjs/operators';
import {CheckoutStepInsuranceInfoProduct} from '../../checkout-step-insurance-info/checkout-step-insurance-info.model';
import {CheckoutDocumentAcceptanceService} from '../checkout-step-payment-document-acceptance.service';
import {DocumentAcceptanceContent} from './document-acceptance-content.interface';

@Component({
    selector: 'app-checkout-step-payment-documents-acceptance-alt',
    templateUrl: './checkout-step-payment-documents-acceptance-alt.component.html',
    styleUrls: ['./checkout-step-payment-documents-acceptance-alt.component.scss'],
    standalone: false
})
export class CheckoutStepPaymentDocumentsAcceptanceAltComponent implements OnInit {

  @Input() product: CheckoutStepInsuranceInfoProduct;
  content: DocumentAcceptanceContent;
  form: UntypedFormGroup;
  private downloadEnabled: boolean;
  kenticoItem: any;
  withdrawContractEnabled: boolean = true;

  constructor(
    private kenticoTranslateService: KenticoTranslateService,
    private formBuilder: UntypedFormBuilder,
    private dataService: DataService,
    private documentAcceptanceService: CheckoutDocumentAcceptanceService,
    private toastrService: ToastrService,
    private componentFeaturesService: ComponentFeaturesService
  ) {
  }

  ngOnInit() {
    this.getContent();
    this.loadDocumentAcceptanceStrategies();
    this.showHideWithdrawContract();
    this.form = this.createForm();
    this.overrideContentByProduct();
  }

  private createForm(): UntypedFormGroup {
    return this.formBuilder.group({
      acceptInsuranceConditions: [false, Validators.requiredTrue]
    });
  }

  private getContent(): void {
    this.kenticoTranslateService.getItem<any>('alt_documents_acceptance').subscribe((item) => {
      this.kenticoItem = item;
      this.content = {
        title: item.title.value,
        description: this.addProductInfoSetLink(item.description.value),
        checkBoxLabel: this.addProductInfoSetLink(item.checkbox_label.value),
        labelledImage: {
          image: item.labelled_image.value[0] ? item.labelled_image.value[0].image.value[0].url : null,
          description: item.labelled_image.value[0] ? item.labelled_image.value[0].body.value : null
        }
      };
    });
  }

  showHideWithdrawContract() {
    if (!!this.documentAcceptanceService.getShowHideWithdrawContract()) {
      this.withdrawContractEnabled = false;
    }
  }

  private addProductInfoSetLink(content: string): string {
    const infoSet = this.dataService.product.product_structure.template_properties.informative_set;
    return content.replace('href="/set-info"', 'href="' + infoSet + '"');
  }

  public documentAcceptanceChanged(formControl: AbstractControl) {
    if (formControl.value === true) {
      this.documentAcceptanceService.documentAcceptance(this.downloadEnabled, this.product).pipe(catchError((err) => {
        this.kenticoTranslateService.getItem<any>('toasts.cannot_validate_document').pipe(take(1)).subscribe(
          toastMessage => this.toastrService.error(err.message, toastMessage.value)
        );
        return of(formControl.setValue(false));
      })).subscribe();
    }
  }

  private loadDocumentAcceptanceStrategies(): void {
    const targetComponent: string = this.documentAcceptanceService.getComponentNameByDBStrategies();
    this.downloadEnabled = this.documentAcceptanceService.checkDownloadEnabled(targetComponent);
  }

  private overrideContentByProduct(): void {
    this.componentFeaturesService.useComponent('checkout-step-payment');
    this.componentFeaturesService.useRule('alt-documents-acceptance');
    if (this.componentFeaturesService.isRuleEnabled()) {
      const constraints = this.componentFeaturesService.getConstraints().get('override-default-flags');
      const productContentConfig = constraints.find(constraint =>
        constraint.productCode === this.product.code
      );
      if (!!productContentConfig) {
        const contentToReplace = {
          title: this.getContentFromKenticoItem(productContentConfig.titleCodename),
          description: this.getContentFromKenticoItem(productContentConfig.descriptionCodename),
          checkBoxLabel: this.getContentFromKenticoItem(productContentConfig.checkBoxLabelCodename)
        };
        Object.assign(this.content, contentToReplace);
      }
    }
  }

  private getContentFromKenticoItem(codename: string): string | null {
    return this.kenticoItem[codename]
      ? this.kenticoItem[codename].value
      : null;
  }

}
