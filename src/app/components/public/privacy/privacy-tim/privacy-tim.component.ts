import { Component, OnDestroy, OnInit } from '@angular/core';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { untilDestroyed } from 'ngx-take-until-destroy';

@Component({
    selector: 'app-privacy-tim',
    templateUrl: './privacy-tim.component.html',
    styleUrls: ['./privacy-tim.component.scss'],
    standalone: false
})
export class PrivacyTimComponent implements OnInit, OnDestroy {

  privacy: any;

  constructor(private kenticoTranslateService: KenticoTranslateService) { }

  ngOnInit() {
    this.initializeKenticoContent();
  }

  initializeKenticoContent() {
    this.kenticoTranslateService.getItem<any>('privacy').pipe(untilDestroyed(this)).subscribe(item => {
      this.privacy = {
        body: item.privacy_body.value
      };
    });
  }

  ngOnDestroy() {

  }

}
