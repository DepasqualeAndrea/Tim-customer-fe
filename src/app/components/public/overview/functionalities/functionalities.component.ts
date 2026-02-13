import {Component, OnDestroy, OnInit} from '@angular/core';
import { RichTextHtmlHelper } from 'app/modules/kentico/data-layer/helpers/rich-text-html.helper';
import { untilDestroyed } from 'ngx-take-until-destroy';
import {SectionOverview} from '../../../../modules/kentico/models/section-overview.model';
import { KenticoYoloService } from '@services';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';

@Component({
    selector: 'app-functionalities',
    templateUrl: './functionalities.component.html',
    styleUrls: ['./functionalities.component.scss'],
    standalone: false
})
export class FunctionalitiesComponent implements OnInit, OnDestroy {

  kenticoModel: SectionOverview;
  model: { title: string, body: string};
  functcardinsuranceimg: any;
  functcardmanagementimg: any;

  constructor(private kenticoYoloService: KenticoYoloService,
    private kenticoTranslateService: KenticoTranslateService) {
  }

  ngOnInit() {
    this.kenticoTranslateService.getItem<any>('overview.functcardinsuranceimg').subscribe(item => this.functcardinsuranceimg = item.images[0].url);
    this.kenticoTranslateService.getItem<any>('overview.functcardmanagementimg').subscribe(item => this.functcardmanagementimg = item.images[0].url);
    this.kenticoYoloService.getItem<SectionOverview>('funzionalita').pipe(untilDestroyed(this)).subscribe(item => {
      this.kenticoModel = item;
      this.model = this.transformKenticoModel(item);
    });
  }

  transformKenticoModel(item: SectionOverview): { title: string, body: string} {
    return {
      title: RichTextHtmlHelper.computeHtml(item.title),
      body: RichTextHtmlHelper.computeHtml(item.body)
    };
  }

  ngOnDestroy() {

  }
}
