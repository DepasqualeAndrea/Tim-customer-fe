import {Component, OnDestroy, OnInit} from '@angular/core';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { KenticoYoloService } from '@services';
import { RichTextHtmlHelper } from 'app/modules/kentico/data-layer/helpers/rich-text-html.helper';
import {SectionOverview} from '../../../../modules/kentico/models/section-overview.model';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';

@Component({
    selector: 'app-solutions',
    templateUrl: './solutions.component.html',
    styleUrls: ['./solutions.component.scss'],
    standalone: false
})
export class SolutionsComponent implements OnInit, OnDestroy {

  kenticoModel: SectionOverview;
  model: { title: string, body: string};
  solutionbankimg: any;
  solutionbusinesimg: any;

  constructor(private kenticoYoloService: KenticoYoloService,
    private kenticoTranslateService: KenticoTranslateService) {
  }

  ngOnInit() {
    this.kenticoTranslateService.getItem<any>('overview.solutionbanksimg').subscribe(item => this.solutionbankimg = item.images[0].url);
    this.kenticoTranslateService.getItem<any>('overview.solutionsbusinessimg').subscribe(item => this.solutionbusinesimg = item.images[0].url);
    this.kenticoYoloService.getItem<SectionOverview>('soluzioni').pipe(untilDestroyed(this)).subscribe(item => {
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
