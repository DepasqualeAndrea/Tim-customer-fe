import { Component, OnInit } from '@angular/core';
import { DataService } from '@services';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-not-confirmed-imagin',
  templateUrl: './not-confirmed-imagin.component.html',
  styleUrls: ['./not-confirmed-imagin.component.scss']
})
export class NotConfirmedImaginComponent implements OnInit {

  notConfirmed: any;

  constructor(
    private dataService: DataService,
    private kenticoTranslateService: KenticoTranslateService
  ) { }

  ngOnInit() {
    this.dataService.isSplash = true;
    this.initializeKenticoContent();
  }

  initializeKenticoContent() {
    this.kenticoTranslateService.getItem<any>('page_not_confirmed').pipe(take(1)).subscribe(item => {
      this.notConfirmed = {
        logo: item.logo_not_confirmed.value[0].url,
        title: item.title_not_confirmed.value
      };
    });
  }

  ngOnDestroy() {
    this.dataService.isSplash = false;
  }


}
