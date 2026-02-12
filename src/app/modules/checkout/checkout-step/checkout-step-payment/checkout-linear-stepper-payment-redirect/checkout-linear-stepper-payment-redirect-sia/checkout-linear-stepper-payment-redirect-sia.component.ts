import {Component, ElementRef, OnInit} from '@angular/core';
import {DataService, InsurancesService} from '@services';
import {take} from 'rxjs/operators';
import {KenticoTranslateService} from '../../../../../kentico/data-layer/kentico-translate.service';

@Component({
  selector: 'app-checkout-linear-stepper-payment-redirect-sia',
  templateUrl: './checkout-linear-stepper-payment-redirect-sia.component.html',
  styleUrls: ['./checkout-linear-stepper-payment-redirect-sia.component.scss']
})
export class CheckoutLinearStepperPaymentRedirectSiaComponent implements OnInit {

  kenticoSiaRedirect: string;

  constructor(private insuranceService: InsurancesService,
              private dataService: DataService,
              private elementRef: ElementRef,
              private kenticoTranslateService: KenticoTranslateService) {
  }

  ngOnInit() {
    this.kenticoTranslateService.getItem<any>('checkout').pipe(take(1)).subscribe(item => {
      this.kenticoSiaRedirect = item.redirect_to_payment.value;
    });
    const paymentMethod = this.dataService.getResponseOrder().payment_methods.find(method => method.name.toLowerCase().includes('sia'));
    const orderNumber = this.dataService.getResponseOrder().number;
    const request = {order_number: orderNumber};
    this.insuranceService.getSiaPaymentRedirect(request, paymentMethod.id.toString()).subscribe(resp => {
      const containerHtmlSia = this.elementRef.nativeElement.querySelector('.container-html-sia');
      containerHtmlSia.insertAdjacentHTML('beforeend', resp.body);
      document.forms['frm'].submit();
    });
  }
}
