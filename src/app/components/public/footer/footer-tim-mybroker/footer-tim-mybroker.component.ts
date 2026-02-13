import { Component, OnInit } from '@angular/core';
import { RouterService } from 'app/core/services/router.service';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { take } from 'rxjs/operators';

@Component({
    selector: 'app-footer-tim-mybroker',
    templateUrl: './footer-tim-mybroker.component.html',
    styleUrls: ['./footer-tim-mybroker.component.scss'],
    standalone: false
})
export class FooterTimMybrokerComponent implements OnInit {

  footer: any;

  constructor(
    private kenticoTranslateService: KenticoTranslateService,
    public routerService: RouterService,
    ) { }

  ngOnInit() {
    this.initializeKenticoContent();
  }

  initializeKenticoContent() {
    this.kenticoTranslateService.getItem<any>('footer').pipe(take(1)).subscribe(item => {
      this.footer = {
        logo: item.logo.value[0].url,
        logo2: item.logo_2.value[0].url,
        logo2link: item.logo_2_link.value,
        linkPageList: item.links.value.map(item => {return {title: item.title.value, link: item.text.value}}),
        copyright: item.copyright.value
      };
    });
  }

  isLinkInternal(link: string): boolean {
    return link.startsWith('/')
  }

  goToLink(link) {
    this.isLinkInternal(link) ? this.routerService.navigate(link) : window.open(link, "_blank");
  }

}
