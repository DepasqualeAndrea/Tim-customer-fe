import { Component, OnDestroy, OnInit } from '@angular/core';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { untilDestroyed } from 'ngx-take-until-destroy';

@Component({
    selector: 'app-terms-tim',
    templateUrl: './terms-tim.component.html',
    styleUrls: ['./terms-tim.component.scss'],
    standalone: false
})
export class TermsTimComponent implements OnInit, OnDestroy {

  terms: any;

  constructor(private kenticoTranslateService: KenticoTranslateService) { }

  ngOnInit() {
    this.initializeKenticoContent();
  }

  initializeKenticoContent() {
    this.kenticoTranslateService.getItem<any>('terms_and_conditions').pipe(untilDestroyed(this)).subscribe(item => {
      this.terms = {
        title: item.header_title.value,
        body: item.terms_body.value
      };
    });
  }

  ngOnDestroy() {

  }

}
