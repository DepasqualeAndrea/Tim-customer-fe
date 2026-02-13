import { Component, OnInit, OnDestroy } from '@angular/core';
import { KenticoYoloService } from '@services';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { RichTextHtmlHelper } from 'app/modules/kentico/data-layer/helpers/rich-text-html.helper';
import { PageLayout } from 'app/modules/kentico/models/page-layout.model';

@Component({
    selector: 'app-press-review',
    templateUrl: './press-review.component.html',
    styleUrls: ['./press-review.component.scss'],
    standalone: false
})
export class PressReviewComponent implements OnInit, OnDestroy {

  kenticoModel: PageLayout;

  model: {header: string, header_title: string, header_subtitle: string, body: any, children: any};

  constructor(private kenticoYoloService: KenticoYoloService) {
              }

  ngOnInit() {
    this.kenticoYoloService.getItem<PageLayout>('rassegna_stampa').pipe(untilDestroyed(this)).subscribe(item => {
      this.kenticoModel = item;
      this.model = this.transformKenticoModel(item);
    });
  }

  transformKenticoModel(item: PageLayout): { header: string, header_title: string, header_subtitle: string,
    body: any, children: any} {
    return {
      header: item.header.value[0].url,
      header_title: RichTextHtmlHelper.computeHtml(item.header_title),
      header_subtitle: item.header_subtitle.value,
      body: item.body,
      children: item.children
    };
  }

  ngOnDestroy () {
  }

}
