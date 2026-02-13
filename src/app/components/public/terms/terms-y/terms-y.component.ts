import {Component, OnInit, OnDestroy} from '@angular/core';
import {untilDestroyed} from 'ngx-take-until-destroy';
import { PolicyY } from 'app/modules/kentico/models/terms-yolo.model';
import { RichTextHtmlHelper } from 'app/modules/kentico/data-layer/helpers/rich-text-html.helper';
import {KenticoTranslateService} from '../../../../modules/kentico/data-layer/kentico-translate.service';

@Component({
    selector: 'app-terms-y',
    templateUrl: './terms-y.component.html',
    styleUrls: ['./terms-y.component.scss'],
    standalone: false
})
export class TermsYComponent implements OnInit, OnDestroy {

  kenticoModel: PolicyY;
  model: { header: string, header_title: string, header_subtitle: string, body: string};
  constructor(private kenticoTranslateService: KenticoTranslateService) { }

  ngOnInit() {
    this.kenticoTranslateService.getItem<PolicyY>('terms_yolo').pipe(untilDestroyed(this)).subscribe(item => {
      this.kenticoModel = item;
      this.model = this.transformKenticoModel(item);
    });
  }

  transformKenticoModel(item: PolicyY): { header: string, header_title: string, header_subtitle: string,
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
