import { ComponentFeaturesService } from 'app/core/services/componentFeatures.service';
import { Component, ComponentFactoryResolver, ComponentRef, OnDestroy, OnInit, SimpleChanges, ViewChild, ViewContainerRef } from '@angular/core';
import { CheckoutStepService } from '../../services/checkout-step.service';
import { CheckoutStepComponent } from '../checkout-step.component';
import { CheckoutFamilyRelationship, CheckoutInsuredShipment, CheckoutInsuredSubject, CheckoutStepInsuranceInfoItems, CheckoutStepInsuranceInfoProduct } from './checkout-step-insurance-info.model';
import { InsuranceHoldersAttributes, LineFirstItem, RequestOrder, ResponseOrder, ShipmentAddressAttributes } from '@model';
import { CheckoutStepInsuranceInfoDynamicComponent } from './checkout-step-insurance-info-dynamic-component';
import * as moment from 'moment';
import { AuthService, CheckoutService, DataService } from '@services';
import { CheckoutProduct } from '../../checkout.model';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from 'app/modules/security/services/login.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { ProductCheckoutStepService } from '../../product-checkout-step-controllers/product-checkout-step.service';
import { ChangeStatusService } from 'app/core/services/change-status.service';
import { CheckoutLinearStepperService } from '../../checkout-linear-stepper/services/checkout-linear-stepper.service';
import { take } from 'rxjs/operators';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { digitalData } from 'app/core/services/adobe_analytics/adobe-analytics-data.model';
import { AdobeAnalyticsDatalayerService } from 'app/core/services/adobe_analytics/adobe-init-datalayer.service';
import { NypCheckoutService } from '@NYP/ngx-multitenant-core';

@Component({
  selector: 'app-checkout-step-insurance-info',
  templateUrl: './checkout-step-insurance-info.component.html',
  styleUrls: ['./checkout-step-insurance-info.component.scss']
})
export class CheckoutStepInsuranceInfoComponent extends CheckoutStepComponent implements OnInit, OnDestroy {


  @ViewChild('dynamic', { read: ViewContainerRef, static: true }) viewContainerRef: ViewContainerRef;
  public ongoingRequestOrder: RequestOrder;
  public loginRedirect: string;
  notShadowed: boolean;
  private componentRef: ComponentRef<CheckoutStepInsuranceInfoDynamicComponent>;
  intesaPetChoise = false;
  responseOrderFromStepAddress: ResponseOrder;
  addonsFromOrder: any[];
  responseOrder: ResponseOrder;
  product: any;
  hideButtonOnInvalidForm: boolean = false;
  brandIcon: string;

  constructor(
    checkoutStepService: CheckoutStepService,
    public dataService: DataService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private authService: AuthService,
    private router: Router,
    private loginService: LoginService,
    private route: ActivatedRoute,
    private checkoutService: CheckoutService,
    private changeStatusService: ChangeStatusService,
    private productCheckoutStepService: ProductCheckoutStepService,
    componentFeaturesService: ComponentFeaturesService,
    private checkoutLinearStepperService: CheckoutLinearStepperService,
    private kenticoTranslateService: KenticoTranslateService,
    private adobeAnalyticsDataLayerService: AdobeAnalyticsDatalayerService,
    private nypCheckoutService: NypCheckoutService,
  ) {
    super(checkoutStepService, componentFeaturesService);
  }

  ngOnInit() {
    const resolverData = this.productCheckoutStepService
      .getProductCheckoutController()
      .getProductCheckoutStateController()
      .getCheckoutRouteInput();
    this.ongoingRequestOrder = this.productCheckoutStepService
      .getProductCheckoutController()
      .getInfoStepController().getOngoingRequestOrder(resolverData);
    if (this.ongoingRequestOrder) {
      return super.handleNextStep();
    }

    this.viewContainerRef.clear();
    const product: CheckoutStepInsuranceInfoProduct = this.computeStepProduct(this.currentStep.product, this.dataService.getResponseOrder());
    const productComponent = CheckoutStepInsuranceInfoItems[product.code];
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(productComponent);
    this.componentRef = this.viewContainerRef.createComponent<CheckoutStepInsuranceInfoDynamicComponent>(componentFactory);
    this.componentRef.instance.product = product;
    this.checkoutService.cancelOngoingCheckout();
    this.productCheckoutStepService.getProductCheckoutController().getInfoStepController().checkProductInitialization(this);
    this.getComponentFeaturesRules(product);
    this.rowNotShadowed(product);
    this.isIntesaPetChoise();
    if (localStorage.getItem('redirect-checkout')) {
      this.addonsFromOrder = this.dataService.getResponseOrder().line_items[0].addons;
    } else if (localStorage.getItem('responseOrderStepAddress')) {
      this.verifyFirstLandingInsuranceInfo();
    }
    this.responseOrder = this.dataService.getResponseOrder();
    this.product = this.dataService.getResponseProduct();
    this.changeStatusQuotationStep();
    if (this.dataService.isTenant('santa-lucia_db')) {
      this.getBrandIcon();
    }

    const form: any = {
      paymentmethod: '',
      mypet_pet_type: '',
      codice_sconto: 'no',
      sci_numassicurati: 0,
      sci_min14: 0,
      sci_polizza: '',
    }

    const number = this.dataService.responseOrder.id + '';
    let digitalData: digitalData = this.adobeAnalyticsDataLayerService.setDigitalData(this.product, 1, number, {}, form, 'tim broker', '');
    window['digitalData'] = digitalData;
  }

  private getComponentFeaturesRules(product: CheckoutStepInsuranceInfoProduct): void {
    this.getHideButtonOnInvalidForm(product.code);
    this.rowNotShadowed(product);
    this.isIntesaPetChoise();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.componentRef.instance.onBeforeNextStep().subscribe(item => {
      this.handleNextStep();
    });
  }

  verifyFirstLandingInsuranceInfo() {
    this.responseOrderFromStepAddress = JSON.parse(localStorage.getItem('responseOrderStepAddress'));
    const currentResponseOrderFromLocalStorage = this.dataService.getResponseOrder();
    if (this.dataService.getResponseOrder()) {
      if (this.responseOrderFromStepAddress.number !== this.dataService.getResponseOrder().number) {
        localStorage.removeItem('responseOrderStepAddress');
      } else {
        this.addonsFromOrder = this.responseOrderFromStepAddress.line_items[0].addons;
      }
    } else if (currentResponseOrderFromLocalStorage) {
      if (this.responseOrderFromStepAddress.number !== currentResponseOrderFromLocalStorage.number) {
        localStorage.removeItem('responseOrderStepAddress');
      } else {
        this.addonsFromOrder = this.responseOrderFromStepAddress.line_items[0].addons;
      }
    }
  }

  ngAfterViewInit() {
    if (this.route.snapshot.parent.routeConfig.path === 'checkout') {
      this.checkoutLinearStepperService.componentFactories$
        .pipe(untilDestroyed(this), take(1)).subscribe(componentFactories => {
          this.createComponentsFromComponentFactories(componentFactories, this.product.product_code);
        });

      this.checkoutLinearStepperService.state$.pipe(untilDestroyed(this)).subscribe(state => {
        this.updateComponentProperties(state);
      });
      this.checkoutLinearStepperService.loadTemplateComponents();
      this.checkoutLinearStepperService.sendState();
    }
  }

  private changeStatusQuotationStep() {
    if (this.dataService.tenantInfo.tenant === 'banca-sella_db') {
      this.changeStatusService.setResponseOrder(this.dataService.getResponseOrder());
      this.changeStatusService.buildChangeStatusPayload();
    }
  }

  private getHideButtonOnInvalidForm(productCode: string): void {
    this.componentFeaturesService.useComponent('checkout-step-insurance-info');
    this.componentFeaturesService.useRule('hide-button-on-invalid-form');
    if (this.componentFeaturesService.isRuleEnabled()) {
      const constraints = this.componentFeaturesService.getConstraints().get('products');
      this.hideButtonOnInvalidForm = constraints.includes(productCode);
    }
  }

  isIntesaPetChoise() {
    this.componentFeaturesService.useComponent('checkout-step-insurance-info');
    this.componentFeaturesService.useRule('intesa-choise-pet');
    this.intesaPetChoise = this.componentFeaturesService.isRuleEnabled();
    if (this.componentFeaturesService.isRuleEnabled() === null) {
      this.intesaPetChoise = false;
    }
  }

  rowNotShadowed(product) {
    this.componentFeaturesService.useComponent('multiple-tabs-insurance-info');
    this.componentFeaturesService.useRule('row-not-shadowed');
    if (this.componentFeaturesService.isRuleEnabled()) {
      const constraints = this.componentFeaturesService.getConstraints().get('products');
      if (constraints.includes(product.code)) {
        return this.notShadowed = true;
      }
    }
  }

  createRequestOrder(): RequestOrder {
    if (this.ongoingRequestOrder) {
      return this.ongoingRequestOrder;
    }

    const product = this.componentRef.instance.computeProduct();
    const ro = { state: null, order: { line_items_attributes: {} } };
    const lineItem = ro.order.line_items_attributes['0'] = new LineFirstItem();
    delete lineItem.insurance_info_attributes;
    lineItem.start_date = moment(product.startDate).format();
    lineItem.expiration_date = moment(product.endDate).format();
    lineItem.insured_is_contractor = !!product.insuredIsContractor;
    lineItem.shipment_is_contractor = !!product.isContractorShipment;
    lineItem.days_number = this.dataService?.requestOrder?.order?.line_items_attributes[0]?.days_number
    if (product.instant !== undefined) {
      lineItem.instant = product.instant;
    }
    if (product.insuredSubjects && product.insuredSubjects.length === 1 && this.hasSingleInsuranceHolder(product.code)) {
      lineItem.insurance_holder_attributes = this.computeSingleInsuranceHolderAttributes(product.insuredSubjects);
    } else {
      delete lineItem.insurance_holder_attributes;
    }
    if (product.insuredSubjects && product.insuredSubjects.length && !this.hasSingleInsuranceHolder(product.code) && !this.productContainsVehicle(product)) {
      lineItem.insurance_holders_attributes = this.computeInsuranceHoldersAttributes(product.insuredSubjects, this.dataService.getResponseOrder());
    } else {
      delete lineItem.insurance_holders_attributes;
    }
    if (product.insuredShipments && product.insuredShipments.length > 0 && !this.hasMultipleShipments(product.code)) {
      lineItem.shipment_address_attributes = this.computeSingleShipmentAddressAttributes(product.insuredShipments);
    } else if (product.insuredShipments && product.insuredShipments.length > 0 && this.hasMultipleShipments(product.code)) {
      lineItem.shipments_address_attributes = this.computeShipmentsAddressAttributes(product.insuredShipments, this.dataService.getResponseOrder());
    } else {
      delete lineItem.shipment_address_attributes;
      if (!lineItem.shipment_is_contractor) {
        delete lineItem.shipment_is_contractor;
      }
    }
    if (this.haveAddonStepInsuranceInfo(product.code)) {
      this.addonsInsuranceInfo(lineItem, product);
    }
    if (product.insuredPets) {
      lineItem.pet_attributes = product.insuredPets;
    }
    if (product.carInfo) {
      lineItem.car_attributes = product.carInfo;
    }
    if (product.homeInfo) {
      lineItem.house_attributes = product.homeInfo;
      // lineItem.price = product.homeInfo.price    //for tim home commented
      lineItem.pricing = this.dataService.timHomeQuotePayload
    }
    if (product.buildingInfo) {
      lineItem.building_attributes = product.buildingInfo;
    }
    if (product.isOwner) {
      lineItem.insurance_info_attributes = product.isOwner;
    }
    this.currentStep.product = product;
    lineItem.id = product.lineItemId;
    lineItem.variant_id = product.variantId;

    if (product.homeInfo)
      lineItem.house_attributes.zipcode = Number(product.homeInfo.zipcode)

    this.componentRef.instance.fillLineItem(lineItem);

    if (['tim-for-ski-silver', 'tim-for-ski-gold', 'tim-for-ski-platinum'].includes(product.originalProduct.product_code)) {
      lineItem.start_date = moment(this.dataService.skiPolicyDates?.start).format();
      lineItem.expiration_date = moment(this.dataService.skiPolicyDates?.end).format();
    }

    return <RequestOrder>ro;
  }

  hasSingleInsuranceHolder(productCode: string) {
    this.componentFeaturesService.useComponent('checkout-step-insurance-info');
    this.componentFeaturesService.useRule('admits-only-one-insurance-holder');
    const oneAndOnlyRule = this.componentFeaturesService.isRuleEnabled();
    const pc: Array<string> = this.componentFeaturesService.getConstraints().get('productCodes');
    return oneAndOnlyRule ? pc.includes(productCode) : false;
  }

  hasMultipleShipments(productCode: string) {
    this.componentFeaturesService.useComponent('checkout-step-insurance-info');
    this.componentFeaturesService.useRule('admits-multiple-shipments');
    const oneAndOnlyRule = this.componentFeaturesService.isRuleEnabled();
    const pc: Array<string> = this.componentFeaturesService.getConstraints().get('productCodes');
    return oneAndOnlyRule ? pc.includes(productCode) : false;
  }

  computeStepProduct(product: CheckoutProduct, responseOrder: ResponseOrder): CheckoutStepInsuranceInfoProduct {
    const p = <CheckoutStepInsuranceInfoProduct>product;
    const insuredSubjects = this.getInsuredSubjects(responseOrder);
    const insuredShipments = this.getInsuredShipments(responseOrder);
    Object.assign(p, { insuredSubjects: insuredSubjects, insuredShipments: insuredShipments });
    return p;
  }

  computeSingleInsuranceHolderAttributes(coSubjects: CheckoutInsuredSubject[]): InsuranceHoldersAttributes {
    return coSubjects.reduce((acc, subject) => {
      acc = this.fromCheckoutSubjectToInsuranceHolder(subject);
      acc = subject._destroy ? Object.assign(acc, { _destroy: true }) : acc;
      return acc;
    }, {});
  }

  computeSingleShipmentAddressAttributes(coSubjects: CheckoutInsuredShipment[]): ShipmentAddressAttributes {
    return coSubjects.reduce((acc, shipment) => {
      acc = this.fromCheckoutShipmentToInsuranceShipment(shipment);
      acc = shipment._destroy ? Object.assign(acc, { _destroy: true }) : acc;
      return acc;
    }, {});
  }

  computeInsuranceHoldersAttributes(coSubjects: CheckoutInsuredSubject[], responseOrder: ResponseOrder): { [key: string]: InsuranceHoldersAttributes } {
    const newHolders = Object.assign([], coSubjects);
    const prevSubjects: CheckoutInsuredSubject[] = this.fromInsuranceHoldersToCheckoutSubjects(responseOrder);
    const missingSubjects = prevSubjects.filter(ps => !coSubjects.some(s => s.id === ps.id));
    newHolders.push(...missingSubjects.map(ms => Object.assign({ _destroy: true }, ms)));
    return this.fromCheckoutSubjectsToInsuranceHolders(newHolders);
  }

  computeShipmentsAddressAttributes(coShipments: CheckoutInsuredShipment[], responseOrder: ResponseOrder): { [key: string]: ShipmentAddressAttributes } {
    const newShipments = Object.assign([], coShipments);
    const prevSubjects: CheckoutInsuredShipment[] = this.fromInsuranceShipmentsToCheckoutShipments(responseOrder);
    const missingSubjects = prevSubjects.filter(ps => !coShipments.some(s => s.id === ps.id));
    newShipments.push(...missingSubjects.map(ms => Object.assign({ _destroy: true }, ms)));
    return this.fromCheckoutShipmentsToInsuranceShipments(newShipments);
  }

  canConfirm() {
    if (!this.componentRef) {
      return false;
    }
    try {
      return this.componentRef.instance.isFormValid();
    } catch (excpetion) {
      /* thrown when form is not initialized yet */
      return false;
    }
  }

  fromCheckoutSubjectsToInsuranceHolders(coSubjects: CheckoutInsuredSubject[]): { [key: string]: InsuranceHoldersAttributes } {
    return coSubjects.reduce((acc, subject, idx) => {
      acc[idx + ''] = this.fromCheckoutSubjectToInsuranceHolder(subject);
      acc[idx + ''] = subject._destroy ? Object.assign(acc[idx + ''], { _destroy: true }) : acc[idx + ''];
      return acc;
    }, {});
  }

  fromCheckoutShipmentsToInsuranceShipments(coShipments: CheckoutInsuredShipment[]): { [key: string]: InsuranceHoldersAttributes } {
    return coShipments.reduce((acc, shipment, idx) => {
      acc[idx + ''] = this.fromCheckoutShipmentToInsuranceShipment(shipment);
      acc[idx + ''] = shipment._destroy ? Object.assign(acc[idx + ''], { _destroy: true }) : acc[idx + ''];
      return acc;
    }, {});
  }

  fromCheckoutSubjectToInsuranceHolder(subject: CheckoutInsuredSubject): InsuranceHoldersAttributes {
    const ihattrs: InsuranceHoldersAttributes = {
      id: subject.id,
      first_name: subject.firstName,
      last_name: subject.lastName,
      relationship: subject.familyRelationship,
    };

    if (subject.birthDate) {
      ihattrs.birth_date = moment(subject.birthDate).format('YYYY-MM-DD');
    }
    if (subject.taxcode) {
      ihattrs.taxcode = subject.taxcode;
    }
    if (subject.birthCountry && subject.birthCountry.id) {
      ihattrs.birth_country_id = subject.birthCountry.id;
    }
    if (subject.birthState && subject.birthState.id) {
      ihattrs.birth_state_id = subject.birthState.id;
    }
    if (subject.birthCity && subject.birthCity.id) {
      ihattrs.birth_city_id = subject.birthCity.id;
    }
    if (subject.phone) {
      ihattrs.phone = subject.phone;
    }
    if (subject.email) {
      ihattrs.email = subject.email;
    }
    if (subject.phone) {
      ihattrs.phone = subject.phone;
    }
    if (subject.residentialAddress) {
      ihattrs.address1 = subject.residentialAddress;
    }
    if (subject.postCode) {
      ihattrs.zipcode = subject.postCode;
    }
    if (subject.residentialCity) {
      ihattrs.city = subject.residentialCity;
    }
    if (subject.residentialState) {
      ihattrs.state_id = subject.residentialState.id ? subject.residentialState.id : subject.residentialState;
    }
    if (subject.residentialCountry) {
      ihattrs.country_id = subject.residentialCountry.id;
    }
    if (subject.hasOwnProperty('contractor') && subject.hasOwnProperty('only_contractor')) {
      ihattrs.contractor = subject.contractor;
      ihattrs.only_contractor = subject.only_contractor;
      if (subject.only_contractor || subject.contractor) {
        ihattrs.address = subject.address;
        ihattrs.profession = subject.profession;
        ihattrs.toponym_code = subject.toponymCode;
        ihattrs.domicile_house_number = subject.domicileHouseNumber;
      }
    }
    return ihattrs;
  }

  fromCheckoutShipmentToInsuranceShipment(shipment: CheckoutInsuredShipment): ShipmentAddressAttributes {
    const ihattrs: ShipmentAddressAttributes = {
      id: shipment.id,
      firstname: shipment.firstName,
      lastname: shipment.lastName
    };
    if (shipment.email) {
      ihattrs.email = shipment.email;
    }
    if (shipment.phone) {
      ihattrs.phone = shipment.phone;
    }
    if (shipment.residentialAddress) {
      ihattrs.address = shipment.residentialAddress;
    }
    if (shipment.postCode) {
      ihattrs.zipcode = shipment.postCode;
    }
    if (shipment.residentialCity) {
      ihattrs.city = shipment.residentialCity;
    }
    if (shipment.residentialState) {
      ihattrs.state_id = shipment.residentialState;
    }
    if (shipment.residentialCountry) {
      ihattrs.country_id = shipment.residentialCountry.id;
    }
    return ihattrs;
  }

  handleNextStep() {
    const basePathCheckout = this.route.snapshot.parent.routeConfig.path === 'checkout' ? this.route.snapshot.parent.routeConfig.path : 'apertura';
    this.checkoutService.cancelOngoingCheckout();
    this.componentRef.instance.onBeforeNextStep().pipe(untilDestroyed(this)).subscribe(() => {
      // Create request order object to be sent in postMessage
      const requestOrder = this.createRequestOrder();
      if (requestOrder /* && !!this.dataService.Yin */) {
        const fields = this.dataService.persistFieldToRecover();

        const dataOrder = {
          data: {
            order: requestOrder.order,
            state: 'insurance_info',
            version: NypCheckoutService.version,
            fieldToRecover: fields,
            productCode: this.dataService.product?.product_code,
          },
          orderNumber: this.dataService.getResponseOrder().number
        };
        window.parent.postMessage(dataOrder, '*');
        this.dataService.setRequestOrder(dataOrder.data);
        this.dataService.persistFieldToRecover();
      }
      if (!this.authService.loggedIn || !!this.loginRedirect) {
        if (basePathCheckout === 'checkout') {
          this.loginService.setupRedirectAfterLogin(basePathCheckout);
        } else {
          this.loginService.setupRedirectAfterLogin(basePathCheckout + '/insurance-info');
        }
        this.saveCheckout();
        this.checkoutService.setStepProgressBarAuthFalse({ name: 'address', stepnum: 2 });
        this.router.navigate([basePathCheckout + '/login-register']);
        return;
      }
      // Check if the current window is iFrame, it works on localhost but not on the environment
      /* (window.self !== window.top) */
      if (this.route.snapshot.queryParams.embedded === 'true') {
        return;
      } else {
        super.handleNextStep();
      }
    }, (error) => {
    });
  }

  saveCheckout() {
    const requestOrder = this.createRequestOrder();
    this.checkoutService.saveOngoingCheckout({
      requestOrder: requestOrder,
      responseOrder: this.dataService.responseOrder,
      product: this.dataService.product,
      quotationOrderAttributes: this.dataService.getOrderAttributes()
    });
  }

  public getInsuredSubjects(responseOrder: any) {
    const ocd = this.checkoutService.getOngoingCheckoutData(false) || {} as any;
    const requestOrder = ocd.requestOrder && ocd.requestOrder.order ? ocd.requestOrder.order : null;
    const isInsuredSubjectVehicle = this.isInsuredSubjectVehicle(responseOrder, requestOrder);
    if (isInsuredSubjectVehicle) {
      return this.getVehicles(responseOrder, requestOrder);
    }
    const insuredSubjects = this.fromInsuranceHoldersToCheckoutSubjects(responseOrder);
    return insuredSubjects;
  }

  public getInsuredShipments(responseOrder: any) {
    const insuredShipments = this.fromInsuranceShipmentsToCheckoutShipments(responseOrder);
    return insuredShipments;
  }

  public getVehicleFromRequest(requestOrder: any): any {
    if (!requestOrder || !requestOrder.line_items_attributes['0'] || !requestOrder.line_items_attributes['0'].vehicle_attributes) {
      return null;
    }
    const vehicle_attributes = requestOrder.line_items_attributes['0'].vehicle_attributes;
    const vehicle = {
      brand: vehicle_attributes.brand
      , model: vehicle_attributes.model
      , license_plate: vehicle_attributes.license_plate
    };
    if (!vehicle.model) {
      const vehicle_nomodel = {
        brand: vehicle_attributes.brand,
        license_plate: vehicle_attributes.license_plate
      };
      return vehicle_nomodel;
    }
    return vehicle;
  }

  public getVehicleFromResponse(responseOrder: any): any {
    if (!responseOrder || !responseOrder.line_items[0] || !responseOrder.line_items[0].vehicle) {
      return null;
    }
    const vehicle_attributes = responseOrder.line_items[0].vehicle;
    const vehicle = {
      brand: vehicle_attributes.brand,
      model: vehicle_attributes.model,
      id: vehicle_attributes.id,
      license_plate: vehicle_attributes.license_plate
    };
    if (!vehicle.model) {
      const vehicle_nomodel = {
        brand: vehicle_attributes.brand,
        id: vehicle_attributes.id,
        license_plate: vehicle_attributes.license_plate
      };
      return vehicle_nomodel;
    }
    return vehicle;

  }

  public isInsuredSubjectVehicle(responseOrder: any, requestOrder: any) {
    if (!responseOrder && !requestOrder) {
      return false;
    }
    if (responseOrder && responseOrder.line_items[0] && responseOrder.line_items[0].vehicle) {
      return true;
    }
    if (requestOrder && requestOrder.line_items_attributes['0'] && requestOrder.line_items_attributes['0'].vehicle_attributes) {
      return true;
    }
    return false;
  }

  public getVehicle(responseOrder: any, requestOrder: any) {
    const vehicle_response = this.getVehicleFromResponse(responseOrder);
    if (vehicle_response) {
      return vehicle_response;
    }
    const vehicle_request = this.getVehicleFromRequest(requestOrder);
    if (vehicle_request) {
      return vehicle_request;
    }
    return null;
  }

  public getVehicles(responseOrder: any, requestOrder: any) {
    const vehicle = this.getVehicle(responseOrder, requestOrder);
    const vehicles = [];
    if (vehicle) {
      vehicles.push(vehicle);
    }
    return vehicles;
  }

  public productContainsVehicle(product: any) {
    if (!product) {
      return false;
    }
    if (!!product.brand && !!product.licensePlate) {
      return true;
    }
    return false;
  }

  ngOnDestroy() {

  }

  createAddonsRequestQuote(addons: any, lineItem: any) {
    const arrayAddon = [];
    addons.forEach(addon => {
      let addonLineItemId = null;
      //flusso per modifica addon genertel motor, gestisce logica del passaggio dell'id
      //se si torna indietro dallo step address allo step insurance-info
      if (['ge-motor-car', 'ge-motor-van'].includes(this.currentStep.product.code)) {
        if (this.addonsFromOrder) {
          this.addonsFromOrder.forEach(item => {
            if (item.code === addon.code) {
              addonLineItemId = item.addon_line_item_id;
            }
          });
        }
      } else if (['htrv-basic', 'htrv-premium'].includes(this.currentStep.product.code)) {
        if (this.addonsFromOrder) {
          this.addonsFromOrder.forEach(item => {
            if (item.code === addon.code) {
              addonLineItemId = item.addon_line_item_id;
            }
          });
        } else {
          lineItem.addons.forEach(item => {
            if (item.code === addon.code) {
              addonLineItemId = item.addon_line_item_id;
            }
          });
        }
      } else {
        if (lineItem.addons) {
          lineItem.addons.forEach(item => {
            if (item.code === addon.code) {
              addonLineItemId = item.addon_line_item_id;
            }
          });
        }
      }
      arrayAddon.push({
        addon_id: addon.id,
        id: addonLineItemId,
        maximal: addon.selectedMaximal || addon.importoMassimaleAssicurato,
        purchase_date: addon.datePurchase,
        travel_value: addon.valueTravel
      });
    });
    return arrayAddon;
  }

  private fromInsuranceHoldersToCheckoutSubjects(responseOrder: ResponseOrder): CheckoutInsuredSubject[] {
    return this.extractInsuredSubjects(responseOrder).map(ih => {
      const relationship = <CheckoutFamilyRelationship>ih.relationship;
      const is: CheckoutInsuredSubject = {
        familyRelationship: relationship,
        lastName: ih.lastname || ih.last_name,
        firstName: ih.firstname || ih.first_name,
        id: ih.id,
        birthDate: moment(ih.birth_date, 'YYYY-MM-DD').toDate()
      };
      if (ih.taxcode) {
        is.taxcode = ih.taxcode;
      }
      if (ih.birth_country) {
        is.birthCountry = ih.birth_country;
      }
      if (ih.birth_state) {
        is.birthState = ih.birth_state;
      }
      if (ih.birth_city) {
        is.birthCity = ih.birth_city;
      }
      if (ih.address1) {
        is.residentialAddress = ih.address1;
      }
      if (ih.state) {
        is.residentialState = ih.state;
      }
      if (ih.city) {
        is.residentialCity = ih.city;
      }
      if (ih.zipcode) {
        is.postCode = ih.zipcode;
      }
      return is;
    });
  }

  private fromInsuranceShipmentsToCheckoutShipments(responseOrder: ResponseOrder): CheckoutInsuredShipment[] {
    return this.extractInsuredShipments(responseOrder).map(ih => {
      if (ih) {
        const is: CheckoutInsuredShipment = {
          lastName: ih.lastname || ih.last_name,
          firstName: ih.firstname || ih.first_name,
          id: ih.id,
          residentialAddress: ih.address || ih.address1,
          postCode: ih.zipcode,
          residentialCity: ih.city,
          residentialState: ih.state_id || ih.state,
          residentialCountry: ih.country_id || ih.country,
          email: ih.email,
          phone: ih.phone
        };
        return is;
      }
    });
  }

  private extractInsuredSubjects(responseOrder) {
    const ihs = responseOrder.line_items[0].insured_entities.insurance_holders;
    if (!!ihs && ihs.length) {
      return ihs;
    }
    const ocd = this.checkoutService.getOngoingCheckoutData(false) || {} as any;
    const ihsFromRequestOrder = ocd.requestOrder;
    if (!!ihsFromRequestOrder) {
      if (this.hasSingleInsuranceHolder(ocd.product.product_code)) {
        const ih = [];
        ih.push(ocd.requestOrder.order.line_items_attributes['0'].insurance_holder_attributes);
        return ih;
      } else {
        return Object.values(ocd.requestOrder.order.line_items_attributes['0'].insurance_holders_attributes
          || ocd.requestOrder.order.line_items_attributes['0'].insurance_info_attributes || ocd.requestOrder.order.line_items_attributes['0'].pet_attributes);
      }
    }
    return [];
  }

  private extractInsuredShipments(responseOrder) {
    const ihs: any[] = [];
    if (responseOrder.line_items[0].insured_entities.shipment_address_attributes) {
      ihs.push(responseOrder.line_items[0].insured_entities.shipment_address_attributes);
    }
    if (!!ihs && ihs.length) {
      return ihs;
    }
    const ocd = this.checkoutService.getOngoingCheckoutData(false) || {} as any;
    const ihsFromRequestOrder = ocd.requestOrder;
    if (!!ihsFromRequestOrder) {
      if (!this.hasMultipleShipments(ocd.product.product_code)) {
        const ih = [];
        ih.push(ocd.requestOrder.order.line_items_attributes['0'].shipment_address_attributes);
        return ih;
      } else {
        return Object.values(ocd.requestOrder.order.line_items_attributes['0'].shipment_address_attributes
          || ocd.requestOrder.order.line_items_attributes['0'].shipment_address_attributes);
      }
    }
    return [];
  }

  private addonsInsuranceInfo(lineItem: LineFirstItem, product: any) {
    const addonsSelected = this.checkoutService.getAddonsStepInsuranceInfo();
    const productLineItem = product.order.line_items[0];
    lineItem.line_item_addons_attributes = this.createAddonsRequestQuote(addonsSelected, productLineItem);
    if (productLineItem.insurance_info.destinations) {
      lineItem.insurance_info_attributes = {
        'destination_ids': productLineItem.insurance_info.destinations.map(element => element.id),
        'travel_date': productLineItem.start_date,
        'travel_end_date': productLineItem.expiration_date
      };
    }
    return lineItem;
  }

  private haveAddonStepInsuranceInfo(productCode: string) {
    this.componentFeaturesService.useComponent('checkout-step-insurance-info');
    this.componentFeaturesService.useRule('have-addons');
    const oneAndOnlyRule = this.componentFeaturesService.isRuleEnabled();
    const pc: Array<string> = this.componentFeaturesService.getConstraints().get('productCodes');
    return oneAndOnlyRule ? pc.includes(productCode) : false;
  }
  getBrandIcon() {
    this.kenticoTranslateService.getItem<any>('navbar').subscribe((item) => {
      this.brandIcon = item?.logo?.value[0].url;
    });
  }

}
