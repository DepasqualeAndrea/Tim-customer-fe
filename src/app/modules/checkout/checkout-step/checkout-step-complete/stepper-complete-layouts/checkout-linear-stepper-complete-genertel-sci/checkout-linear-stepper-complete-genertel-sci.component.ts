import { Component, Input, OnInit } from '@angular/core';
import { ResponseOrder } from '@model';
import { DataService } from '@services';
import moment from 'moment';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { CheckoutSciGenertelContent } from '../../../checkout-step-insurance-info/checkout-step-insurance-info-genertel-sci/checkout-step-insurance-info-genertel-sci-content';
import { GtmInitDataLayerService } from 'app/core/services/gtm/gtm-init-datalayer.service';

@Component({
    selector: 'app-checkout-linear-stepper-complete-genertel-sci',
    templateUrl: './checkout-linear-stepper-complete-genertel-sci.component.html',
    styleUrls: ['./checkout-linear-stepper-complete-genertel-sci.component.scss'],
    standalone: false
})
export class CheckoutLinearStepperCompleteGenertelSciComponent implements OnInit {

  @Input() startHoursMinutes: string;
  @Input() startDate: string;
  responseOrder: any;
  dateAndHour: { hour: string; date: any; };
  content: CheckoutSciGenertelContent;

  constructor(
    private dataService: DataService,
    private kenticoTranslateService: KenticoTranslateService,
    private gtmInitDataLayerService: GtmInitDataLayerService
  ) { }

  ngOnInit() {
    this.responseOrder = this.dataService.responseOrder;
    moment.locale('it');
    this.dateAndHour = {
      hour: moment(this.responseOrder.line_items[0].start_date).format('HH:mm'),
      date: moment(this.responseOrder.line_items[0].start_date).format('DD') + ' ' + moment(this.responseOrder.line_items[0].start_date).format('MMMM') + ' ' + moment(this.responseOrder.line_items[0].start_date).format('YYYY')
    };
    this.getContent();
    this.pushGtmNavigationEvent()
  }

  public goToSite(): void {
    window.location.href = 'https://www.genertel.it/assicurazioni-sci';
    this.getContent();
  }

  getContent(){
    this.kenticoTranslateService.getItem<any>('checkout_sci_genertel').subscribe((json) => {
      this.content = {
       complete : {
         success_title: json.success_title.value,
         success_title_secondary: json.success_title_secondary.value,
         success_img: json.success_img.value[0].url,
         thank_you_page_txt: json.thank_you_page_txt.value,
         thank_you_page_main_scelta_data: (json.thank_you_page_main_scelta_data.value).replace('{{date}}', this.dateAndHour.date ),
         thank_you_page_main_da_subito: (json.thank_you_page_main_da_subito.value).replace('{{time}}', this.dateAndHour.hour ),
         insurance_secondary_desc: json.insurance_secondary_desc.value,
         back_site_btn: json.back_site_btn.value
       }
      };
     });
  }

  private pushGtmNavigationEvent() {
    this.gtmInitDataLayerService.preventivatoreCustomTags({
      vpv: '/preventivatore/diretto/sci/pagamento-completato',
      vpvt: 'Preventivatore Sci - Pagamento Completato'
    })
  }

}
