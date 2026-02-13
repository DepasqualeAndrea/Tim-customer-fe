import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalService } from 'app/core/services/modal.service';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { untilDestroyed } from 'ngx-take-until-destroy';

@Component({
    selector: 'app-cookies-tim',
    templateUrl: './cookies-tim.component.html',
    styleUrls: ['./cookies-tim.component.scss'],
    standalone: false
})
export class CookiesTimComponent implements OnInit, OnDestroy {

  cookies: any;

  constructor(
      private kenticoTranslateService: KenticoTranslateService,
      private modalService: ModalService
      ) { }

  ngOnInit() {
    this.initializeKenticoContent();
  }

  initializeKenticoContent() {
    this.kenticoTranslateService.getItem<any>('cookies').pipe(untilDestroyed(this)).subscribe(item => {
      this.cookies = {
        button_cookie_modal: item.button.value,
        title: item.cookies_header_title.value,
        body: item.cookies_body.value
      };
    });
  }

  openPreferences() {
    this.modalService.openModalRequired('cookies_preferences_modal', 'CookiesModalChoise');
  }

  ngOnDestroy() {

  }

}
