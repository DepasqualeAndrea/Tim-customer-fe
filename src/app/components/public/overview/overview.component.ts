import {Component, OnDestroy, OnInit} from '@angular/core';
import {RichTextHtmlHelper} from 'app/modules/kentico/data-layer/helpers/rich-text-html.helper';
import {untilDestroyed} from 'ngx-take-until-destroy';
import {KenticoYoloService} from '@services';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit, OnDestroy {
  model: { header: any, header_title: string, header_subtitle: string,
           body: string, sub_section: string};
  puzzleimg: any;
  rocketimg: any;
  brainimg: any;
  fingersnap: any;

  constructor(
    private kenticoTranslateService: KenticoTranslateService) {
  }
  ngOnInit() {


    this.kenticoTranslateService.getItem<any>('overview.simpleimg').subscribe(item => this.puzzleimg = item.images[0].url);
    this.kenticoTranslateService.getItem<any>('overview.fastimg').subscribe(item => this.rocketimg = item.images[0].url);
    this.kenticoTranslateService.getItem<any>('overview.flexibleimg').subscribe(item => this.brainimg = item.images[0].url);
    this.kenticoTranslateService.getItem<any>('overview.fingersnap').subscribe(item => this.fingersnap = item.images[0].url);
  }

  ngOnDestroy() {

  }
}
