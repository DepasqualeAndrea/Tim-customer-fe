import { CheckoutProduct } from 'app/modules/checkout/checkout.model';
import { GtmHandlerService } from 'app/core/services/gtm/gtm-handler.service';
import {Component, Output, EventEmitter, ViewChild, OnInit, Input} from '@angular/core';
import { ConsentFormComponent } from 'app/shared/consent-form/consent-form.component';
import { UntypedFormBuilder } from '@angular/forms';
import { UserService, AuthService, DataService } from '@services';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { catchError, take } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { ContentItem } from 'kentico-cloud-delivery';
import { BackButtonComponent } from '../common/back-button.component';
import { BusinessForm } from 'app/shared/business-form/business-form.model';
import { BusinessFormComponent } from 'app/shared/business-form/business-form.component';
import { CaptchaService } from 'app/shared/captcha.service';
import { ComponentFeaturesService } from 'app/core/services/componentFeatures.service';
import { GtmService } from 'app/core/services/gtm/gtm.service';
import { KenticoTranslateService } from '../../../kentico/data-layer/kentico-translate.service';

@Component({
    selector: 'app-business-registration-form',
    templateUrl: './business-registration-form.component.html',
    styleUrls: ['../common/login-register-forms.scss', './business-registration-form.component.scss'],
    standalone: false
})
export class BusinessRegistrationFormComponent extends BackButtonComponent implements OnInit {
  @Output() registerSuccess = new EventEmitter<void>();
  @Input() redirectTo: string = null;
  @Input() product: CheckoutProduct = null;
  @ViewChild('consent', { static: true }) consent: ConsentFormComponent;
  @ViewChild(BusinessFormComponent, { static: true }) businessForm: BusinessFormComponent;
  recaptchaKey: string;
  captchaEnabled: boolean;
  captchaToken: string;
  isFormSubmitted: boolean;
  private captchaSuccess = false;
  constructor(
    private formBuilder: UntypedFormBuilder,
    private userService: UserService,
    private toastrService: ToastrService,
    private router: Router,
    private auth: AuthService,
    private modalService: NgbModal,
    public dataService: DataService,
    private captchaService: CaptchaService,
    private kenticoTranslateService: KenticoTranslateService,
    private componentFeaturesService: ComponentFeaturesService,
    private gtmHandlerService: GtmHandlerService,
    private gtmEventGeneratorService: YoloDataLayerEventObjGeneratorService
  ) {
    super();
  }
  ngOnInit() {
    this.componentFeaturesService.useComponent('business-registration-form');
    this.componentFeaturesService.useRule('captcha');
    const constraints: Map<string, any> = this.componentFeaturesService.getConstraints();

    this.recaptchaKey = this.dataService.tenantInfo.captcha.siteKey;
    this.captchaEnabled = constraints.get('registerEnabled');
    this.captchaSuccess = !this.captchaEnabled;           // if captcha is disabled then set captchaSuccess true to validate form
                                                          // otherwise captchaSuccess is false to prevent form validation
  }

  createUserAttributes() {
    const user_acceptances_attributes = {};
    this.consent.privacyFlags.forEach((flag, index) => {
      user_acceptances_attributes[`${index}`] = {
        flag_id: flag.id,
        value: this.consent.consentForm.controls[flag.tag].value || false,
      };
    });
    return user_acceptances_attributes;
  }
  createUserFromBusiness(business: BusinessForm, user_acceptances_attributes: any): any {
    const businessUser = {
      email: business.email,
      password: business.password,
      phone: business.phone,
      city: business.officecity,
      country_id: business.country_id,
      state_id: business.officestate_id,
      zipcode: business.officezipcode,
      vatcode: business.vatcode,
      company: business.company,
      business: true,
      address1: business.officeaddress,
      user_acceptances_attributes: user_acceptances_attributes,
      firstname: business.firstname,
      lastname: business.lastname,
      taxcode: business.taxcode,
    };
    return businessUser;
  }
  register() {
    this.isFormSubmitted = true;
    if (this.isValid()) {
      const business = this.businessForm.getBusiness();
      const userAttributes = this.createUserAttributes();
      const user = this.createUserFromBusiness(business, userAttributes);
      this.userService.register({ user, 'g-recaptcha-response': this.captchaToken }, this.redirectTo)
        .pipe(catchError((err) => this.handleRegistrationError(err)))
        .subscribe(newUser => newUser && this.handleRegistrationSuccess());
    } else {
      console.log('err');
      const element = document.querySelector('business-form-component') || window;
      element.scrollTo(0, 0);
    }
  }

  private handleRegistrationError(response: HttpErrorResponse): Observable<void> {
    const error = response.error;
    if (error && error.error) {
      const err = this.computeErrors(error.errors);
      this.toastrService.error(error.error + (err && `: ${err}` || ''));
    }
    return of(null);
  }
  computeErrors(errors: { [key: string]: string }): string {
    if (!errors) {
      return '';
    }
    if (errors.email) {
      return `Email ${errors.email[0]}`;
    }
    if (errors.password) {
      return `Password ${errors.password[0]}`;
    }
    return '';
  }
  isValid(): boolean {
    return this.consent.consentForm.valid && this.businessForm.isValid() && this.captchaSuccess;
  }
  handleRegistrationSuccess(): void {
    this.kenticoTranslateService.getItem<any>('toasts.sign_up_toast').pipe(take(1)).subscribe(
      toastMessage => this.toastrService.success(toastMessage.value)
    );
    this.registerSuccess.emit();
    this.handleGtm();
  }
  captchaResolved(token: string) {
    this.captchaService.checkCaptcha(token).subscribe(element => {
      this.captchaSuccess = element.success;
      if (element.expired) {
        this.kenticoTranslateService.getItem<ContentItem>('toasts').map<ContentItem, string>(item => item['recaptcha_expired'].value).subscribe(message => {
          this.toastrService.warning(message);
        });
      }
    });
  }

  private handleGtm() {
    this.gtmHandlerService.requireTenant('yolo-it-it');
    this.gtmHandlerService.setPageInfoIntoDataLayer();
    const originalProduct = this.product && this.product.originalProduct;
    this.gtmHandlerService.multiPush(
      this.gtmEventGeneratorService.fillRegistrationEvent(originalProduct)
    );
  }
}
