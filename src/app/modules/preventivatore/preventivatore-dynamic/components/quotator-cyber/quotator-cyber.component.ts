import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InsurancesService } from '@services';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { PreventivatoreAbstractComponent } from '../preventivatore-abstract/preventivatore-abstract.component';

@Component({
  selector: 'app-quotator-cyber',
  templateUrl: './quotator-cyber.component.html',
  styleUrls: ['./quotator-cyber.component.scss']
})
export class QuotatorCyberComponent extends PreventivatoreAbstractComponent implements OnInit, OnChanges {

  @Input() product;
  @Output() actionEvent = new EventEmitter<any>();

  public cyberFormGroup: FormGroup;
  quotationPrice: string;

  constructor(
    private formBuilder: FormBuilder,
    private insurancesService: InsurancesService,
    ref: ChangeDetectorRef
  ) {super(ref)}

  ngOnInit() {
    this.cyberFormGroup = this.createFormGroup()
    this.getRevenueVariantsFromProduct(this.product)
    this.getRevenueVariantId(this.product)
    this.getQuotation().subscribe(quotation => this.quotationPrice = quotation.total)
    this.cyberFormGroup.valueChanges.subscribe(values => this.formValueChanged())
  }

  createFormGroup(): FormGroup {
    const formGroup = this.formBuilder.group({
      paymentPeriod:        ['monthly', Validators.nullValidator],
      revenue:              ['1M',  Validators.nullValidator]
    })
    return formGroup
  }

  getRevenueVariantsFromProduct(product: any) {
    return product.variants;
  }

  getProdVariantSku(product: any) {
    let prodVariant: string
    if(product.product_code === 'net-cyber-gold') {
      prodVariant = 'CYG'
    } else {
      prodVariant = 'CYP'
    }
    prodVariant += this.cyberFormGroup.controls.revenue.value
    return prodVariant += this.cyberFormGroup.controls.paymentPeriod.value === 'monthly' ? '_1' : '_12'
  }

  getRevenueVariantId(product: any) {
    const prodVariantSku = this.getProdVariantSku(this.product)
    return product.variants.find(variant => variant.sku === prodVariantSku).id
  }

  getMaximalRevenue(product: any) {
    const prodVariantSku = this.getProdVariantSku(this.product)
    return product.variants.find(variant => variant.sku === prodVariantSku).option_values.find(pres => pres.option_type_name === 'maximal').presentation
  }

  getPaymentFrequency(){
    const paymentPeriods = this.cyberFormGroup.controls['paymentPeriod'].value;
    if (paymentPeriods === 'monthly') {
       return 'M'
    } else {
       return 'Y'
    }
  }

  getQuotation(): Observable<any> {
    const quotationRequest = this.createQuotationPayload()
    return this.insurancesService.submitCyberQuotation(quotationRequest)
    }

  createQuotationPayload(): any {
    const maximal = this.getMaximalRevenue(this.product);
    const payment_frequency = this.getPaymentFrequency();
    
    return {
      tenant: "yolo",
      product_code: this.product.product_code,
      product_data: {
        revenue: maximal,
        duration: payment_frequency
      }
    }
  }

  formValueChanged() {
    this.getQuotation().subscribe(quotation => this.quotationPrice = quotation.total);
  }

  checkout():void {
    const order = this.createRequestOrder();
    this.sendCheckoutAction(order);
  }

  sendCheckoutAction(order: any) {
    const action = {
      action: 'checkout_product'
      , payload: {
        product: this.product
        , order: order
        , router: 'checkout'
      }
    }
    this.sendActionEvent(action);
  }

  createRequestOrder(): any {
    return {
      order: {
        line_items_attributes: {
          0: {
            variant_id: this.getRevenueVariantId(this.product),
            quantity: 1,
            insured_is_contractor: true,
            payment_frequency: this.getPaymentFrequency(),
            start_date: moment().add(1, 'd').format('YYYY-MM-DD'),
            expiration_date:  moment().add(1, 'd').add(1, 'y').format('YYYY-MM-DD')
          },
        },
      }
    }
  }

}
