import { Component, OnInit, OnDestroy } from '@angular/core';
import { KenticoYoloService } from '@services';
import { RichTextHtmlHelper } from 'app/modules/kentico/data-layer/helpers/rich-text-html.helper';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { PageLayout } from 'app/modules/kentico/models/page-layout.model';

@Component({
  selector: 'app-investors',
  templateUrl: './investors.component.html',
  styleUrls: ['./investors.component.scss']
})

export class InvestitoriComponent implements OnInit, OnDestroy {
  backgrounds: any;
  kenticoModel: PageLayout;
  model: { header: any, header_title: string, header_subtitle: string,
    body: string};
  constructor(private kenticoYoloService: KenticoYoloService) {
  }
  
  ngOnInit() {
    this.kenticoYoloService.getItem<PageLayout>('gli_investitori').pipe(untilDestroyed(this)).subscribe(item => {
      this.kenticoModel = item;
      this.model = this.transformKenticoModel(item);
    });
  }

  transformKenticoModel(item: PageLayout): { header: any, header_title: string, header_subtitle: string,
    body: string} {
    return {
      header: item.header.value,
      header_title: RichTextHtmlHelper.computeHtml(item.header_title),
      header_subtitle: item.header_subtitle.value,
      body: RichTextHtmlHelper.computeHtml(item.body)
    };
  }
  ngOnDestroy() {
  }
}
