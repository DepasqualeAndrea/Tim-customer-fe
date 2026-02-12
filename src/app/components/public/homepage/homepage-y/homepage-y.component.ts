import {Component, OnInit, OnDestroy, AfterViewInit} from '@angular/core';
import { RichTextHtmlHelper } from 'app/modules/kentico/data-layer/helpers/rich-text-html.helper';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { PageLayout } from 'app/modules/kentico/models/page-layout.model';
import { DataService } from '@services';
import {KenticoTranslateService} from '../../../../modules/kentico/data-layer/kentico-translate.service';

@Component({
  selector: 'app-homepage-y',
  templateUrl: './homepage-y.component.html',
  styleUrls: ['./homepage-y.component.scss']
})
export class HomepageYComponent implements OnInit, OnDestroy {
  modalIntermediaries = false;
  kenticoModel: PageLayout;
  model: { header: any, header_title: string, header_subtitle: string,
           body: string, sub_section: string, children: any};
  modalInterm : {icon_close_modal:any, title: any, subtitle: any, body: any, button: any};

  slideConfig = {
   slidesToShow: 1,
   slidesToScroll: 1,
   dots: true,
   infinite: true,
   autoplay: true,
   autoplaySpeed: 2000,
   arrows: false
 };

  constructor(private kenticoTranslateService: KenticoTranslateService,
              public dataService: DataService) {
  }
  ngOnInit() {
    this.kenticoTranslateService.getItem<PageLayout>('yolo_homepage').pipe(untilDestroyed(this)).subscribe(item => {
      this.kenticoModel = item;
      this.model = this.transformKenticoModel(item);
    });
    this.kenticoTranslateService.getItem<PageLayout>('homepage_modal_intermediari').pipe(untilDestroyed(this)).subscribe(item => {
      this.kenticoModel = item;
      this.modalInterm = this.transformModalInterKenticoModel(item);
      console.log(this.modalInterm)
    });
    setTimeout(() => {
      this.activeModalInter();
    },5000)

  }

  transformKenticoModel(item: PageLayout): { header: any, header_title: string, header_subtitle: string, body: string, sub_section: string, children: any} {
    return {
      header: item.header.value,
      header_title: RichTextHtmlHelper.computeHtml(item.header_title),
      header_subtitle: RichTextHtmlHelper.computeHtml(item.header_subtitle),
      body: RichTextHtmlHelper.computeHtml(item.body),
      sub_section: RichTextHtmlHelper.computeHtml(item.sub_section),
      children: item.children.value
    };
  }
  transformModalInterKenticoModel(item: PageLayout): { icon_close_modal:any, title: any, subtitle: any, body: any, button: any} {
  return {
    icon_close_modal: item.icon_close_modal.value[0].url, 
    title: item.title.value, 
    subtitle: item.subtitle.value, 
    body: item.body.value, 
    button: item.button.value
  };
  }
  activeModalInter(){
    this.modalIntermediaries = true;
  }
  closeModalInterm(){
    this.modalIntermediaries = false;
  }

  ngOnDestroy() {

  }
}
