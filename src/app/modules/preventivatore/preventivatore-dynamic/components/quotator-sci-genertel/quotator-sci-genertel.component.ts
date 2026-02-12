import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService, CheckoutService, DataService, InsurancesService } from '@services';
import { quotatorGenertelSciSubsteps, QuotatorSciStepper } from './quotator-sci-stepper';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { QuotatorSciGenertelContent } from './quotator-sci-genertel-content';
import { Product, ProductAttributes, Variant } from '@model';
import { ContentItem } from 'kentico-cloud-delivery';
import { TimeHelper } from 'app/shared/helpers/time.helper';
import { NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { GtmInitDataLayerService } from 'app/core/services/gtm/gtm-init-datalayer.service';
import { dataLayerSciSubsteps } from './gtm/quotator-substeps-datalayer.value';
import { NypInsurancesService } from '@NYP/ngx-multitenant-core';

@Component({
  selector: 'app-quotator-sci-genertel',
  templateUrl: './quotator-sci-genertel.component.html',
  styleUrls: ['./quotator-sci-genertel.component.scss'],
})
export class QuotatorSciGenertelComponent implements OnInit {

  @Input() products: any;
  peopleQuantity = 0;
  normalPrice: string;
  plusPrice: string;
  formSci: FormGroup;
  currentSubstep: QuotatorSciStepper = QuotatorSciStepper.NUMERO_ASSICURATI;
  content: QuotatorSciGenertelContent;
  selectedPackage: any;
  optionalWarranties: any;
  addonsPrices: any;
  waitQuotation = null;
  duration: any;
  selectedOptionalWarranty: any;
  selectedCard: any;
  opPriceSelected: any;
  isPackageSelected = false;
  totalPricePlus: string;
  totalPriceNormal: string;
  productInfo: Product;
  productInfoPlus: Product;
  variants: Variant[];
  variantsPlus: Variant[];
  hasSeasonStarted: boolean;

  constructor(
    public insuranceService: InsurancesService,
    protected nypInsurancesService: NypInsurancesService,
    public dataService: DataService,
    public checkoutService: CheckoutService,
    public router: Router,
    private kenticoTranslateService: KenticoTranslateService,
    private auth: AuthService,
    private calendar: NgbCalendar,
    private gtmInitDataLayerService: GtmInitDataLayerService
  ) {
    this.dataService.getQuotator().subscribe((data) => {
      if (data) {
        this.router.navigate(['/preventivatore', { code: ['genertel-ski', 'genertel-ski-plus'] }]);
        this.currentSubstep = quotatorGenertelSciSubsteps[0];
        return;
      }
    });
  }

  ngOnInit() {
    this.optionalWarranties = [
      { name: 'death', isActive: false, id: this.products[1].addons[0].id },
      { name: 'equipment', isActive: false, id: this.products[1].addons[1].id },
      { name: 'skipass', isActive: false, id: this.products[1].addons[2].id }];
    this.auth.logout();
    this.getContent();
    this.initForm();
    this.getProductInfo();
    this.setHasSeasonStarted();
    this.pushGtmNavigationEvent()
  }

  private setHasSeasonStarted(): void {
    const today = this.calendar.getToday();
    const seasonStart = TimeHelper.fromDateToNgbDate(new Date(this.products[0].attributes.season_start_date));
    this.hasSeasonStarted = today.equals(seasonStart) || today.before(seasonStart);
  }

  getProductInfo() {
    this.nypInsurancesService.getProduct(this.products[0].id).subscribe((product: Product) => {
      this.productInfo = product;
      this.variants = product.variants;
    });
    this.nypInsurancesService.getProduct(this.products[1].id).subscribe((product: Product) => {
      this.productInfoPlus = product;
      this.variantsPlus = product.variants;
    });
  }

  getContent(): void {
    this.kenticoTranslateService
      .getItem<ContentItem>('preventivatore_sci_genertel')
      .subscribe((item) => {
        this.content = {
          step_1: {
            title: item.title_3ca58e0.value,
            text_age_1: item.text_age_1.value,
            text_age_2: item.text_age_2.value,
            main_icon: item.main_icon.value,
            banner_constraints: item.banner_constraints.value,
          },
          step_2: {
            title: item.title_f145fcc.value,
            icon: item.icon_info.value,
            insurance_days: item.insurance_days.value,
            modal_per_quanto: item.modal_per_quanto.value,
            today: item.today.value
          },
          step_3: {
            title: item.title_77980be.value,
            icon: item.icon.value,
            package_ski_plus: item.package_ski_plus.value,
            package_ski: item.package_ski.value,
            optional_warranties_title: item.optional_warranties_title.value,
            optional_warranties_items: item.optional_warranties_items.value,
            modal_preventivo: item.modal_preventivo.value
          },
          step_4: {
            title: item.title.value,
            card_list_group: item.card_list.value,
            card_list_plus_group: item.card_list_plus.value,
            optional_card_list_plus: item.optional_card_list_plus.value,
          },
          step_5: {
            title: item.title_6e54df8.value,
            countries: item.countries.value,
          },
        };
      });
  }

  initForm(): void {
    this.formSci = new FormGroup({
      peopleOver50: new FormControl(0, [Validators.min(0), Validators.max(10)]),
      peopleUnder50: new FormControl(0, [Validators.min(0), Validators.max(10)]),
      duration: new FormControl('1 day', Validators.required),
      location: new FormControl('ita', Validators.required),
    });
  }

  calculatePeopleQuantity(isSubtracting: boolean, fieldName: string): void {
    if (!isSubtracting) {
      if (this.peopleQuantity < 10) {
        this.formSci.controls[fieldName].setValue(this.formSci.get(fieldName).value + 1);
        this.peopleQuantity++;
      }
    } else {
      if (this.formSci.get(fieldName).value > 0) {
        this.formSci.controls[fieldName].setValue(this.formSci.get(fieldName).value - 1);
        this.peopleQuantity--;
      }
    }
  }

  selectPackage(productCode: string, packageName: string): void {
    this.isPackageSelected = true;
    if (this.formSci.valid) {
      this.selectedPackage = Object.assign({
        token: null,
        tenant: 'yolo',
        product_code: productCode,
        product_data: {
          package: 'normal',
          zone: 'ita',
          duration: this.formSci.value.duration,
          insurance_holders: {
            before_50: this.formSci.value.peopleUnder50,
            after_50: this.formSci.value.peopleOver50,
            total: this.peopleQuantity,
          },
          addons: [
            {
              code: 'death',
              selected: false,
            },
            {
              code: 'equipment',
              selected: false,
            },
            {
              code: 'skipass',
              selected: false,
            },
          ],
        },
      });
      this.gtmInitDataLayerService.pushTag({
        event: 'selezionaPreventivo',
        eventCategory: 'Proposta Preventivo Sci',
        eventAction: 'Scelta preventivo',
        eventName: 'select_item_sci',
        eventLabel: packageName === 'normal'
          ? 'Genertel Sci'
          : 'Genertel Sci +',
        value: packageName === 'normal'
          ? this.totalPriceNormal
          : this.totalPricePlus,
        prevID: null
      })
    }
  }

  selectOptionalWarranty(warranty, price) {
    this.selectedOptionalWarranty = warranty;
    this.opPriceSelected = price;
  }

  selectCard(card) {
    this.selectedCard = card;
  }

  calculatePrice() {
    let body;
    if (this.formSci.valid) {
      body = Object.assign({
        token: null,
        tenant: 'yolo',
        product_code: 'genertel-ski',
        product_data: {
          package: 'normal',
          zone: 'ita',
          duration: this.setDurationVariant(this.formSci.value.duration),
          insurance_holders: {
            before_50: this.formSci.value.peopleUnder50,
            after_50: this.formSci.value.peopleOver50,
            total: this.peopleQuantity,
          },
          addons: [
            {
              code: 'death',
              selected: this.optionalWarranties[0].isActive,
            },
            {
              code: 'equipment',
              selected: this.optionalWarranties[1].isActive,
            },
            {
              code: 'skipass',
              selected: this.optionalWarranties[2].isActive,
            },
          ],
        },
      });
      this.insuranceService.submitCbSkiGenertelQuotation(body).pipe(take(1)).subscribe((res) => {
        this.normalPrice = res.total.split('.');
        this.totalPriceNormal = res.display_total;
        this.waitQuotation = res;
      });
      body.product_data.package = 'plus';
      body.product_code = 'genertel-ski-plus';
      this.insuranceService.submitCbSkiGenertelQuotation(body).pipe(take(1)).subscribe((res) => {
        this.plusPrice = res.total.split('.');
        this.totalPricePlus = res.display_total;
        this.addonsPrices = res.addons;
        this.waitQuotation = res;
        this.duration = res.additional_data.duration;
      });
    }
  }

  checkout() {
    const order = this.createOrderObj();
    this.checkoutService.addToChart(order).subscribe((res) => {
      this.dataService.setRequestOrder(order);
      this.dataService.setResponseOrder(res);
      this.dataService.setProduct(this.products[0]);
      return this.router.navigate(['checkout']);
    });
  }

  setDurationVariant(duration: string) {
    switch (duration) {
      case '1 day':
        return 1;
      case '3 days':
        return 3;
      case '7 days':
        return 7;
      case '14 days':
        return 14;
      case 'Seasonal':
        return 31;
    }
  }

  createOrderObj() {
    this.optionalWarranties.filter((ad) => ad.isActive === true);
    const addonsId = this.optionalWarranties.filter((ad) => ad.isActive === true);
    const variantsForOrder = this.selectedPackage.product_code === 'genertel-ski' ? this.variants : this.variantsPlus;
    this.setDurationVariant(this.formSci.value.duration);
    return {
      order: {
        order_attributes: {
          before_50: this.formSci.value.peopleUnder50,
          after_50: this.formSci.value.peopleOver50,
        },
        line_items_attributes: {
          0: {
            variant_id: this.getVariantId(variantsForOrder, this.formSci.value.duration),
            instant: true,
            quantity: this.peopleQuantity,
            addon_ids: this.selectedPackage.product_code === 'genertel-ski-plus' ? addonsId.map((item) => item.id) : [],
            insurance_info_attributes: {
              travel_destination: this.formSci.value.location,
            }
          }
        }
      }
    };
  }

  setOptionalWarranties(warr): void {
    this.optionalWarranties.filter((warranty) => {
      if (warranty.name === warr) {
        warranty.isActive = !warranty.isActive;
      }
    });
    this.calculatePrice();
  }

  public nextSubStep(): void {
    window.scroll(0, 0);
    if (this.peopleQuantity !== 0) {
      this.currentSubstep = quotatorGenertelSciSubsteps[this.getCurrentSubstepIndex() + 1];
      if (this.currentSubstep === 'preventivo') {
        this.calculatePrice();
      }
    }
    this.pushGtmNavigationEvent()
  }

  public previousSubStep(): void {
    this.currentSubstep = quotatorGenertelSciSubsteps[this.getCurrentSubstepIndex() - 1];
    this.pushGtmNavigationEvent()
  }

  private pushGtmNavigationEvent() {
    this.gtmInitDataLayerService.preventivatoreCustomTags(
      dataLayerSciSubsteps.find(datalayerEvent => datalayerEvent.step === this.currentSubstep).value
    );
  }

  private getCurrentSubstepIndex(): number {
    return quotatorGenertelSciSubsteps.findIndex((substep) => substep === this.currentSubstep);
  }

  getVariantId(variants: any, name: number) {
    return variants.find((variant) => variant.name === name).id;
  }
}
