import { Component, OnInit } from '@angular/core';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { take } from 'rxjs/operators';

@Component({
    selector: 'app-chi-siamo-tim-mybroker-customers',
    templateUrl: './chi-siamo-tim-mybroker-customers.component.html',
    styleUrls: ['./chi-siamo-tim-mybroker-customers.component.scss'],
    standalone: false
})
export class ChiSiamoTimMybrokerCustomersComponent implements OnInit {

  img_header: any
  img: any 
  title: any 
  description: any;
  title1: any 
  link1: any 
  title2: any;

  constructor(private kenticoTranslateService: KenticoTranslateService) { }

  ngOnInit() {
    this.loadContent();
  }

  loadContent() {
    this.kenticoTranslateService.getItem<any>('chi_siamo').pipe(take(1)).subscribe( 
      item => {
        this.createContentToRender(item);
      })
  }

  createContentToRender(kenticoContent){
    this.img_header = kenticoContent.img_header.value[0].url;
    this.img = kenticoContent.img.value[0].url;
    this.title = kenticoContent.title.value;
    this.description = kenticoContent.description.value;
    this.title1 = kenticoContent.title_1_breadcrumb_who_we_are.value;
    this.link1 = kenticoContent.link_1_breadcrumb_who_we_are.value;
    this.title2 = kenticoContent.title_2_breadcrumb_who_we_are.value;
   
  }

}
