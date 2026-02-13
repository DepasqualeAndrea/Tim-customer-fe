import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { CheckoutStepService, StepAction } from '../../services/checkout-step.service';
import { CheckoutStepComponent } from '../checkout-step.component';
import { BillItemsAttributes, RequestOrder, ResponseOrder } from '@model';
import { CheckoutContractor, CheckoutStepAddressProduct } from './checkout-step-address.model';
import { AuthService, DataService, CheckoutService, UserService, InsurancesService } from '@services';
import { switchMap, take } from 'rxjs/operators';
import { CheckoutAddressForm } from './checkout-address-forms.interface';
import { ContainerComponent } from 'app/modules/tenants/component-loader/containers/container.component';
import { CheckoutContractorService } from '../../services/checkout-contractor.service';
import { ProductCheckoutStepService } from '../../product-checkout-step-controllers/product-checkout-step.service';
import { CheckoutStepPaymentDocumentsAcceptanceComponent } from '../checkout-step-payment/checkout-step-payment-documents-acceptance/checkout-step-payment-documents-acceptance.component';
import { CheckoutStepPaymentDocumentsAcceptance, CheckoutStepPaymentProduct } from '../checkout-step-payment/checkout-step-payment.model';
import { untilDestroyed } from "ngx-take-until-destroy";
import { CheckoutLinearStepperService } from "../../checkout-linear-stepper/services/checkout-linear-stepper.service";
import { ComponentFeaturesService } from "../../../../core/services/componentFeatures.service";
import { ActivatedRoute } from '@angular/router';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { ModalService } from 'app/core/services/modal.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdobeAnalyticsDatalayerService } from 'app/core/services/adobe_analytics/adobe-init-datalayer.service';
import { digitalData } from 'app/core/services/adobe_analytics/adobe-analytics-data.model';
import { NypUserService } from '@NYP/ngx-multitenant-core';

@Component({
    selector: 'app-checkout-step-address',
    templateUrl: './checkout-step-address.component.html',
    styleUrls: ['./checkout-step-address.component.scss'],
    standalone: false
})
export class CheckoutStepAddressComponent extends CheckoutStepComponent implements OnInit, OnDestroy {

  validForm = false;
  contractor: CheckoutContractor;
  disableResidentData: boolean;

  @ViewChild('checkoutAddressForm', { static: true }) checkoutAddressFormComponent: ContainerComponent;
  @ViewChild('documentAcceptanceCard', { static: true }) documentAcceptanceCard: CheckoutStepPaymentDocumentsAcceptanceComponent;
  documentsAcceptance: CheckoutStepPaymentDocumentsAcceptance;
  responseOrder: ResponseOrder;
  brandIcon: string;

  constructor(checkoutStepService: CheckoutStepService,
    public dataService: DataService,
    private authService: AuthService,
    private checkoutContractorService: CheckoutContractorService,
    private productCheckoutStepService: ProductCheckoutStepService,
    private checkoutService: CheckoutService,
    private checkoutLinearStepperService: CheckoutLinearStepperService,
    componentFeaturesService: ComponentFeaturesService,
    private route: ActivatedRoute,
    private insuranceService: InsurancesService,
    private kenticoTranslateService: KenticoTranslateService,
    private modalService: NgbModal,
    private adobeAnalyticsDataLayerService: AdobeAnalyticsDatalayerService
  ) {
    super(checkoutStepService, componentFeaturesService);
  }
  validityChangeSubscription;
  getContractorFromForm;
  attachEventsAndPropertiesToRegisterFormComponent() {
    let checkoutAddressForm: CheckoutAddressForm;
    this.checkoutAddressFormComponent
      .getReference().pipe(take(1)).subscribe((componentRef) => {
        checkoutAddressForm = componentRef.instance as CheckoutAddressForm;
        checkoutAddressForm.contractor = this.checkoutContractorService.getCheckoutContractorFromUser(this.authService.loggedUser);
        checkoutAddressForm.residentDataDisabled = this.disableResidentData;
        this.productCheckoutStepService
          .getProductCheckoutController()
          .getAddressStepController().addressFieldsToDisable$.pipe(take(1))
          .subscribe(fieldsToDisable => {
            checkoutAddressForm.disableFields(fieldsToDisable);
          });
        this.validityChangeSubscription = checkoutAddressForm.validityChange.subscribe(($event) => this.handleValidityChange($event));
        this.getContractorFromForm = checkoutAddressForm.getContractorFromForm.bind(checkoutAddressForm);
      }
      );
    this.checkoutAddressFormComponent.defineEvent('allFilled', (filled) => {
      if (filled) {
        if (this.checkoutStepService.action === StepAction.FORWARD) {
          checkoutAddressForm?.getContractorFromForm();
          this.handleNextStep();
        }
        else if (this.checkoutStepService.action === StepAction.BACK) {
          this.handlePrevStep();
        }
      }
    });
  }
  ngOnInit() {
    this.documentsAcceptance = (<CheckoutStepPaymentProduct>this.currentStep.product).documentsAcceptance;
    const product: CheckoutStepAddressProduct = <CheckoutStepAddressProduct>this.currentStep.product;
    this.contractor = product.contractor;
    this.disableResidentData = (product.code === 'ge-holiday-house-premium') || (product.code === 'ge-holiday-house-plus');
    // this.checkoutStepService.orderUpdated.pipe(take(1)).subscribe(() =>  this.authService.reloadCurrentUserInfo());
    this.attachEventsAndPropertiesToRegisterFormComponent();
    this.notifyCurrentOrder();
    this.responseOrder = this.dataService.getResponseOrder();
    localStorage.setItem('responseOrderStepAddress', JSON.stringify(this.responseOrder));
    if (this.dataService.isTenant('santa-lucia_db')) {
      this.getBrandIcon();
    }
  }

  ngAfterViewInit() {
    if (this.route.snapshot.parent.routeConfig.path === 'checkout') {
      this.checkoutLinearStepperService.componentFactories$
        .pipe(untilDestroyed(this), take(1)).subscribe(componentFactories => {
          this.createComponentsFromComponentFactories(
            componentFactories,
            this.dataService.getResponseProduct().product_code
          );
        });

      this.checkoutLinearStepperService.state$.pipe(untilDestroyed(this)).subscribe(state => {
        this.updateComponentProperties(state);
      });
      this.checkoutLinearStepperService.loadTemplateComponents();
      this.checkoutLinearStepperService.sendState();
    }
  }

  private notifyCurrentOrder() {
    this.productCheckoutStepService
      .getProductCheckoutController()
      .getAddressStepController().responseOrderChanged();
  }
  ngOnDestroy() {
    if (this.validityChangeSubscription) {
      this.validityChangeSubscription.unsubscribe();
    }
    this.getContractorFromForm = null;
    this.checkoutService.cancelStepProgressBarAuthFalse();
  }

  createRequestOrder(): RequestOrder {
    const states = NypUserService.states
    const contractor = this.getContractorFromForm();
    const ro: RequestOrder = { order: { use_billing: true } };
    const billItem = ro.order.bill_address_attributes = new BillItemsAttributes;
    billItem.firstname = contractor.firstName;
    billItem.lastname = contractor.lastName;
    billItem.taxcode = contractor.fiscalCode;
    billItem.phone = contractor.phoneNumber;
    billItem.birth_date = contractor.birthDate;
    billItem.city = !!contractor.business ? contractor.city : contractor.residenceCity;
    billItem.zipcode = contractor.zipCode && contractor.zipCode.toString();
    billItem.country_id = !!contractor.business ? contractor.countryId : contractor.residenceCountryId;
    billItem.state_id = !!contractor.business ? contractor.stateId : contractor.residendeStateId;
    billItem.birth_city = contractor.birthCity;
    billItem.birth_city_id = contractor.birthCityId;
    billItem.birth_state_id = contractor.birthStateId;
    billItem.birth_country_id = contractor.birthCountryId;
    billItem.company = contractor.company;
    billItem.vatcode = contractor.vatcode;
    billItem.address1 = !!contractor.business ? contractor.address1 : contractor.address;
    billItem.business = contractor.business;
    billItem.imagin = contractor.imagin;
    billItem.gender = contractor.gender;
    billItem.country = contractor.residenceCountry;
    billItem.state = contractor.residendeState;
    billItem.birth_country = contractor.birthCountry;
    billItem.birth_state = contractor.birthState;
    billItem.birth_state_abbr = states.find(s => s.id == contractor.birthStateId).abbr;
    billItem.state_abbr = states.find(s => (s.id == contractor.residendeStateId || s.id == contractor.stateId)).abbr;

    return this.productCheckoutStepService
      .getProductCheckoutController()
      .getAddressStepController()
      .getRequest(ro);
  }

  handlePrevStep(): void {
    return this.saveProduct() && super.handlePrevStep();
  }

  handleNextStep(): void {
    if (this.isProductCode('tim-my-home') || this.isProductCode('customers-tim-pet') || this.isProductCode('ehealth-quixa-homage') || this.isProductCode('ehealth-quixa-standard')
      || this.isProductCode('tim-my-sci')) {
      const form: any = {
        paymentmethod: '',
        mypet_pet_type: this.dataService.getParams().kindSelected !== undefined ? this.dataService.getParams().kindSelected : '',
        codice_sconto: 'no',
        sci_numassicurati: this.dataService.getParams().insuredNumber !== undefined ? this.dataService.getParams().insuredNumber : 0,
        sci_min14: this.dataService.getParams().insuredMinors !== undefined ? this.dataService.getParams().insuredMinors : false,
        sci_polizza: this.dataService.getParams().proposalName !== undefined ? this.dataService.getParams().proposalName : '',
      }
      const number = this.currentStep.product.order.id + '';
      let digitalData: digitalData = this.adobeAnalyticsDataLayerService.setDigitalData(this.currentStep.product, 1, number, {}, form, 'tim broker', '');
      this.adobeAnalyticsDataLayerService.pushAdobeCustomTags(digitalData);
    }
    return this.saveProduct() && super.handleNextStep();
  }

  saveProduct(): CheckoutStepAddressProduct {
    const addressProduct = { contractor: this.getContractorFromForm() };
    return this.currentStep.product = Object.assign({}, this.currentStep.product, addressProduct);
  }

  handleValidityChange($event: boolean) {
    this.validForm = $event;
  }

  canContinueCheckout() {
    if (this.isProductCode('ehealth-quixa-homage')) {
      return this.validForm &&
        this.documentAcceptanceCard.form && this.documentAcceptanceCard.form.valid
    } else {
      return (
        this.validForm
      );
    }
  }

  isProductCode(code) {
    return this.currentStep.product.code === code;
  }

  handleDocumentAcceptanceChange(docAcceptance: CheckoutStepPaymentDocumentsAcceptance) {
    this.documentsAcceptance = docAcceptance;
  }
  getBrandIcon() {
    this.kenticoTranslateService.getItem<any>('navbar').subscribe((item) => {
      this.brandIcon = item?.logo?.value[0].url;
    });
  }

  openModalSuccess() {
    let kenticoContent = {};
    this.kenticoTranslateService.getItem<any>('success_modal_checkout_address_multirisk').pipe().subscribe(item => {
      kenticoContent = item;
      let modalRef: any;
      modalRef = this.modalService.open(ContainerComponent, { size: 'lg', backdropClass: 'backdrop-class ' + this.dataService.tenantInfo.main.layout, windowClass: 'modal-window' });
      (<ContainerComponent>modalRef.componentInstance).type = 'SuccessModalAddressMultirisk';
      (<ContainerComponent>modalRef.componentInstance).componentInputData = { 'kenticoContent': kenticoContent };
    });
  }

  saveToMyQuotes() {
    const orderId = this.dataService.getResponseOrder().id;
    this.insuranceService.estimatesMultirisk(orderId).subscribe(() => {
      this.openModalSuccess();
      this.saveProduct();
    })
  }

}
