import {Component, OnDestroy, OnInit} from '@angular/core';
import { KenticoYoloService } from '@services';
import { RichTextHtmlHelper } from 'app/modules/kentico/data-layer/helpers/rich-text-html.helper';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { SectionOverview} from 'app/modules/kentico/models/section-overview.model';

@Component({
  selector: 'app-architecture-api',
  templateUrl: './architecture-api.component.html',
  styleUrls: ['./architecture-api.component.scss']
})
export class ArchitectureApiComponent implements OnInit, OnDestroy {

  kenticoModel: SectionOverview;

  model: { title: string, body: string};

  constructor(private kenticoYoloService: KenticoYoloService) {
  }
  ngOnInit() {
    this.kenticoYoloService.getItem<SectionOverview>('architettura_api_semplici_e_robuste').pipe(untilDestroyed(this)).subscribe(item => {
      this.kenticoModel = item;
      this.model = this.transformKenticoModel(item);
    });
  }

  transformKenticoModel(item: SectionOverview):{ title: string, body: string} {
    return {
      title: RichTextHtmlHelper.computeHtml(item.title),
      body: RichTextHtmlHelper.computeHtml(item.body)
    };
  }

  ngOnDestroy() {

  }
}
