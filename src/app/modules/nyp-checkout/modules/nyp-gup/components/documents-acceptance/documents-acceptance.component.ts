import { Component, Input, OnChanges, OnInit, SimpleChange, SimpleChanges } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { AuthService, DataService, InsurancesService } from '@services';
import { Observable } from 'rxjs';
import { catchError, take } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { DocumentAcceptance } from 'app/core/models/componentfeatures/documentacceptance/documentacceptance.model';
import { RichTextHtmlHelper } from 'app/modules/kentico/data-layer/helpers/rich-text-html.helper';

import { ContentElement } from 'app/core/models/componentfeatures/documentacceptance/content-element.model';
import { DocumentRow } from 'app/core/models/componentfeatures/documentacceptance/document-row.model';
import { KenticoEmptyPipeMap } from 'app/shared/pipe/services/kentico-empty-pipe-map.service';
import { of, zip } from 'rxjs';
import { ResponseOrder } from '@model';

import { ActivatedRoute, ParamMap } from '@angular/router';
import { UPSELLING_QUERY_PARAM } from 'app/shared/shared-queryparam-keys';

import { NypIadDocumentaryService, NypInsurancesService } from '@NYP/ngx-multitenant-core';
import { CheckoutStepInsuranceInfoProduct } from 'app/modules/checkout/checkout-step/checkout-step-insurance-info/checkout-step-insurance-info.model';
import { CheckoutDocumentAcceptanceService } from 'app/modules/checkout/checkout-step/checkout-step-payment/checkout-step-payment-document-acceptance.service';
import { CheckoutStepPaymentDocumentsAcceptanceComponent } from 'app/modules/checkout/checkout-step/checkout-step-payment/checkout-step-payment-documents-acceptance/checkout-step-payment-documents-acceptance.component';
import { DocumentsAcceptanceConfigs } from 'app/modules/checkout/checkout-step/checkout-step-payment/checkout-step-payment-documents-acceptance/documents-acceptance-configs';
import { DocumentAcceptanceService } from 'app/modules/checkout/checkout-step/checkout-step-payment/checkout-step-payment-documents-acceptance/services/document-acceptance.service';
import { CheckoutStepPaymentDocumentsAcceptance } from 'app/modules/checkout/checkout-step/checkout-step-payment/checkout-step-payment.model';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { ComponentFeaturesService } from 'app/core/services/componentFeatures.service';
import { LocaleService } from 'app/core/services/locale.service';

@Component({
  selector: 'app-documents-acceptance',
  templateUrl: './documents-acceptance.component.html',
  styleUrls: ['./documents-acceptance.component.scss']
})
export class DocumentsAcceptanceComponent extends DocumentsAcceptanceConfigs implements OnInit, OnChanges {


  @Input() product: CheckoutStepInsuranceInfoProduct;

  form: FormGroup;
  formCb: FormGroup;
  documentsAcceptanceConfig: DocumentAcceptance;
  private downloadEnabled = true;
  consentQuixa: string;
  order: ResponseOrder;
  contentItem: string = "checkout";
  queryParamMap: ParamMap;
  kenticoContent: any;
  haveBeenDownloaded: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private insurancesService: InsurancesService,
    protected nypInsurancesService: NypInsurancesService,
    public dataService: DataService,
    private toastrService: ToastrService,
    private kenticoTranslateService: KenticoTranslateService,
    public kenticoEmpty: KenticoEmptyPipeMap,
    private documentAcceptanceService: DocumentAcceptanceService,
    public locale: LocaleService,
    private componentFeaturesService: ComponentFeaturesService,
    private checkoutDocumentAcceptanceService: CheckoutDocumentAcceptanceService,
    private route: ActivatedRoute,
    private auth: AuthService,
    private nypIadDocumentaryService: NypIadDocumentaryService,
  ) { super() }

  ngOnInit() {
    this.queryParamMap = this.route.snapshot.queryParamMap;
    this.order = this.dataService.getResponseOrder();
    this.loadDocumentAcceptance();
    // if (!!this.addQuixaConsent) {
    //   this.getQuixaConsentLabelFlag();
    // }
    this.documentAcceptanceChangeEvent.emit(this.form.value);
    this.kenticoTranslateService.getItem<any>('checkout').pipe(take(1)).subscribe((item) => {
      this.kenticoContent = item;
      console.log(this.kenticoContent)
    });
  }

  /**
   * Get flags from componentFeatures and create the model in this component binded to view
   */
  private loadDocumentAcceptance() {
    const targetComponent: string = this.checkoutDocumentAcceptanceService.getComponentNameByDBStrategies();
    this.documentsAcceptanceConfig = this.documentAcceptanceService.getDocumentAcceptance(targetComponent, "tim-my-home");
    if (this.auth.loggedIn && this.auth.loggedUser.data && this.auth.loggedUser.data.tim_user_type && this.auth.loggedUser.data.tim_user_type === 'ftth') {
      this.documentsAcceptanceConfig.rows.forEach(row => {
        if (row.elements !== undefined) {
          row.elements.forEach(el => el.kenticoCodename === 'document_acceptance_myhome' ? el.kenticoCodename = 'document_acceptance_myhome_ftth' : el.kenticoCodename)
        }
      })
    }
    let downloadDocument = this.getCheckDownloadDocument(targetComponent, "tim-my-home");
    if (downloadDocument) {
      if (!this.queryParamMap.has(UPSELLING_QUERY_PARAM)) {
        this.documentsAcceptanceConfig.rows.forEach(row => {
          if (row.elements !== undefined) {
            row.elements.forEach(el => el.controlName === 'document_acceptance_myhome' ? el.fnName = 'downloadFileFromElementLink' : el.fnName)
          }
        })
      }
    }

    this.downloadEnabled = this.checkoutDocumentAcceptanceService.checkDownloadEnabled(targetComponent);
    this.setMissingContent();

    this.form = this.formBuilder.group(this.fromModelToView(this.documentsAcceptance));

    Object.entries(this.form.controls).filter(controlEntry => {
      const controlEntryKey: string = controlEntry[0]
      return controlEntryKey !== 'paperCopyRequest'
    }).forEach(controlEntry => {
      const controlEntryValue: AbstractControl = controlEntry[1]
      return controlEntryValue.setValidators(Validators.requiredTrue)
    });

    if (this.addQuixaConsent) {
      this.form.addControl('quixaConsentControl', new FormControl(false, Validators.requiredTrue));
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.documentsAcceptance && !changes.documentsAcceptance.firstChange) {
      this.form.patchValue(this.fromModelToView(this.documentsAcceptance));
    }
    if (this.hasHeaderRowsVisibilityBeenUpdated(changes)) {
      this.updateHeaderRowsValidators(changes.showHeaderRows)
    }
  }

  private hasHeaderRowsVisibilityBeenUpdated(changes: SimpleChanges): boolean {
    return !!changes.showHeaderRows && changes.showHeaderRows.previousValue
  }

  private updateHeaderRowsValidators(change: SimpleChange): void {
    const formControl = this.form.controls['charge_paycheck'];
    if (!!formControl) {
      !change.currentValue ? formControl.disable() : formControl.enable();
      this.form.updateValueAndValidity();
    }
  }

  public documentAcceptanceChanged(element: any, fnCallback: Function, form: FormGroup): void {
    const downloadFile = (document: { filename: string, remoteUrl: string }) => {
      this.nypIadDocumentaryService.downloadFileFromUrl({ filename: document.filename, remoteUrl: document.remoteUrl })
        .subscribe(b => saveAs(b, document.filename));
    };

    if (!this.haveBeenDownloaded && Object.entries(form.value).every(([key, value]) => !!value || key == "quixaConsentControl")) {
      this.haveBeenDownloaded = true;
      console.log("TODO: aggiungere su Kentico")
      Object.entries({
        "additionalDocument1": "https://tim-broker-customers-documents.s3.eu-central-1.amazonaws.com/Informativa_precontrattuale_vendita_a_distanza_Danni_20190101.pdf",
        "additionalDocument2": "https://tim-customers-production.s3.amazonaws.com/spree/products/conditions_packages/000/000/003/original/Multigaranzia_TIM_Completo_LogoTIM_20211110.pdf",
        "attachment_3_4": "https://tim-broker-customers-documents.s3.eu-central-1.amazonaws.com/Allegati_3_4_4ter.pdf",
        "informative_set": "https://tim-customers-staging.s3.eu-central-1.amazonaws.com/spree/products/information_packages/000/000/008/original/Assistenza_TIM_Completo_LogoTIM.pdf",
        "privacy_documentation_link": "https://tim-broker-customers-documents.s3.eu-central-1.amazonaws.com/Informativa+Privacy.pdf",
        "show_addons_in_shopping_cart": false,
        "thumbnail": false
      })
        .filter(([key, value]) => String(value).includes('https://') && String(value).includes('.pdf'))
        .forEach(([key, value]) => downloadFile({ filename: String(value).split('/').pop(), remoteUrl: String(value) }));
    }

    this.documentAcceptanceChangeEvent.emit(form.value);
  }

  downloadFileFromElementLink(element: ContentElement): Observable<any> {
    if (!this.downloadEnabled) {
      return of(null);
    }
    return this.checkoutDocumentAcceptanceService.download(element);
  }

  private getAllContentElements(): ContentElement[] {
    return this.documentsAcceptanceConfig.rows
      .map(row => row.elements)
      .filter(el => !!el)
      .reduce((curr, prev) => prev.concat(curr), []);
  }

  private getAllFormControlElements(): ContentElement[] {
    return this.getAllContentElements().filter(element => element.type !== 'content');
  }

  private fromModelToView(model: CheckoutStepPaymentDocumentsAcceptance): { [key: string]: any } {
    const doc: CheckoutStepPaymentDocumentsAcceptance = Object.assign({}, model);
    const view: { [key: string]: any } = {};
    this.getAllFormControlElements().forEach(element => {
      Object.assign(view, { [element.controlName]: doc[element.controlName] || false });
    });
    if (this.hasPaperyDoc()) {
      Object.assign(view, { paperCopyRequest: doc.paperCopyRequest || false });
    }
    return view;
  }

  getFnCallback(functionName: string): Function {
    return CheckoutStepPaymentDocumentsAcceptanceComponent.prototype[functionName];
  }

  documentAcceptanceIntesaPet(): Observable<any> {
    return this.checkoutDocumentAcceptanceService.documentAcceptance(
      this.downloadEnabled,
      this.product,
      this.doubleInformativeSet,
      this.secondaryInformativeSet,
      this.secondarySetDocumentName
    )
  }

  documentsAcceptanceMyPet(): Observable<any> {
    const files: Observable<any>[] = [
      this.checkoutDocumentAcceptanceService.getPrecontractualInfoFile(
        this.downloadEnabled,
        this.doubleInformativeSet,
        this.secondaryInformativeSet,
        this.secondarySetDocumentName
      ),
      this.checkoutDocumentAcceptanceService.getInfoSetFile(this.downloadEnabled, this.product)
    ];
    return zip(...files);
  }

  acceptPrivacyPolicy(): Observable<any> {
    return this.checkoutDocumentAcceptanceService.getInfoSetFile(this.downloadEnabled, this.product)
  }

  acceptInformation(): Observable<any> {
    return this.checkoutDocumentAcceptanceService.getPrecontractualInfoFile(
      this.downloadEnabled,
      this.doubleInformativeSet,
      this.secondaryInformativeSet,
      this.secondarySetDocumentName
    )
  }

  setTimEmployeesCheckoutTimestamp() {
    return this.insurancesService.updateTimEmployeesCheckoutTimestamp(this.product.lineItemId);
  }

  getQuixaConsentLabelFlag(): void {
    this.nypInsurancesService.getQuixaConsent().subscribe(consent => {
      this.consentQuixa = consent;
    });
  }

  private setKenticoContentItemDocumentAcceptance(): string {
    this.componentFeaturesService.useComponent('checkout-step-payment');
    this.componentFeaturesService.useRule('per-product-document-acceptance-text');
    if (this.componentFeaturesService.isRuleEnabled()) {
      this.contentItem = this.componentFeaturesService.getConstraints().get(this.product.code);
    }
    return this.contentItem;
  }

  setMissingContent() {
    // const addons = this.order.line_items[0].addons;
    // const assistance = addons.find(addon => addon.code === 'A');
    // const multirisk = addons.find(addon => addon.code !== 'A');

    const templateProperties = {
      "additionalDocument1": "https://tim-broker-customers-documents.s3.eu-central-1.amazonaws.com/Informativa_precontrattuale_vendita_a_distanza_Danni_20190101.pdf",
      "additionalDocument2": "https://tim-customers-production.s3.amazonaws.com/spree/products/conditions_packages/000/000/003/original/Multigaranzia_TIM_Completo_LogoTIM_20211110.pdf",
      "attachment_3_4": "https://tim-broker-customers-documents.s3.eu-central-1.amazonaws.com/Allegati_3_4_4ter.pdf",
      "informative_set": "https://tim-customers-staging.s3.eu-central-1.amazonaws.com/spree/products/information_packages/000/000/008/original/Assistenza_TIM_Completo_LogoTIM.pdf",
      "privacy_documentation_link": "https://tim-broker-customers-documents.s3.eu-central-1.amazonaws.com/Informativa+Privacy.pdf",
      "show_addons_in_shopping_cart": false,
      "thumbnail": false
    }
    const productPrivacy = !!templateProperties && templateProperties.privacy_documentation_link || '/privacy';
    const infoSet = this.secondaryInformativeSet
      ? this.secondaryInformativeSet
      : !!templateProperties && templateProperties.informative_set || '#';
    const attachment3_4 = templateProperties.attachment_3_4 || '#';
    const contentItem = this.setKenticoContentItemDocumentAcceptance();


    this.kenticoTranslateService.getItem(contentItem).subscribe(content => {
      this.getAllContentElements().forEach(element => {
        const dataElement = content[element.kenticoCodename];
        let elementValue: string;
        if (!dataElement) {
          console.log(`Cannot find ${element.kenticoCodename} inside kentico path ${contentItem}.`, JSON.stringify(content));
        }
        if (dataElement.type === 'text') {
          elementValue = dataElement.value;
        } else {
          elementValue = RichTextHtmlHelper.computeHtml(dataElement);
        }

        // replace links if any
        if (this.doubleInformativeSet) {
          if (true) {
            elementValue = elementValue
              .replace('href="/privacy"', 'href="' + productPrivacy + '"')
              .replace('href="/info_set"', 'href="' + this.doubleInformativeSet.setOne + '"onclick="window.open(\' ' + this.doubleInformativeSet.setTwo + ' \');"')
              .replace('href="/attachment_3_4"', 'href="' + attachment3_4 + '"');

            element.kenticoValue = elementValue;
          }
          // } else if (assistance) {
          //   elementValue = elementValue
          //     .replace('href="/privacy"', 'href="' + productPrivacy + '"')
          //     .replace('href="/info_set"', 'href="' + this.doubleInformativeSet.setOne + '"')
          //     .replace('href="/attachment_3_4"', 'href="' + attachment3_4 + '"');

          //   element.kenticoValue = elementValue;
          // } else if (multirisk) {
          //   elementValue = elementValue
          //     .replace('href="/privacy"', 'href="' + productPrivacy + '"')
          //     .replace('href="/info_set"', 'href="' + this.doubleInformativeSet.setTwo + '"')
          //     .replace('href="/attachment_3_4"', 'href="' + attachment3_4 + '"');

          //   element.kenticoValue = elementValue;
          // }
        } else {
          elementValue = elementValue
            .replace('href="/privacy"', 'href="' + productPrivacy + '"')
            .replace('href="/info_set"', 'href="' + infoSet + '"')
            .replace('href="/attachment_3_4"', 'href="' + attachment3_4 + '"');
        } if (attachment3_4) {
          elementValue = elementValue
            .replace('href="/attachment_3_4"', 'href="' + attachment3_4 + '"');

          element.kenticoValue = elementValue;
        }

        if (this.validationErrors) {
          const errorValue = this.validationErrors[element.errorCodename];
          element.errorValue = errorValue;
        }
      });
    });

  }

  hasPaperyDoc(): boolean {
    return this.documentsAcceptanceConfig.paperyDocs.enabled;
  }

  isFormValid(): boolean {
    return !!this.form && this.form.valid;
  }

  getRows(): DocumentRow[] {
    const configRows = this.documentsAcceptanceConfig.rows;
    const headerRowNames = this.getHeaderRowsNames();
    if (headerRowNames.length > 0) {
      const rows = configRows.filter(row =>
        headerRowNames.some(rowName => rowName !== row.rowName)
      );
      return rows;
    }
    return configRows;
  }

  getHeaderRows(): DocumentRow[] {
    const configRows = this.documentsAcceptanceConfig.rows;
    const headerRowNames = this.getHeaderRowsNames();
    if (headerRowNames.length > 0) {
      const rows = configRows.filter(row =>
        headerRowNames.some(rowName => rowName === row.rowName)
      );
      return rows;
    }
    return null;
  }

  getHeaderRowsNames(): string[] {
    this.componentFeaturesService.useComponent('checkout-step-payment-documents-acceptance-component');
    this.componentFeaturesService.useRule('rows-header');
    if (this.componentFeaturesService.isRuleEnabled()) {
      return this.componentFeaturesService.getConstraints().get('row-names');
    }
    return [];
  }

  getCheckDownloadDocument(componentFeatureName: string, productCode: string): boolean {
    this.componentFeaturesService.useComponent(componentFeatureName);
    this.componentFeaturesService.useRule(productCode);
    if (this.componentFeaturesService.isRuleEnabled()) {
      return this.componentFeaturesService.getConstraints().get('download_document_acceptance_myhome');
    }
    return false;
  }

  noop() { }

}
