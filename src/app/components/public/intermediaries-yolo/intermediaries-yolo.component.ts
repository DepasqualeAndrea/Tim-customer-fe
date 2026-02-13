import { Component, OnInit, OnDestroy } from '@angular/core';
import { map, switchMap, take } from 'rxjs/operators';
import { forkJoin, Observable, of } from 'rxjs';

import { KenticoYoloService } from '@services';
import { RichTextHtmlHelper } from 'app/modules/kentico/data-layer/helpers/rich-text-html.helper';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { PageLayout } from 'app/modules/kentico/models/page-layout.model';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { Faq } from './faq.interface';

@Component({
    selector: 'app-intermediaries-yolo',
    templateUrl: './intermediaries-yolo.component.html',
    styleUrls: ['./intermediaries-yolo.component.scss'],
    standalone: false
})


export class IntermediariesYoloComponent implements OnInit, OnDestroy {
  faq: Faq
  widthWindow : Number = window.innerWidth
  toWho : boolean = true;
  benefits : boolean = false;
  backgrounds: any;
  kenticoModel: PageLayout;
  model: { 
    header: any, 
    header_title: any, 
    quotator_list: any,
    body: any,
    /*body: string, */
  };
 
  constructor(private kenticoYoloService: KenticoYoloService, private kenticoTranslateService: KenticoTranslateService) {
  }
  ngOnInit() {
    
    /* per header */
    this.kenticoYoloService.getItem<PageLayout>('intermediaries').pipe(untilDestroyed(this)).subscribe(item => {
      this.kenticoModel = item;
      this.model = this.transformKenticoModel(item);
    });

    /* per faq */
    this.getContentFromKentico().subscribe();
  }
  /* function per header */
  transformKenticoModel(item: PageLayout): { 
    header: any, 
    header_title: any, 
    quotator_list: any,
    body: any,
    /* header_subtitle: string,*/
  } 
  {
    return {
      header: item.header.value,
      header_title: RichTextHtmlHelper.computeHtml(item.header_title),
      quotator_list: item.quotator_list,
      body: item.body?.value
    };
  }
/* da utilizzare per creare la struttura faq */
private getContentFromKentico(): Observable<any>  {
    return this.kenticoTranslateService.getItem('faq_intermediari').pipe
      (take(1), map((contentItem : any) => 
       { 
       this.faq = {
        enabled: contentItem.enabled.value.length
          ? contentItem.enabled.value.some(value => value.codename === 'true')
          : false,
        title: contentItem.title.value,
        faqs: this.getFaqStructure(contentItem.faqs.value[0].linked_items),
        collapse_toggler_icons: {
          show: contentItem.icon_closed.value[0]
            ? contentItem.icon_closed.value[0].url
            : null,
          hide: contentItem.icon_opened.value[0]
            ? contentItem.icon_opened.value[0].url
            : null
        }
       }}
      ));
  }
  getFaqStructure(kenticoItem: any) {
    let faqsFromKentico: any[] = kenticoItem.value.map(item => {
      return {
        question: item && item.question.value,
        answer: item && item.answer.value
      };
    });
    const fullLength = faqsFromKentico.length;
    if (fullLength > 0) {
      const halfLength = Math.ceil(fullLength / 2);
      const leftSideFaqs = faqsFromKentico.slice(0, halfLength);
      const rightSideFaqs = faqsFromKentico.slice(halfLength, fullLength);
      faqsFromKentico = [leftSideFaqs, rightSideFaqs];
    }
    
    return faqsFromKentico;
  }
  
  focusOnA() : void{
    this.toWho = true;
    this.benefits = false;  
  }
  focusOnB() {
    this.toWho = false;
    this.benefits = true;  
  }
 
  ngOnDestroy() {
  }
}
