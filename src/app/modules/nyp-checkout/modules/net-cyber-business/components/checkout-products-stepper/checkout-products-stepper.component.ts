import {Component, Input, OnInit } from '@angular/core';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { NypDataService } from 'app/modules/nyp-checkout/services/nyp-data.service';

@Component({
    selector: 'app-checkout-products-stepper',
    templateUrl: './checkout-products-stepper.component.html',
    styleUrls: ['./checkout-products-stepper.component.scss'],
    standalone: false
})
export class CheckoutProductsStepperComponent implements OnInit {

  kenticoContent: any;
  @Input()checkoutService: any;

  constructor(public nypDataService: NypDataService,
  public kenticoTranslateService: KenticoTranslateService) { }


  ngOnInit() {
    this.kenticoTranslateService.getItem<any>('tim_products_steppers').subscribe(item => {
      this.kenticoContent = item;
    });
  }

}
