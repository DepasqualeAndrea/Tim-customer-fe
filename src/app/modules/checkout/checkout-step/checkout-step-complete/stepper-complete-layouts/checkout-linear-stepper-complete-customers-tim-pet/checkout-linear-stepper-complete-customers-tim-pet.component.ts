import { Component, Input, OnInit } from '@angular/core';
import { ResponseOrder } from '@model';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { take } from 'rxjs/operators';
import { AdobeAnalyticsDatalayerService } from 'app/core/services/adobe_analytics/adobe-init-datalayer.service';
import { digitalData } from 'app/core/services/adobe_analytics/adobe-analytics-data.model';
import { AuthService, DataService } from '@services';
import { CheckoutProduct } from 'app/modules/checkout/checkout.model';

@Component({
    selector: 'app-checkout-linear-stepper-complete-customers-tim-pet',
    templateUrl: './checkout-linear-stepper-complete-customers-tim-pet.component.html',
    styleUrls: ['./checkout-linear-stepper-complete-customers-tim-pet.component.scss'],
    standalone: false
})
export class CheckoutLinearStepperCompleteCustomersTimPetComponent implements OnInit {

  @Input() order: ResponseOrder;
  @Input() product: CheckoutProduct;
  user: any;
  content: any;

  constructor(
    private kenticoTranslateService: KenticoTranslateService,
    private adobeAnalyticsDataLayerService: AdobeAnalyticsDatalayerService,
    private dataService: DataService,
    private authService: AuthService,
  ) { }

  ngOnInit() {
    this.user = this.authService.loggedUser.firstname; //this.order.bill_address?.firstname;
    this.getKenticoContent();

    if (!!this.order.payments) {
      let lastPayment = this.order.payments[this.order.payments.length - 1];
      if (!!lastPayment?.source_id) {
        let paymentId: string = '';
        this.order.payments_sources.forEach(paymentSource => {
          if (paymentSource.id === lastPayment.source_id) {
            paymentId = paymentSource.payment_id;
          }
        });
        const form: any = {
          paymentmethod: '',
          mypet_pet_type: this.dataService.getParams().kindSelected !== undefined ? this.dataService.getParams().kindSelected : '',
          codice_sconto: '',
          sci_numassicurati: this.dataService.getParams().insuredNumber !== undefined ? this.dataService.getParams().insuredNumber : 0,
          sci_min14: this.dataService.getParams().insuredMinors !== undefined ? this.dataService.getParams().insuredMinors : false,
          sci_polizza: this.dataService.getParams().proposalName !== undefined ? this.dataService.getParams().proposalName : '',
        }
        const number = this.order.id + '';
        let digitalData: digitalData = this.adobeAnalyticsDataLayerService.setDigitalData(this.product, 1, number, {}, form, 'tim broker', paymentId);
        this.adobeAnalyticsDataLayerService.pushAdobeCustomTags(digitalData);
      }
    }
  }

  getKenticoContent() {
    this.kenticoTranslateService.getItem<any>('thank_you_page_tim_pet').pipe(take(1)).subscribe(item => {
      this.createContentItem(item);
    });
  }

  createContentItem(kenticoItem) {
    this.content = {
      image: kenticoItem.image.value[0].url,
      image_alt: kenticoItem.image.value[0].description,
      button: kenticoItem.my_policies_button.value
    };
  }

}
