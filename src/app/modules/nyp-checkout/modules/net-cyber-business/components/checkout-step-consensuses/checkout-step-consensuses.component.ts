import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NypCheckoutService, NypIadDocumentaryService } from '@NYP/ngx-multitenant-core';
import { CheckoutStepPaymentDocumentsAcceptance, CheckoutStepPaymentProduct, CheckoutStepPaymentPromoCode } from 'app/modules/checkout/checkout-step/checkout-step-payment/checkout-step-payment.model';
import { CheckoutStates, IOrderResponse, NetCyberBusinessInsuredItems, RecursivePartial } from 'app/modules/nyp-checkout/models/api.model';
import { NypDataService } from 'app/modules/nyp-checkout/services/nyp-data.service';
import { mergeMap, take, tap, toArray } from 'rxjs/operators';
import { concat } from 'rxjs';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { NetCyberBusinessService } from '../../services/api.service';
import { ToastrService } from 'ngx-toastr';
import { KenticoPipe } from 'app/shared/pipe/kentico.pipe';
import { NYP_KENTICO_NAME, SELLER_CODE_KENTICO_NAME } from 'app/modules/nyp-checkout/nyp-checkout.module';
import { FormHumanError } from 'app/shared/errors/form-human-error.model';

@Component({
    selector: 'app-checkout-step-consensuses',
    templateUrl: './checkout-step-consensuses.component.html',
    styleUrls: [
        './checkout-step-consensuses.component.scss',
        "../../../../styles/checkout-forms.scss",
        "../../../../styles/size.scss",
        "../../../../styles/colors.scss",
        "../../../../styles/text.scss",
        "../../../../styles/common.scss"
    ],
    standalone: false
})

export class CheckoutStepConsensusesComponent implements OnInit {


  @Input('state') public state: CheckoutStates;
  @Input() public handleApplyCode;
  @ViewChild('innerhide') public HIDE;
  titleStates: CheckoutStates[] = ["insurance-info", "address", "survey"];

  public content: any;
  public product: CheckoutStepPaymentProduct;
  public documentsAcceptance: CheckoutStepPaymentDocumentsAcceptance;
  public promoCode: CheckoutStepPaymentPromoCode;
  public documentsAcceptancesForm: UntypedFormGroup;
  public promoAccordionOpen = false;
  public isSuccess: boolean = false;
  public isSuccessCoupon: boolean = false;
  isSellerCodeError: boolean = false;
  isCouponError: boolean = false;

  constructor(
    public nypDataService: NypDataService,
    protected nypCheckoutService: NypCheckoutService,
    private apiService: NetCyberBusinessService,
    private kenticoTranslateService: KenticoTranslateService,
    private fb: UntypedFormBuilder,
    private docService: NypIadDocumentaryService,
    private toastr: ToastrService,
    private kentico: KenticoPipe
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.getKenticoContent();
  }

  initForm(): void {
    this.documentsAcceptancesForm = this.fb.group({
      informationSet: [false, Validators.requiredTrue],
      privacy: [false, Validators.requiredTrue],
      codeLabel: [null],
      couponLabel: [null]
    });
  }

  getKenticoContent() {
    this.kenticoTranslateService.getItem<any>('checkout_customers_net_cyber_business').subscribe(item => this.content = item);
  }

  toggleAccordion(): void {
    this.promoAccordionOpen = !this.promoAccordionOpen;
  }



  handleApplyPromoCode(promoCode: CheckoutStepPaymentPromoCode) {

    if (!this.documentsAcceptancesForm.get('couponLabel')?.value) {
      this.isCouponError = true;
      this.toastr.error(this.kentico.transform(SELLER_CODE_KENTICO_NAME + '.error_message'));
      throw new FormHumanError('Invalid seller code');
    } else {
      this.nypCheckoutService.applyCouponCode(this.nypDataService.Order$.value.id, this.documentsAcceptancesForm.get('couponLabel')?.value, this.nypDataService.Order$.value.orderCode, this.nypDataService.Order$.value.orderItem?.[0]?.id)
      .pipe(
        tap(response => this.promoCode = Object.assign({}, promoCode, { applied: true, promotion_name: response.promotion_name })),
        mergeMap(() => this.apiService.getOrder(this.nypDataService.Order$.value.orderCode))
      )
      .subscribe(
        response => {
          this.isSuccessCoupon = true;
          //this.toastr.success(this.kentico.transform(NYP_KENTICO_NAME + '.promo_code_success'));
        },
        error => {
          this.isSuccessCoupon = false;
          this.toastr.error(this.kentico.transform(NYP_KENTICO_NAME + '.promo_code_error'));
          throw new FormHumanError('Invalid promo code');
        }
      );
    }
  } 


  handlePrevStep(): void {
    this.nypDataService.CurrentState$.next('survey');
  }

  handleNextStep(): void {
    this.updateOrder().subscribe(() => this.nypDataService.CurrentState$.next('payment'));
  }

  private updateOrder(): Observable<(RecursivePartial<IOrderResponse<NetCyberBusinessInsuredItems>> | void)[]> {
    const insuredItems = {
      seller_code: this.isSellerCodeError && !this.documentsAcceptancesForm.get('codeLabel')?.value ? null : this.documentsAcceptancesForm.get('codeLabel').value
    }

    return concat(
      this.apiService.putOrder({
        insuredItems: insuredItems,
      })
    ).pipe(toArray(), take(1));
  }

  handleSellerCode(): void {
    if (!this.documentsAcceptancesForm.get('codeLabel')?.value) {
      this.isSellerCodeError = true;
      this.documentsAcceptancesForm.get('codeLabel').reset();
      this.documentsAcceptancesForm.get('codeLabel').updateValueAndValidity();
      this.toastr.error(this.kentico.transform(SELLER_CODE_KENTICO_NAME + '.error_message'));
      throw new FormHumanError('Invalid seller code');
    } else {
      this.updateOrder().subscribe({
        next: (response: (RecursivePartial<IOrderResponse<NetCyberBusinessInsuredItems>> | void)[]) => {
          this.isSellerCodeError = false;
          localStorage.setItem('order', JSON.stringify(response[0]));
          this.isSuccess = true;
          //this.toastr.isSuccess(this.kentico.transform(SELLER_CODE_KENTICO_NAME + '.success_message'));
        },
        complete: () => {
          this.apiService.getOrder(this.nypDataService.Order$.value.orderCode)
        },
        error: (err) => {
          this.isSellerCodeError = true;
          this.documentsAcceptancesForm.get('codeLabel').reset();
          this.documentsAcceptancesForm.get('codeLabel').updateValueAndValidity();
          this.toastr.error(this.kentico.transform(SELLER_CODE_KENTICO_NAME + '.error_message'));
          throw new FormHumanError('Invalid seller code');
        }
      });
    }
  }

  public onDocumentChange(e: Event, field: 'informationSet' | 'privacy') {
    if ((e.target as HTMLInputElement).checked) {
      this.downloadDocument(field);
    }
  }

  public downloadDocument(field: 'informationSet' | 'privacy'): void {
    const node = field === 'informationSet' ? this.content.step_payment.information_set_cyber : this.content.step_payment.privacy_consens_cyber;
    const html = node.title.value;
    const parser = new DOMParser();
    const anchorHtmlList = parser.parseFromString(html, 'text/html').querySelectorAll('a');

    anchorHtmlList.forEach(anchorHtml => {
      const remoteUrl = anchorHtml.getAttribute('href')!;
      let filename = anchorHtml.getAttribute('title') || anchorHtml.textContent || remoteUrl.split('/').pop()!;

      this.docService
        .downloadFileFromUrl({ filename, remoteUrl })
        .subscribe(
          rawBlob => {
            const pdfBlob = new Blob([rawBlob], { type: 'application/pdf' });
            const blobUrl = window.URL.createObjectURL(pdfBlob);

            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = this.sanitizeFilename(filename);
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            setTimeout(() => window.URL.revokeObjectURL(blobUrl), 100);
          },
          err => console.error('Download fallito', err)
        );
    });
  }

  stripPTags(html: string): string {
    if (!html) return '';
    return html.replace(/<\/?p[^>]*>/g, '');
  }

  private sanitizeFilename(name: string): string {
    return name
      .trim()
      .replace(/[/\\?%*:|"<>]/g, '-')
      .replace(/\s+/g, '_');
  }



}
