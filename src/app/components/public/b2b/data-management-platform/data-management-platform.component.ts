import { Component, OnInit, OnDestroy } from '@angular/core';
import { PageModel } from 'app/modules/kentico/models/page.model';
import { RichTextHtmlHelper } from 'app/modules/kentico/data-layer/helpers/rich-text-html.helper';
import {untilDestroyed} from 'ngx-take-until-destroy';
import {KenticoTranslateService} from '../../../../modules/kentico/data-layer/kentico-translate.service';

@Component({
  selector: 'app-data-management-platform',
  templateUrl: './data-management-platform.component.html',
  styleUrls: ['../b2b.scss', './data-management-platform.component.scss']
})
export class DataManagementPlatformComponent implements OnInit, OnDestroy {

  model: { banner: string, title: string, subtitle: string, body: string, sub_section: String };

  constructor(private kenticoTranslateService: KenticoTranslateService) {
  }

  ngOnInit() {
    this.kenticoTranslateService.getItem<PageModel>('data_management_platform').pipe(untilDestroyed(this)).subscribe(item => {
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
