import { Component, OnInit } from '@angular/core';
import { DataService } from '@services';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { take } from 'rxjs/operators';

@Component({
    selector: 'app-not-confirmed-tim-employees',
    templateUrl: './not-confirmed-tim-employees.component.html',
    styleUrls: ['./not-confirmed-tim-employees.component.scss'],
    standalone: false
})
export class NotConfirmedTimEmployeesComponent implements OnInit {

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
        title: item.title_not_confirmed.value,
        description: item.description_not_confirmed.value
      };
    });
  }

  ngOnDestroy() {
    this.dataService.isSplash = false;
  }


}
