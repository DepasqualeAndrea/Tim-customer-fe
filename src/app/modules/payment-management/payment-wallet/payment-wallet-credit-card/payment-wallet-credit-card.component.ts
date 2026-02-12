import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChange } from '@angular/core';
import { AuthService, CheckoutService, DataService } from '@services';
import { CheckoutStepPaymentService } from '../../../checkout/checkout-step/checkout-step-payment/checkout-step-payment.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { braintreeTenantLayouts, BRAINTREE_HOSTED_FIELDS_STYLES_CONFIG, HOSTED_FIELDS } from './payment-wallet-credit-card.model';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { filter, map, take } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs';
import { BraintreePaymentMethod } from '../../payment-management.model';
import { forkJoin } from 'rxjs';
import { SystemError } from '../../../../shared/errors/system-error.model';
import { FormHumanError } from '../../../../shared/errors/form-human-error.model';
import { KenticoTranslateService } from '../../../kentico/data-layer/kentico-translate.service';
import { BraintreeClientService } from '../../payment-services/braintree-client.service';
import { Braintree3DSecurePaymentService } from '../../payment-services/braintree-3d-secure-payment.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../core/services/loader.service';
import { BraintreeError, callback, HostedFields, HostedFieldsTokenizePayload } from 'braintree-web';
import { Client } from 'braintree-web/modules/client';
import { ContentItem } from 'kentico-cloud-delivery';
import { HostedFieldsEvent, HostedFieldsFieldDataFields } from 'braintree-web/modules/hosted-fields';

type BraintreeConfig = {hostedFields: HostedFields}

@Component({
  selector: 'app-payment-wallet-credit-card',
  templateUrl: './payment-wallet-credit-card.component.html',
  styleUrls: ['./payment-wallet-credit-card.component.scss']
})
export class PaymentWalletCreditCardComponent implements OnInit, OnChanges, OnDestroy {

  @Input() paymentMethodId: number;
  @Input() paymentMethodName: string;
  @Input() paymentAmount: number;
  @Input() favouriteChoice: boolean;
  @Input() verifyCardWhenIsAddedToWallet: boolean;

  @Output() paymentStatus: EventEmitter<BraintreePaymentMethod> = new EventEmitter<BraintreePaymentMethod>();
  @Input() panelCollapsed: boolean;
  @Input() braintreeLayout: string;

  @Input() addPaymentEvent: boolean = false;

  form: FormGroup;
  braintreeClientSource: Subject<Client> = new BehaviorSubject<Client>(null);
  braintreeHostedFieldsSource: Subject<HostedFields> = new BehaviorSubject<HostedFields>(null);
  braintreeClient$: Observable<Client> = this.braintreeClientSource.asObservable().pipe(filter(client => !!client));
  braintreeHostedFields$: Observable<HostedFields> = this.braintreeHostedFieldsSource.asObservable().pipe(filter(hostedFields => !!hostedFields));
  braintreeError: BraintreeError;
  private braintree3dsecureService: Braintree3DSecurePaymentService;
  textPlaceHolderCardOwnerIntesa: Boolean = false;

  constructor(private formBuilder: FormBuilder,
    private checkoutService: CheckoutService,
    private checkoutPaymentService: CheckoutStepPaymentService,
    private kenticoTranslateService: KenticoTranslateService,
    braintreeClientService: BraintreeClientService,
    public dataService: DataService,
    authService: AuthService,
    private loaderService: LoaderService,
    private toastrService: ToastrService) {
    this.braintree3dsecureService = new Braintree3DSecurePaymentService(
      checkoutService,
      braintreeClientService,
      authService);
  }

  ngOnChanges(changes: {[key: string]: SimpleChange}) {
    if (!!changes.addPaymentEvent.currentValue && this.form.valid) {
      this.addPaymentMethod();
    }
  }

  ngOnInit() {
    this.appendHostedFieldsEvents()
    this.form = this.formBuilder.group({ cardHolder: new FormControl('', [Validators.required]) });
    if (this.favouriteChoice) {
      this.form.addControl('favourite', new FormControl(true));
    }

    if (this.paymentMethodName.includes('PaypalBraintree')) {
      this.braintree3dsecureService.verifyCardWhenIsAddedToWallet = this.verifyCardWhenIsAddedToWallet;
      const formsCardNumber$ = this.kenticoTranslateService.getItem<ContentItem>('forms.card_number').pipe(map<ContentItem, string>(item => item.value));
      const formsExpirationDate$ = this.kenticoTranslateService.getItem<ContentItem>('forms.expiration_date').pipe(map<ContentItem, string>(item => item.value));
      forkJoin([formsCardNumber$, formsExpirationDate$]).subscribe(([numberPlaceholder, expirationDatePlaceholder]) => {
        const fields = Object.assign({}, HOSTED_FIELDS);
        fields.number.placeholder = numberPlaceholder;
        fields.expirationDate.placeholder = expirationDatePlaceholder;
        this.braintree3dsecureService.createForm(this.paymentMethodId, fields).subscribe(result =>
          this.braintreeHostedFieldsSource.next(result)
        );
      });
    } else {
      this.checkoutService.getClientToken(this.paymentMethodId).subscribe((authorization: string) => {
        this.checkoutPaymentService.braintreeProvider$.pipe(untilDestroyed(this), filter(braintree => !!braintree))
          .subscribe(braintree => {
            (braintree.client as Client).create({ authorization }, this.handleBraintreeClientCreation());
            this.braintreeClient$.subscribe((client: Client) => {
              const formsCardNumber$ = this.kenticoTranslateService.getItem<ContentItem>('forms.card_number').pipe(
                map<ContentItem, string>(item => item.value)
              );
              const formsExpirationDate$ = this.kenticoTranslateService.getItem<ContentItem>('forms.expiration_date').pipe(
                map<ContentItem, string>(item => item.value)
              );
              forkJoin([formsCardNumber$, formsExpirationDate$]).subscribe(([numberPlaceholder, expirationDatePlaceholder]) => {
                const fields = Object.assign({}, HOSTED_FIELDS);
                fields.number.placeholder = numberPlaceholder;
                fields.expirationDate.placeholder = expirationDatePlaceholder;
                const {hostedFields}: BraintreeConfig = braintree
                hostedFields.create({
                  client,
                  styles: this.getBraintreeStyle(),
                  fields
                }, this.handleBraintreeHostedFieldCreation());

              });
            });
          });
      });
    }
    this.placeHolderCardOwnerIntesa();
  }

  private appendHostedFieldsEvents(): void {
    this.braintreeHostedFields$.subscribe(hostedFields => {
      hostedFields.on('validityChange', (evt: HostedFieldsEvent) => {
        const isFormValid = Object.keys(evt.fields).every((key: keyof HostedFieldsFieldDataFields) =>
          evt.fields[key].isValid
        )
        if (isFormValid) {
          this.deleteError()
        }
      })
    })
  }

  private deleteError(): void {
    this.braintreeError = null
  }

  private getBraintreeStyle(): {[property: string]: object}  {
    if (!!this.braintreeLayout) {
      return braintreeTenantLayouts[this.braintreeLayout]
    } else {
      return BRAINTREE_HOSTED_FIELDS_STYLES_CONFIG
    }
  }

  private placeHolderCardOwnerIntesa(): void {
    this.kenticoTranslateService.getItem<ContentItem>('checkout.card_owner_placeholder').pipe(take(1)).subscribe(item => { this.textPlaceHolderCardOwnerIntesa = !!item; });
  }

  ngOnDestroy(): void {
  }

  private handleBraintreeClientCreation(): callback<Client> {
    return (err: BraintreeError, client: Client) => err ?
      this.handleBraintreeClientCreationError(err) :
      this.braintreeClientSource.next(client);
  }

  private handleBraintreeHostedFieldCreation(): callback<HostedFields> {
    return (err: BraintreeError, hostedFields: HostedFields) => err ?
      this.handleBraintreeHostedFieldCreationError(err) :
      this.braintreeHostedFieldsSource.next(hostedFields);
  }

  private handleBraintreeHostedFieldsTokenize(): callback<HostedFieldsTokenizePayload> {
    return (err: BraintreeError, payload: HostedFieldsTokenizePayload) => err ?
      this.handleBraintreeHostedFieldTokenizeError(err) : this.paymentAdded(payload);
  }

  private paymentAdded(payload: HostedFieldsTokenizePayload): void {
    if (this.favouriteChoice) {
      this.paymentStatus.emit({ nameCreditCard: this.form.controls.cardHolder.value, payload, setAsFavourite: this.form.controls.favourite.value });
    } else {
      this.paymentStatus.emit({ nameCreditCard: this.form.controls.cardHolder.value, payload });
    }

    this.braintreeHostedFields$.subscribe((hostedFields: HostedFields) => {
      Object.keys(HOSTED_FIELDS).forEach((k: string) => 
        hostedFields.clear(k)
      );
      this.form.controls.cardHolder.patchValue('');
      this.form.controls.cardHolder.markAsUntouched();
    });
  }

  public addPaymentMethod(): void {
    if (this.paymentMethodName.includes('PaypalBraintree')) {
      this.loaderService.start('block-ui-main');
      this.braintree3dsecureService.createCreditCardPayload(this.paymentAmount).subscribe(payload => {
        this.paymentAdded(payload);
        this.loaderService.stop('block-ui-main');
      },
        (error: BraintreeError) => {
          this.loaderService.stop('block-ui-main');
          this.braintreeError = error
          this.toastrService.error(this.braintreeError.message);
        });
    } else {
      this.braintreeHostedFields$.subscribe(hostedFields => {
        this.deleteError()
        hostedFields.tokenize(this.handleBraintreeHostedFieldsTokenize());
      });
    }
  }

  private handleBraintreeClientCreationError(err: BraintreeError): void {
    this.braintreeError = err;
    console.error(err)
    throw new SystemError('Cannot create braintree client');
  }

  private handleBraintreeHostedFieldCreationError(err: BraintreeError): void {
    this.braintreeError = err;
    console.error(err)
    throw new SystemError('Cannot create braintree hosted fields');
  }

  private handleBraintreeHostedFieldTokenizeError(err: BraintreeError): void {
    this.braintreeError = err;
    console.error(err)
    throw new FormHumanError('Something went wrong while accepting payment card input values');
  }

}
