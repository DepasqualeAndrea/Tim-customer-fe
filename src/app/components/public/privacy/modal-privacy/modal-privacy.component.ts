import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CookieService } from 'app/core/services/cookie.service';

@Component({
    selector: 'app-modal-privacy',
    templateUrl: './modal-privacy.component.html',
    styleUrls: ['./modal-privacy.component.scss'],
    standalone: false
})
export class ModalPrivacyComponent implements OnInit {

  @Input() kenticoContent: any;
  contentItem: any;

  constructor(
    public activeModal: NgbActiveModal,
    public router: Router,
    private cookieService: CookieService,
    ) { }

  ngOnInit() {
    this.contentItem = this.contentStructureFromKenticoItem(this.kenticoContent);
  }

  contentStructureFromKenticoItem(kenticoItem: any) {
    return {
      title: kenticoItem.title.value ? kenticoItem.title.value : null,
      ok_button: kenticoItem.ok_button ? kenticoItem.ok_button.value : null,
      forward_button: kenticoItem.ok_button ? kenticoItem.forward_button.value : null
    };
  }

  acceptPrivacy(): void {
    this.cookieService.setCookie('privacy-modal', true)
    this.activeModal.dismiss();
  }

  refusePrivacy(): void {
    this.router.navigate(['logout']);
    this.activeModal.dismiss();
  }

}
