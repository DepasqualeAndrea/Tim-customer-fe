import { Injectable } from '@angular/core';
import { forkJoin, Observable, of, zip } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { AuthService, DataService, InsurancesService, UtilsService } from '@services';
import { CheckoutStepInsuranceInfoProduct } from '../checkout-step-insurance-info/checkout-step-insurance-info.model';
import { DoubleInfoSet } from './checkout-linear-stepper-payment-redirect/checkout-linear-stepper-payment-redirect-gup/checkout-linear-stepper-payment-redirect-gup.component';
import { ContentElement } from 'app/core/models/componentfeatures/documentacceptance/content-element.model';
import { ComponentFeaturesService } from 'app/core/services/componentFeatures.service';
import { ParsedDocument } from 'app/core/services/utils.model';
import { ToastrService } from 'ngx-toastr';
import { NypInsurancesService, NypUtilsService } from '@NYP/ngx-multitenant-core';

@Injectable({
  providedIn: 'root'
})
export class CheckoutDocumentAcceptanceService {

  constructor(
    private insurancesService: InsurancesService,
    private authService: AuthService,
    private dataService: DataService,
    private utilService: UtilsService,
    protected nypInsurancesService: NypInsurancesService,
    protected nypUtilsService: NypUtilsService,
    private toastr: ToastrService,
    private componentFeaturesService: ComponentFeaturesService
  ) { }

  public download(element: ContentElement): Observable<ParsedDocument> {
    return this.nypUtilsService.downloadFromLink(element.documentLink, element.documentName).pipe(
      map(response => this.utilService.parseDocumentResponse(response)),
      tap(file => this.utilService.saveFile(file))
    )
  }

  public documentAcceptance(
    downloadEnabled: boolean,
    product: CheckoutStepInsuranceInfoProduct,
    doubleInformativeSet: DoubleInfoSet = null,
    secondaryInformativeSet: string = null,
    secondarySetDocumentName: string = null
  ): Observable<any> {

    if (this.dataService.tenantInfo.tenant !== 'banco-desio_db'
      && this.dataService.tenantInfo.tenant !== 'civibank_db') {
      const files: Observable<any>[] = [
        this.getPrecontractualInfoFile(downloadEnabled, doubleInformativeSet, secondaryInformativeSet, secondarySetDocumentName),
        this.getInfoSetFile(downloadEnabled, product),
        this.getPrivacyInfoFile(downloadEnabled)];
      return zip(...files);
    } else {
      let objAttachments = {
        email: this.authService?.loggedUser?.email,
        name: this.authService?.loggedUser?.firstname,
        product_name: product?.product_name,
        link: getLinkAttachments()
      };

      if (objAttachments.email !== undefined && objAttachments.name !== undefined
        && objAttachments.link !== undefined) {
        this.insurancesService.sendAttachments(objAttachments).subscribe((res) => {
          this.toastr.success(res.response);
        });
      } else {
        this.toastr.error('Errore, effettuare il login per procedere.');
      }
      function getLinkAttachments() {
        let linksAttachments = [];
        for (let k in product?.product_structure?.template_properties) {
          if (typeof product?.product_structure?.template_properties[k] === 'string') {
            linksAttachments.push(product?.product_structure?.template_properties[k]);
          }
        }
        return linksAttachments;
      }
    }
  }

  /* MODELLO UNICO INFORMATIVA PRECONTRATTUALE (ALLEGATO 3 e 4) */
  public getPrecontractualInfoFile(
    downloadEnabled: boolean,
    doubleInformativeSet: DoubleInfoSet = null,
    secondaryInformativeSet: string = null,
    secondarySetDocumentName: string = null
  ): Observable<ParsedDocument> {
    if (!downloadEnabled) {
      return of(null);
    }
    if (!!secondaryInformativeSet) {
      return this.nypUtilsService.downloadFromLink(secondaryInformativeSet, secondarySetDocumentName)
        .pipe(
          map(response => this.utilService.parseDocumentResponse(response)),
          tap(file => this.utilService.saveFile(file))
        );
    }
    if (!!doubleInformativeSet) {
      return this.checkSetInfoCheckBoxTimMyHome(doubleInformativeSet);
    }
    if (this.hasGenericDocumentAcceptanceInformation()) {
      return this.insurancesService.getGenericDocumentAcceptance(this.dataService.product.id).pipe(
        map(response => this.utilService.parseDocumentResponse(response)),
        tap(file => this.utilService.saveFile(file)),
      );
    } else {
      return this.nypInsurancesService.getDocumentInformation(this.authService.loggedUser.id, this.dataService.product.id)
        .pipe(
          map(response => this.utilService.parseDocumentResponse(response)),
          tap(file => this.utilService.saveFile(file)),
        );
    }
  }

  /* SET INFORMATIVO */
  public getInfoSetFile(downloadEnabled: boolean, product: CheckoutStepInsuranceInfoProduct): Observable<ParsedDocument> {
    if (!downloadEnabled) {
      return of(null);
    }
    if (this.hasGenericDocumentAcceptanceInformation()) {
      return this.insurancesService.getGenericDocumentInformation(product.id).pipe(
        map(response => this.utilService.parseDocumentResponse(response)),
        tap(file => this.utilService.saveFile(file)),
      );
    } else {
      return this.nypInsurancesService.getDocumentAcceptance(
        this.authService.loggedUser.email,
        this.authService.loggedUser.address.firstname,
        this.authService.loggedUser.address.lastname,
        product.name
      ).pipe(
        map(response => this.utilService.parseDocumentResponse(response)),
        tap(file => this.utilService.saveFile(file)),
      );
    }
  }

  /* INFORMATIVA PRIVACY */
  private getPrivacyInfoFile(downloadEnabled: boolean): Observable<ParsedDocument> {
    if (!downloadEnabled) {
      return of(null);
    }
    const templateProperties = this.dataService.product.product_structure.template_properties;
    const privacyLink = !!templateProperties && templateProperties.privacy_documentation_link;
    if (!privacyLink) {
      return of(null);
    }
    return this.nypUtilsService.downloadFromLink(privacyLink, 'INFORMATIVA_PRIVACY.pdf')
      .pipe(
        map(response => this.utilService.parseDocumentResponse(response)),
        tap(file => this.utilService.saveFile(file))
      );
  }

  private checkSetInfoCheckBoxTimMyHome(doubleInformativeSet: DoubleInfoSet): Observable<any> {
    const order = this.dataService.getResponseOrder();
    const addons = order.line_items[0].addons;
    const hasAssistance: boolean = !!addons.find(addon => addon.code === 'A');
    const hasMultirisk: boolean = !!addons.find(addon => addon.code !== 'A');
    if (hasAssistance && hasMultirisk) {
      return forkJoin([
        this.getAssitanceDocument(doubleInformativeSet),
        this.getMultiriskDocument(doubleInformativeSet)
      ]);
    }
    if (hasAssistance && !hasMultirisk) {
      return this.getAssitanceDocument(doubleInformativeSet);
    }
    if (hasMultirisk && !hasAssistance) {
      return this.getMultiriskDocument(doubleInformativeSet);
    }
  }

  private getAssitanceDocument(doubleInformativeSet: DoubleInfoSet): Observable<ParsedDocument> {
    return this.getMyHomeInfoSetDownload(doubleInformativeSet.setOne, 'Set_Informativo_Assistenza.pdf');
  }

  private getMultiriskDocument(doubleInformativeSet: DoubleInfoSet): Observable<ParsedDocument> {
    return this.getMyHomeInfoSetDownload(doubleInformativeSet.setTwo, 'Set_Informativo_Multirischio.pdf');
  }

  private getMyHomeInfoSetDownload(infoSet: string, documentName: string): Observable<ParsedDocument> {
    return this.nypUtilsService.downloadFromLink(infoSet, documentName)
      .pipe(
        map(response => this.utilService.parseDocumentResponse(response)),
        tap(file => this.utilService.saveFile(file))
      );
  }

  public getComponentNameByDBStrategies(): string {
    const defaultComponent = 'checkout-step-payment-documents-acceptance-component';
    this.componentFeaturesService.useComponent(defaultComponent);
    this.componentFeaturesService.useRule('document-acceptance-strategies');
    if (!this.componentFeaturesService.isRuleEnabled()) {
      return defaultComponent;
    }
    const regexpTester: { tester: string, component: string } = this.componentFeaturesService.getConstraints().get('choose-component-configuration-by-user-agent');
    if ((new RegExp(regexpTester.tester)).test(navigator.userAgent)) {
      return regexpTester.component;
    } else {
      return defaultComponent;
    }
  }

  public checkDownloadEnabled(strategiesComponent: string): boolean {
    this.componentFeaturesService.useComponent(strategiesComponent);
    this.componentFeaturesService.useRule('document-acceptance-strategies');
    const testString: string = this.componentFeaturesService.getConstraints().get('download-disabled');
    if (this.componentFeaturesService.isRuleEnabled() && testString) {
      const uaTest: RegExp = new RegExp(testString);
      return !uaTest.test(navigator.userAgent);
    } else {
      return true;
    }
  }

  public getShowHideWithdrawContract() {
    this.componentFeaturesService.useComponent('checkout-step-payment');
    this.componentFeaturesService.useRule('withdraw-contract-not-visible');
    if (this.componentFeaturesService.isRuleEnabled()) {
      const constraints = this.componentFeaturesService.getConstraints().get('products');
      if (!!constraints) {
        return true;
      } else {
        return false;
      }
    }
  }

  public hasGenericDocumentAcceptanceInformation(): boolean {
    this.componentFeaturesService.useComponent('generic-documents');
    this.componentFeaturesService.useRule('documents');
    if (this.componentFeaturesService.isRuleEnabled()) {
      const constraints = this.componentFeaturesService.getConstraints().get('products');
      return constraints.includes(this.dataService.product.product_code);
    }
    return false;
  }
}
