import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CheckoutProduct } from '../../checkout.model';
import * as moment from 'moment';
import { DataService, InsurancesService, ProductsService, UserService } from '@services';
import { CheckoutStepService } from '../../services/checkout-step.service';
import { Router } from '@angular/router';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { take } from 'rxjs/operators';
import { ComponentFeaturesService } from 'app/core/services/componentFeatures.service';
import { NypInsurancesService, NypUserService } from '@NYP/ngx-multitenant-core';

@Component({
    selector: 'app-checkout-card-recap',
    templateUrl: './checkout-card-recap.component.html',
    styleUrls: ['./checkout-card-recap.component.scss'],
    standalone: false
})
export class CheckoutCardRecapComponent implements OnInit {

  @Input() product: CheckoutProduct;
  @Input() insuredBoxCollapse: boolean;
  @Output() editStepButton = new EventEmitter<any>();


  stepnum: number;
  showMessage = false;
  productsWithDuration = ['tim-for-ski-gold','tim-for-ski-platinum', 'tim-for-ski-silver'];
  destinationName = '';
  insuranceData: any;
  noCollapseProduct: any;
  removeCollapse: boolean;
  content: any;
  imaginDurationLabel: string;
  isWhite = false;
  isLastStep = false;

  constructor(public dataService: DataService,
    private checkoutStepService: CheckoutStepService,
    private productsService: ProductsService,
    private nypInsuranceService: NypInsurancesService,
    private nypUserService: NypUserService,
    public kenticoTranslateService: KenticoTranslateService,
    private componentFeaturesService: ComponentFeaturesService,
    private router: Router) {
  }

  ngOnInit() {
    this.checkoutStepService.checkoutStepAnnounced$.subscribe((res) => {
      this.stepnum = res.stepnum;
    });
    this.isWhite = this.router.url === '/apertura/insurance-info';
    this.isLastStep = this.router.url === '/apertura/complete';
    this.product.order.line_items[0].insurance_info = this.product.order.line_items[0].insurance_info || {};
    this.showInstantMessage();
    this.getDestinationName();
    this.changeStepTitleValue();
    this.getInsuranceInfoCyberLabelRecap();
    this.getInsuranceInfoCyberValueRevenueRangeRecap();
    this.insuredBoxCollapse = this.hideInsuredBoxCollapse();
  }

  hideInsuredBoxCollapse(): boolean {
    this.componentFeaturesService.useComponent('checkout-step-insurance-info');
    this.componentFeaturesService.useRule('remove-insuredBox-collapse');
    this.removeCollapse = this.componentFeaturesService.isRuleEnabled();
    this.noCollapseProduct = this.componentFeaturesService.getConstraints().get('productCodes');
    if (this.removeCollapse) {
      if (this.noCollapseProduct.includes(this.product.code)) {
        return false;
      } else {
        return true;
      }
    } else {
      return true;
    }
  }

  getDestinationName() {
    if (this.product.code === 'htrv-basic' || this.product.code === 'htrv-premium') {
      this.destinationName = this.joinDestinationsString(this.product.order.line_items[0].insurance_info.destinations);
    } else {
      this.nypUserService.getCountries(this.dataService.countriesEndpoint).subscribe(countries => {
        const targetCountry = countries.find(c => c.id === this.product.order.line_items[0].insurance_info.destination?.id);
        this.destinationName = targetCountry && targetCountry.name || '';
      });
    }
  }

  setDuration(product) {
    const x = moment(product.endDate).diff(moment(product.startDate), product.durationUnit || 'days');
   if ((this.product.code === 'tim-for-ski-gold' || this.product.code === 'tim-for-ski-platinum'|| this.product.code === 'tim-for-ski-silver') && (product.order.line_items[0].variant.name !== 'Seasonal')) {
      return (this.dataService.daysOfCoverage === 1) ? (this.dataService.daysOfCoverage + ' giorno') : (this.dataService.daysOfCoverage+ ' giorni');
    } else if ((this.product.code === 'tim-for-ski-gold' || this.product.code === 'tim-for-ski-platinum'|| this.product.code === 'tim-for-ski-silver') && (product.order.line_items[0].variant.name === 'Seasonal')) {
      return 'Stagionale';
    } 
  }

  goBack() {
    const uniq = this.product.originalProduct.properties.find(p => p.name === 'uniq_name');
    if (uniq) {
      this.nypInsuranceService.getProducts().subscribe(response => {
        const list = response.products.filter(product => product.properties.some(prop => prop.name === 'uniq_name' && prop.value === uniq.value));
        this.router.navigate(['/preventivatore', { code: list.map(item => item.product_code) }]);
      });
    } else {
      this.router.navigate(['/preventivatore', { code: [this.product.originalProduct.product_code] }]);
    }
  }

  showInstantMessage() {
    this.showMessage = this.product.order.line_items[0].instant && (this.product.code === 'ge-travel-plus' || this.product.code === 'ge-travel-premium');
  }

  getPriceRange() {
    return this.product.order.line_items[0].variant.option_values.find(ov => ov.option_type_name === 'price_range').presentation;
  }

  getTransporList() {
    return this.product.order.data.quotation_response.QuotationRequest.TravelPolicy.MeansOfTransport.join(', ');
  }

  durationIsDisplay(productCode) {
    return this.productsWithDuration.includes(productCode);
  }

  destinationIsDisplay(product) {
    return product.order.line_items[0].insurance_info.destination && product.order.line_items[0].insurance_info.destination.id && !product.code.startsWith('ge-holiday-house') && !product.code.startsWith('TRVLPCK') && !product.code.startsWith('trvlpcknet') && !product.code.startsWith('htrv');
  }

  getSciDestinationName() {
    const destinationCode = this.product.order.line_items[0].insurance_info.travel_destination;
    return this.productsService.getTravelDestinationsName(this.product.originalProduct.travel_detinations).find(d => d.value === destinationCode).label;
  }

  getEmployessDisplay() {
    const currentVariant = this.product.originalProduct.variants.find(variant => {
      if (variant.id === this.product.variantId) {
        return variant;
      }
    });
    return currentVariant.option_values['0'].presentation;
  }

  getPaymentPeriodDisplay() {
    const currentVariant = this.product.originalProduct.variants.find(variant => {
      if (variant.id === this.product.variantId) {
        return variant;
      }
    });
    return currentVariant.sku.includes('TUTLEG1_') ? 'Mensile' :
      currentVariant.sku.includes('TUTLEG12') ? 'Annuale' : null;
  }

  showGuaranteesCard() {
    return this.product.code.startsWith('ge-ski-seasonal');
  }

  getPandemicVariantSku(variantId) {
    return this.product.originalProduct.variants.find(variant =>
      variant.id === variantId
    ).sku;
  }

  getVariantPresentation() {
    this.product.originalProduct.variants.map((v, i) => {
      if (this.product.originalProduct.variants_names) {
        v.option_values[0].presentation = this.product.originalProduct.variants_names[i].name;
      }
    });
    return this.product.originalProduct.variants.find(v => v.id === this.product.variantId).option_values[0].presentation;
  }

  changeStepTitleValue() {
    if (this.product.code === 'tim-for-ski-gold' || this.product.code === 'tim-for-ski-platinum'|| this.product.code === 'tim-for-ski-silver') {
      this.kenticoTranslateService.getItem<any>('checkout_tim_for_ski').pipe(take(1)).subscribe(item => {
        this.insuranceData = item.card_list.card_insured_1.title.value;
      });
    }
  }

  getInsuranceInfoCyberLabelRecap() {
    if (this.product.code === 'net-cyber-gold' || this.product.code === 'net-cyber-platinum') {
      this.kenticoTranslateService.getItem<any>('checkout_cyber').pipe(take(1)).subscribe(item => {
        this.content = {
          revenue: item.card_list.card_cyber.revenue.value,
          paymentFrequency: item.card_list.card_cyber.payment.value
        };
      });
    }
  }

  getInsuranceInfoCyberValueMethodPaymentRecap() {
    const methodPayment = this.product.order.line_items[0].payment_frequency.includes('M') ? 'Mensile' :
      this.product.order.line_items[0].payment_frequency.includes('Y') ? 'Annuale' : null;
    return methodPayment;
  }

  getInsuranceInfoCyberValueRevenueRangeRecap() {
    if (this.product.code === 'net-cyber-gold' || this.product.code === 'net-cyber-platinum') {
      const revenueRange = this.product.order.line_items[0].variant.option_values.find(pres => pres.option_type_name === 'maximal').presentation === '1000000' ? 'Fino a 1.000.000 €' :
        this.product.order.line_items[0].variant.option_values.find(pres => pres.option_type_name === 'maximal').presentation === '5000000' ? 'Da 1.000.001 € a 5.000.000 €' : 'Da 5.000.001 € a 20.000.000 €';
      return revenueRange;
    }
  }

  getPackageVariantName() {
    return this.product.code === 'erv-mountain-gold' || this.product.code === 'erv-mountain-silver' || this.product.code === 'ergo-mountain-gold' || this.product.code === 'ergo-mountain-silver' ? this.product.originalProduct.variants.find(variant => variant.id === this.product.variantId).option_values[0].presentation : this.product.name;
  }

  startDateInsurance(lineItem) {
    return ((this.dataService.tenantInfo.tenant === 'civibank_db' || this.dataService.tenantInfo.tenant === 'banco-desio_db')
      && (this.product.code === 'htrv-basic' || this.product.code === 'htrv-premium'))
      ? moment(lineItem.start_date).format('DD/MM/YYYY')
      : moment(lineItem.start_date).format('DD-MM-YYYY');
  }

  endDateInsurance(lineItem) {
    return ((this.dataService.tenantInfo.tenant === 'civibank_db' || this.dataService.tenantInfo.tenant === 'banco-desio_db')
      && (this.product.code === 'htrv-basic' || this.product.code === 'htrv-premium'))
      ? moment(lineItem.expiration_date).subtract(1, 'days').format('DD/MM/YYYY')
      : moment(lineItem.expiration_date).subtract(1, 'days').format('DD-MM-YYYY');
  }

  private joinDestinationsString(destinations: any) {
    let destinationsString = '';
    destinations.forEach((dest, i) => {
      destinationsString = destinationsString + (i === 0 ? '' : ', ') + dest.country;
    });
    return destinationsString;
  }

  editStep() {
    this.editStepButton.emit('insurance-info');
  }
}
