import { Component, OnInit, OnDestroy } from '@angular/core';
import { KenticoYoloService } from '@services';
import { PageModel } from 'app/modules/kentico/models/page.model';
import { RichTextHtmlHelper } from 'app/modules/kentico/data-layer/helpers/rich-text-html.helper';
import { untilDestroyed } from 'ngx-take-until-destroy';

@Component({
    selector: 'app-big-companies',
    templateUrl: './big-companies.component.html',
    styleUrls: ['./big-companies.component.scss'],
    standalone: false
})
export class BigCompaniesComponent implements OnInit, OnDestroy {

  model: { banner: string, title: string, subtitle: string, body: string, sub_section: String };

  constructor(private kenticoYoloService: KenticoYoloService) {
  }

  ngOnInit() {
    this.kenticoYoloService.getItem<PageModel>('grandi_imprese').pipe(untilDestroyed(this)).subscribe(item => {
      this.model = this.transformPage(item);
    });
  }

  transformPage(page: PageModel): { banner: string, title: string, subtitle: string, body: string, sub_section: String } {
    return {
      banner: page.banner.value.length && page.banner.value[0].url,
      body: RichTextHtmlHelper.computeHtml(page.body),
      title: RichTextHtmlHelper.computeHtml(page.title),
      subtitle: RichTextHtmlHelper.computeHtml(page.subtitle),
      sub_section: RichTextHtmlHelper.computeHtml(page.sub_section)
    };
  }

  ngOnDestroy() {

  }
}

