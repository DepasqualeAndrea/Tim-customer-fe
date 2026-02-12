import {Component, Input, OnInit } from '@angular/core';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { NypDataService } from 'app/modules/nyp-checkout/services/nyp-data.service';

@Component({
  selector: 'app-tim-products-stepper',
  templateUrl: './tim-products-stepper.component.html',
  styleUrls: ['./tim-products-stepper.component.scss']
})
export class TimProductsStepperComponent implements OnInit {
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
