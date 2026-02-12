import {Component, OnDestroy, OnInit} from '@angular/core';
import { DataService } from '@services';
import {RichTextHtmlHelper} from 'app/modules/kentico/data-layer/helpers/rich-text-html.helper';
import { ContentItem } from 'kentico-cloud-delivery';
import {untilDestroyed} from 'ngx-take-until-destroy';
import {KenticoTranslateService} from '../../../../modules/kentico/data-layer/kentico-translate.service';

type SubSectionContent =  {
  header_title: string,
  header_subtitle: string,
  body: string,
  sub_section: {
    body: string,
    button: {target: string, label: string}
  }
}

@Component({
  selector: 'app-support-y',
  templateUrl: './support-y.component.html',
  styleUrls: ['./support-y.component.scss']
})
export class SupportYComponent implements OnInit, OnDestroy {
  kenticoModel: ContentItem;
  model: SubSectionContent;

  constructor(private kenticoTranslateService: KenticoTranslateService,
    public dataService: DataService) {
  }

  ngOnInit() {
    this.kenticoTranslateService.getItem('assistenza_yolo').pipe(untilDestroyed(this)).subscribe(item => {
      this.kenticoModel = item as ContentItem;
      this.model = this.transformKenticoModel(item);
      console.log(this.model)
    });
  }

  transformKenticoModel(item: any): SubSectionContent {
    const subSection: ContentItem = item.children.value[0];
    return {
      header_title: RichTextHtmlHelper.computeHtml(item.header_title),
      header_subtitle: RichTextHtmlHelper.computeHtml(item.header_subtitle),
      body: RichTextHtmlHelper.computeHtml(item.body),
      sub_section: {
        button: {
          target: '/contatti',
          label: 'Contattaci'
        },
        body: subSection?.body?.value
      }
    };
  }

  ngOnDestroy() {
  }

}


