import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BikeQuotationResponse, LineFirstItem, ResponseOrder } from '@model';
import { AuthService, DataService, InsurancesService, UserService } from '@services';
import { costLineItemGeneratorFactory } from 'app/modules/checkout/services/cost-line-generators/line-generator-factory';
import { TimeHelper } from 'app/shared/helpers/time.helper';
import * as moment from 'moment';
import { Observable, zip } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { KenticoTranslateService } from '../../../../kentico/data-layer/kentico-translate.service';
import { CheckoutCardDateTimeComponent } from '../../../checkout-card/checkout-card-date-time/checkout-card-date-time.component';
import { CheckoutCardInsuredSubjectsComponent } from '../../../checkout-card/checkout-card-insured-subjects/checkout-card-insured-subjects.component';
import { CheckoutPeriod, CheckoutProductCostItem } from '../../../checkout.model';
import { CheckoutStepService } from '../../../services/checkout-step.service';
import { CheckoutStepInsuranceInfoDynamicComponent } from '../checkout-step-insurance-info-dynamic-component';
import { CheckoutStepInsuranceInfoHelper } from '../checkout-step-insurance-info.helper';
import { CheckoutInsuredSubject, CheckoutStepInsuranceInfoProduct } from '../checkout-step-insurance-info.model';
import { PriceChangedReason } from '../price-changed-reason.enum';

@Component({
  selector: 'app-checkout-step-insurance-info-chubb-deporte',
  templateUrl: './checkout-step-insurance-info-chubb-deporte.component.html',
  styleUrls: ['./checkout-step-insurance-info-chubb-deporte.component.scss']
})
export class CheckoutStepInsuranceInfoChubbDeporteComponent extends CheckoutStepInsuranceInfoDynamicComponent implements OnInit {

  product: CheckoutStepInsuranceInfoProduct;

  minAgeBirthDate = moment().subtract(4, 'year').format('DD/MM/YYYY');

  periodOptions: { minDate: Date, maxDate: Date };

  @ViewChild('periodCard', { static: true }) periodCard: CheckoutCardDateTimeComponent;

  @ViewChild('insuredSubjectsCard', { static: true }) insuredSubjectsCard: CheckoutCardInsuredSubjectsComponent;


  ssoUser = {};


  constructor(private dataService: DataService,
    private checkoutStepService: CheckoutStepService,
    private authService: AuthService,
    private insuranceService: InsurancesService,
    private kenticoTranslateService: KenticoTranslateService,
    protected userService: UserService,
    protected router: Router,
  ) {
    super();
  }

  ngOnInit() {
    this.adjustSubjectIsContractor();
    this.product.extra = Object.assign({ label: 'Deporte', values: [] }, this.product.extra);
    this.product.extraSelected = this.dataService.getResponseOrder().line_items[0].insurance_info.extra;
    this.product.duration = this.product.duration || moment(this.product.endDate).diff(this.product.startDate, 'days');
    this.product.durationUnit = this.product.durationUnit || 'days';
    this.periodOptions = {
      minDate: TimeHelper.roundDate(moment().add(2, 'hours').toDate(), 15),
      maxDate: moment().add(1, 'year').toDate()
    };
  }

  adjustSubjectIsContractor() {
    if (this.authService.loggedIn) {
      const address = Object.assign({}, this.authService.loggedUser.address);
      const user = CheckoutStepInsuranceInfoHelper.findUserInInsuredSubjectsByNameAndBirthDate(address, this.product.insuredSubjects);
      if (user) {
        user.isContractor = true;
      }
    }
  }

  computeProduct(): CheckoutStepInsuranceInfoProduct {
    const userInfo = this.authService.loggedUser.address;
    const period: CheckoutPeriod = this.periodCard.computeModel();
    const insuredSubjects: CheckoutInsuredSubject[] = this.insuredSubjectsCard.computeModel();
    const insuredIsContractor: boolean = this.insuredSubjectsCard.contractorIsInsured();
    if (insuredIsContractor && this.authService.loggedIn) {
      const address = Object.assign({}, userInfo);
      const user = CheckoutStepInsuranceInfoHelper.findUserInInsuredSubjectsByNameAndBirthDate(address, this.product.insuredSubjects);
      const id = !!user ? user.id : null;
      insuredSubjects.push(CheckoutStepInsuranceInfoHelper.fromAddressToInsuredSubject(id, address));
    }
    return Object.assign({}, this.product, period, { insuredIsContractor, insuredSubjects, instant: period.instant });
  }

  isFormValid(): boolean {
    return (
      this.periodCard.form.valid &&
      this.insuredSubjectsCard.form.valid
    );
  }

  onBeforeNextStep(): Observable<any> {
    return this.recalculatePrice();
  }

  private loadCostItemsLabel(): Observable<string[]> {
    const labelCostItemsTranslations = [
      this.kenticoTranslateService.getItem('checkout.unit_cost'),
      this.kenticoTranslateService.getItem('checkout.total_price')
    ];
    return zip(...labelCostItemsTranslations).pipe(take(1)
      , map(policyStatus => policyStatus.map<string>((item: any) => item.value)));
  }

  recalculatePrice(): Observable<BikeQuotationResponse> {
    return this.loadCostItemsLabel()
      .pipe(switchMap((labelCostItems) => {
        const product = this.computeProduct();
        const quotationRequest = this.computeQuotationRequest(product);
        const total = this.dataService.getResponseOrder().item_total;
        const oaDifference = CheckoutStepInsuranceInfoHelper.diffOrderAttributes(this.dataService.getOrderAttributes(), quotationRequest);
        const agesChanged = CheckoutStepInsuranceInfoHelper.quantity(oaDifference);
        if (this.dataService.tenantInfo.tenant === 'santa-lucia_db') {
          return this.insuranceService.submitSantaLuciaSportQuotation(quotationRequest).pipe(tap((quotationResponse: any) => {
            if ((agesChanged > 0 || total !== quotationResponse.additional_data.total_price) ||
              (agesChanged === 0 && total !== quotationResponse.additional_data.total_price)) {
              const changeValue = CheckoutStepInsuranceInfoHelper.computePriceChangeEnumReason(agesChanged, total, quotationResponse);
              let labelName: string;
              switch (changeValue) {
                case PriceChangedReason.ChangedByAge:
                  labelName = 'checkout.recalculated_price_age';
                  break;
                case PriceChangedReason.ChangeAgeNotCorresponding:
                  labelName = 'checkout.age_not_corresponding';
                  break;
                default:
                  break;
              }
              const updatedOrder = this.getOrderPriceAfterQuotation(quotationResponse, this.dataService.getResponseOrder());
              const productFromDataService = this.dataService.getResponseProduct();
              const costItems = this.computeCostItems(productFromDataService, updatedOrder as ResponseOrder, labelCostItems);
              if (!!labelName) {
                this.kenticoTranslateService.getItem<any>(labelName).pipe(take(1)).subscribe(translation => {
                  this.checkoutStepService.potentialPriceChange({ current: quotationResponse.additional_data.total_price, previous: total, reason: translation.value, costItems: costItems });
                });
              } else {
                this.checkoutStepService.potentialPriceChange({ current: quotationResponse.additional_data.total_price, previous: total, reason: '', costItems: costItems });
              }
            }
          }));
        } else {
          return this.insuranceService.submitSportQuotation(quotationRequest).pipe(tap((quotationResponse: any) => {
            if ((agesChanged > 0 || total !== quotationResponse.total_price) ||
              (agesChanged === 0 && total !== quotationResponse.total_price)) {
              const changeValue = CheckoutStepInsuranceInfoHelper.computePriceChangeEnumReason(agesChanged, total, quotationResponse);
              let labelName: string;
              switch (changeValue) {
                case PriceChangedReason.ChangedByAge:
                  labelName = 'checkout.recalculated_price_age';
                  break;
                case PriceChangedReason.ChangeAgeNotCorresponding:
                  labelName = 'checkout.age_not_corresponding';
                  break;
                default:
                  break;
              }
              const updatedOrder = this.getOrderPriceAfterQuotation(quotationResponse, this.dataService.getResponseOrder());
              const productFromDataService = this.dataService.getResponseProduct();
              const costItems = this.computeCostItems(productFromDataService, updatedOrder as ResponseOrder, labelCostItems);
              if (!!labelName) {
                this.kenticoTranslateService.getItem<any>(labelName).pipe(take(1)).subscribe(translation => {
                  this.checkoutStepService.potentialPriceChange({ current: quotationResponse.total_price, previous: total, reason: translation.value, costItems: costItems });
                });
              } else {
                this.checkoutStepService.potentialPriceChange({ current: quotationResponse.total_price, previous: total, reason: '', costItems: costItems });
              }
            }
          }));
        }
      }));
  }

  getOrderPriceAfterQuotation(quotationResponse: any, responseOrder: ResponseOrder): { line_items?: LineFirstItem[], item_total?: number } {
    const totalPrice = quotationResponse.total_price || quotationResponse.additional_data?.total_price;
    const totalPriceBase = quotationResponse.total_price_base || quotationResponse.total;
    const totalPriceRCT = quotationResponse.total_price_RCT || quotationResponse.additional_data?.total_price_RCT;
    const totalPriceEQP = quotationResponse.total_price_EQP || quotationResponse.additional_data?.total_price_EQP;
    responseOrder.item_total = totalPrice;
    const orderAddOns = responseOrder.line_items['0'].addons;
    responseOrder.line_items['0'].total = totalPrice;
    orderAddOns.forEach(addon => {
      if (addon.code === 'sport-equip') {
        addon.price = totalPriceEQP;
      }
      if (addon.code === 'sport-rc') {
        addon.price = totalPriceRCT;
      }
    });
    return responseOrder;

  }

  private computeCostItems(product: any, responseOrder: ResponseOrder, labelCostItem: string[]): CheckoutProductCostItem[] {
    const costLineItemGenerator = costLineItemGeneratorFactory(product, responseOrder);
    return costLineItemGenerator.computeCostItems(labelCostItem);
  }

  computeQuotationRequest(product: CheckoutStepInsuranceInfoProduct): any {
    if (this.dataService.tenantInfo.tenant === 'santa-lucia_db') {
      const addons = this.getProductSelectedAddons();
      const slBody = Object.assign(
        {
          'product_code': this.product.code,
          'product_data': {
            ...this.product.order.data,
            'category': this.product.originalProduct.extras[this.product.extraSelected],
            'duration': this.product.variantId,
            addons
          }
        },
      );
      return slBody;
    } else if (this.dataService.tenantInfo.tenant !== 'santa-lucia_db') {
      return Object.assign({
        variant_id: this.product.variantId,
        addons: (this.dataService.getResponseOrder().line_items[0].addons || []).map(addon => addon.code),
        start_date: moment(product.startDate).format('YYYY-MM-DD'),
        sport: this.product.originalProduct.extras[this.product.extraSelected],
        quantity: product.quantity,
      }, this.getInsuredSubjectAttributes(product));
    }
  }

  getInsuredSubjectAttributes(product: CheckoutStepInsuranceInfoProduct) {
    if (product.insuredIsContractor && !this.authService.loggedIn) {
      return this.dataService.getOrderAttributes();
    }
    return CheckoutStepInsuranceInfoHelper.convertInsuredSubjectsToOrderAttributes(product.insuredSubjects);
  }

  fillLineItem(lineItem: LineFirstItem): void {
    const product = this.computeProduct();
  }

  private getProductSelectedAddons(): any {
    const addonObj = {
      rc: {
        selected: this.product.order.line_items[0].addons.length > 0 ? (this.product.order.line_items[0].addons.find((addon) => addon.code.includes(('rc'))) ? true : false) : false
      },
      equipment: {
        selected: this.product.order.line_items[0].addons.length > 0 ? (this.product.order.line_items[0].addons.find((addon) => addon.code.includes(('equip'))) ? true : false) : false
      }
    };
    return addonObj;
  }

}
