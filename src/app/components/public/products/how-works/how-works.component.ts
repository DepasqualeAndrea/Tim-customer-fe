import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { Component, Input, OnInit } from '@angular/core';
import { DataService } from '@services';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-how-works',
  templateUrl: './how-works.component.html',
  styleUrls: ['./how-works.component.scss']
})
export class HowWorksComponent implements OnInit {

  @Input() howWorks;

  constructor(
    public dataService: DataService,
    private kenticoTranslateService: KenticoTranslateService) {
  }

  ngOnInit() {
    if (this.dataService.tenantInfo.tenant === 'chebanca_db' || this.dataService.tenantInfo.tenant === 'ravenna_db' || this.dataService.tenantInfo.tenant === 'banco-desio_db' || this.dataService.tenantInfo.tenant === 'civibank_db') {
      this.kenticoTranslateService.getItem<any>('products_page.how_works').pipe(take(1)).subscribe(item => {
        this.howWorks.title = item.value.find(i => i.system.codename === 'how_works_title').text.value;
        this.howWorks.steps = item.value
          .filter(card => card.system.type === 'text_img_card')
          .map(step => (
            { title: step.title.value, description: step.subtitle.value, image: step.image.value[0].url }
          ));
      });
    }
  }
}

