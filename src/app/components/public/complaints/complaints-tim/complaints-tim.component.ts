import { Component, OnInit } from '@angular/core';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { untilDestroyed } from 'ngx-take-until-destroy';

@Component({
  selector: 'app-complaints-tim',
  templateUrl: './complaints-tim.component.html',
  styleUrls: ['./complaints-tim.component.scss']
})
export class ComplaintsTimComponent implements OnInit {
  complaints: any;

  constructor(private kenticoTranslateService: KenticoTranslateService) { }

  ngOnInit() {
    this.initializeKenticoContent();
  }

  initializeKenticoContent() {
    this.kenticoTranslateService.getItem<any>('complaints').pipe(untilDestroyed(this)).subscribe(item => {
      this.complaints = {
        title: item.header_title.value,
        body: item.terms_body.value
      };
    });
  }

  ngOnDestroy() {

  }
}
