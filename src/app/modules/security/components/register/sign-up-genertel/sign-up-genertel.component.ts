import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, SimpleChange } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Product } from '@model';
import { AuthService, CheckoutService, DataService, UserService } from '@services';
import { GtmInitDataLayerService } from 'app/core/services/gtm/gtm-init-datalayer.service';
import { CheckoutStepInsuranceInfoComponent } from 'app/modules/checkout/checkout-step/checkout-step-insurance-info/checkout-step-insurance-info.component';
import { CheckoutStepService } from 'app/modules/checkout/services/checkout-step.service';
import moment from 'moment';
import { Subscription } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { signupDataLayerSciSubsteps } from './gtm/signup-substeps-datalayer.value';
import { GenertelSciSignupRequest } from './sign-up-generte-sci-request.model';

@Component({
    selector: 'app-sign-up-genertel',
    templateUrl: './sign-up-genertel.component.html',
    styleUrls: ['./sign-up-genertel.component.scss'],
    standalone: false
})
export class SignUpGenertelComponent implements OnInit {

  @Output() formUpdate = new EventEmitter<UntypedFormGroup>();
  @Input() changeSubstep: string;
  @Input() insuranceHoldersForm: UntypedFormArray;
  @Input() contractorInfoForm: UntypedFormGroup;
  @Input() startDate: string;
  @Input() endDate: string;
  @Input() contractorContactsForm: UntypedFormGroup;
  @Input() product: Product;
  @Input() isPolicyInstant: boolean;
  @Input() kenticoContent: any;
  @Input() isSeasonal: boolean;

  form: UntypedFormGroup;
  subscription: Subscription | undefined;

  currentSubstep: 'insurance_recap' | 'contractor_contacts_form' = 'contractor_contacts_form';
  privacyLink = 'https://www.genertel.it/privacy-policy';

  constructor(
    private formBuilder: UntypedFormBuilder,
    private userService: UserService,
    private infoComponent: CheckoutStepInsuranceInfoComponent,
    private auth: AuthService,
    private checkoutStepService: CheckoutStepService,
    private dataService: DataService,
    private checkoutService: CheckoutService,
    private gtmInitDataLayerService: GtmInitDataLayerService
  ) { }

  ngOnInit() {
    this.createForm();
    this.subscription = this.checkoutStepService.checkoutSendForm$.subscribe(form => {
      this.signupAndLogin(form);
    });
  }

  ngOnChanges(changes: {[key: string]: SimpleChange}) {
    if (!!changes.changeSubstep && !!changes.changeSubstep.currentValue) {
      this.currentSubstep = changes.changeSubstep.currentValue;
      this.pushGtmNavigationEvent()
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private createForm(): void {
    this.form = this.formBuilder.group({
      email: [null, [ Validators.required, Validators.pattern('^(?=.{1,100}$)([a-zA-Z0-9.!#$%&*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?))*$')]],
      emailConfirm: [null, [ Validators.required, Validators.pattern('^(?=.{1,100}$)([a-zA-Z0-9.!#$%&*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?))*$')]],
      phone: [null,  Validators.compose([Validators.required, Validators.pattern('^[(+).0-9\]{7,15}$')])],
    }, {validator: this.emailValidator});
    if (!!this.contractorContactsForm) {
      this.form.setValue({
        ...this.contractorContactsForm.value
      });
    }
    this.form.valueChanges.subscribe(() => this.emitForm());
  }

  private emitForm(): void {
    this.formUpdate.emit(this.form);
  }

  private emailValidator: ValidatorFn = (form: UntypedFormGroup) => {
    const email = form.get('email') && form.get('email').value;
    const emailConfirm = form.get('emailConfirm') && form.get('emailConfirm').value;
    return (!email && !emailConfirm) || (email === emailConfirm) ? null : {emailsNotMatching: true};
  }

  private continueCheckout(): void {
    this.infoComponent.handleNextStep();
  }

  private signupAndLogin(form: UntypedFormGroup): void {
    const request = this.createSignUpRequest(form);
    const signUp$ = this.userService.signupGenertelSci(request);
    if (!this.auth.loggedIn) {
      signUp$.subscribe(user => {
        this.auth.performLoginSuccess(user);
        this.continueCheckout();
      });
    } else {
      if (this.hasUserChangedEmail()) {
        signUp$.pipe(
          tap(user => this.auth.performLoginSuccess(user)),
          switchMap(() => this.checkoutService.addToChart(this.dataService.getRequestOrder())),
          tap(order => {
            this.checkoutStepService.orderChange(order);
            this.dataService.setResponseOrder(order);
          })
        ).subscribe(() =>
          this.continueCheckout()
        );
      } else {
        this.continueCheckout();
      }
    }
  }

  private createSignUpRequest(form: UntypedFormGroup): GenertelSciSignupRequest {
    return {
      user: {
        email: form.value.email,
        phone: form.value.phone
      }
    };
  }

  private hasUserChangedEmail(): boolean {
    const userMail = this.auth.currentUser.email;
    return userMail !== this.form.value.email;
  }

  private pushGtmNavigationEvent() {
    this.gtmInitDataLayerService.preventivatoreCustomTags(
      signupDataLayerSciSubsteps.find(datalayerEvent => datalayerEvent.step === this.currentSubstep).value
    );
  }

}
