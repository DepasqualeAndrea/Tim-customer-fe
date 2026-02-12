import {Component, Input, OnInit} from '@angular/core';
import {ModalService} from '../../../core/services/modal.service';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {CookieService} from '../../../core/services/cookie.service';
import {DataService} from '@services';

@Component({
  selector: 'app-cookies-preferences',
  templateUrl: './cookies-preferences.component.html',
  styleUrls: ['./cookies-preferences.component.scss']
})
export class CookiesPreferencesComponent implements OnInit {

  @Input() kenticoContent: any;
  contentItem: any;
  tenant: any;

  constructor(
    private modalService: ModalService,
    public activeModal: NgbActiveModal,
    private cookieService: CookieService,
    public dataService: DataService
  ) {
  }

  ngOnInit(): void {
    this.contentItem = this.contentStructureFromKenticoItem(this.kenticoContent);
    this.tenant = this.dataService.tenantInfo.tenant;
    if (this.tenant === 'civibank_db' || this.tenant === 'banco-desio_db') {
      this.acceptNecessaryCookies();
    }
  }

  contentStructureFromKenticoItem(kenticoItem: any) {
    return {
      firstModal: this.getFirstStructure(kenticoItem.cookies_modal.value[0]),
    };
  }

  getFirstStructure(kenticoItem: any) {
    return {
      title: kenticoItem.title.value ? kenticoItem.title.value : null,
      icon_lock: kenticoItem.icon.images[0].url ? kenticoItem.icon.images[0].url : null,
      icon_lock_alt: kenticoItem.icon.images[0].description ? kenticoItem.icon.images[0].description : null,
      icon_close: kenticoItem.close_icon.images[0].url ? kenticoItem.close_icon.images[0].url : null,
      icon_close_alt: kenticoItem.close_icon.images[0].description ? kenticoItem.close_icon.images[0].description : null,
      content: kenticoItem.content ? kenticoItem.content.value : null,
      content_cookie: kenticoItem.content_cookie ? kenticoItem.content_cookie.value : null,
      text_privacy_policy: kenticoItem.text_privacy_policy ? kenticoItem.text_privacy_policy.value : null,
      link_preferences: kenticoItem.link_preferences ? kenticoItem.link_preferences.value : null,
      content_extra: kenticoItem.content_extra ? kenticoItem.content_extra.value : null,
      ok_button: kenticoItem.ok_button ? kenticoItem.ok_button.value : null
    };
  }

  openDetail() {
    this.modalService.openModalRequired('cookies_preferences_modal', 'CookiesModalChoise');
    this.activeModal.dismiss();
  }

  acceptNecessaryCookies(): void {
    this.cookieService.acceptNecessaryCookies();
    this.activeModal.dismiss();
  }

  acceptAllCookies(): void {
    this.cookieService.acceptAllCookies();
    this.activeModal.dismiss();
  }

}
