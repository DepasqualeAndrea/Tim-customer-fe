import { Component, OnInit } from '@angular/core';
import { DataService } from '@services';
import { NypDataService } from '../../services/nyp-data.service';
import { digitalData } from 'app/core/services/adobe_analytics/adobe-analytics-data.model';
import { AdobeAnalyticsDatalayerService } from 'app/core/services/adobe_analytics/adobe-init-datalayer.service';

@Component({
  selector: 'app-nyp-main',
  template: '<router-outlet></router-outlet>',
  styles: ['']
})
export class NypMainComponent implements OnInit {

  constructor(
    private dataService: DataService,
    private nypDtaService: NypDataService,
    private adobeAnalyticsDataLayerService: AdobeAnalyticsDatalayerService,
  ) { }

  ngOnInit(): void {
    // send _satellite track
    // moved inside sub page
    // let digitalData: digitalData = window['digitalData'];
    // this.adobeAnalyticsDataLayerService.pushAdobeCustomTags(digitalData);
    
    const yin = this.dataService.Yin;
    if (!!yin?.product)
      localStorage.setItem('product_code', yin.product);
    if (
      !!yin?.orderNumber &&
      (!this.nypDtaService.OrderCode ||
        this.nypDtaService.OrderCode == yin.orderNumber)
    )
      this.nypDtaService.OrderCode = yin.orderNumber;
  }

}
