import { DataService } from '@services';
import { take } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';

@Component({
  selector: 'app-partner-prev-cb',
  templateUrl: './partner-prev-cb.component.html',
  styleUrls: ['./partner-prev-cb.component.scss']
})
export class PartnerPrevCbComponent implements OnInit {

  logo: any;

  constructor(
    private kenticoTranslateService: KenticoTranslateService,
    public dataService: DataService,
  ) { }

  ngOnInit() {
    this.kenticoTranslateService.getItem<any>('products_page.partner_prev').pipe(take(1)).subscribe(item => {
      this.logo = item.value.find(i => i.system.codename === 'genertel_logo').thumbnail.value[0].url;
    });
  }

}
