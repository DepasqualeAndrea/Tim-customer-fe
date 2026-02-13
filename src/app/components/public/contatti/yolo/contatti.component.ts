import { Component, OnInit, OnDestroy } from '@angular/core';
import { RichTextHtmlHelper } from 'app/modules/kentico/data-layer/helpers/rich-text-html.helper';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { PageLayout } from 'app/modules/kentico/models/page-layout.model';
import {KenticoTranslateService} from '../../../../modules/kentico/data-layer/kentico-translate.service';
import { DataService } from '@services';

@Component({
    selector: 'app-contatti',
    templateUrl: './contatti.component.html',
    styleUrls: ['./contatti.component.scss'],
    standalone: false
})
export class ContattiComponent implements OnInit, OnDestroy {

  kenticoModel: PageLayout;

  model: { header_title: string, header_subtitle: string, body: string, sub_section: string };

  constructor(private kenticoTranslateService: KenticoTranslateService,
              public dataService: DataService) {
  }

  ngOnInit() {
    this.kenticoTranslateService.getItem<PageLayout>('contatti_yolo').pipe(untilDestroyed(this)).subscribe(item => {
      this.kenticoModel = item;
      this.model = this.transformKenticoModel(item);
    });
  }

  transformKenticoModel(item: PageLayout): { header_title: string,
      header_subtitle: string, body: string, sub_section: string } {

    return {
      header_title: RichTextHtmlHelper.computeHtml(item.header_title),
      header_subtitle: item.header_subtitle.value,
      body: RichTextHtmlHelper.computeHtml(item.body),
      sub_section: RichTextHtmlHelper.computeHtml(item.sub_section)
    };
  }

  ngOnDestroy() {

  }
}
