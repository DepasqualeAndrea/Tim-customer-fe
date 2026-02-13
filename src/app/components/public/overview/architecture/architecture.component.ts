import {Component, OnDestroy, OnInit} from '@angular/core';
import { SectionOverview} from 'app/modules/kentico/models/section-overview.model';
import { KenticoYoloService } from '@services';
import { RichTextHtmlHelper } from 'app/modules/kentico/data-layer/helpers/rich-text-html.helper';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';

@Component({
    selector: 'app-architecture',
    templateUrl: './architecture.component.html',
    styleUrls: ['./architecture.component.scss'],
    standalone: false
})

export class ArchitectureComponent implements OnInit, OnDestroy {

  kenticoModel: SectionOverview;
  model: { title: string, body: string};
  architectureImg: any;

  constructor(private kenticoYoloService: KenticoYoloService,
    private kenticoTranslateService: KenticoTranslateService) {
  }
  ngOnInit() {
    this.kenticoTranslateService.getItem<any>('overview.architectureimg').subscribe(item => this.architectureImg = item.images[0].url);
    this.kenticoYoloService.getItem<SectionOverview>('architettura').pipe(untilDestroyed(this)).subscribe(item => {
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
