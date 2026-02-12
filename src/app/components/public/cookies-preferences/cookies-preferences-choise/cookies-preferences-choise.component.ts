import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {CookieService} from '../../../../core/services/cookie.service';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ModalService} from '../../../../core/services/modal.service';
import {DataService} from '@services';

@Component({
  selector: 'app-cookies-preferences-choise',
  templateUrl: './cookies-preferences-choise.component.html',
  styleUrls: ['./cookies-preferences-choise.component.scss']
})
export class CookiesPreferencesChoiseComponent implements OnInit {

  @Input() kenticoContent: any;
  contentItem: any;
  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private cookieService: CookieService,
    public activeModal: NgbActiveModal,
    public modalService: ModalService,
    public dataService: DataService
  ) {
  }

  ngOnInit(): void {
    this.contentItem = this.contentStructureFromKenticoItem(this.kenticoContent);
    this.initForm();
  }

  contentStructureFromKenticoItem(kenticoItem: any) {
    return {
      secondModal: this.getSecondStructure(kenticoItem.cookies_detail_info.value[0])
    };
  }

  getSecondStructure(kenticoItem: any) {
    return {
      title: kenticoItem.title.value ? kenticoItem.title.value : null,
      always_active: kenticoItem.always_active.value ? kenticoItem.always_active.value : null,
      refuse_all_button: kenticoItem.refuse_all_button.value ? kenticoItem.refuse_all_button.value : null,
      accept_all_button: kenticoItem.accept_all_button.value ? kenticoItem.accept_all_button.value : null,
      title_cookie_policy: kenticoItem.title_cookie_policy.value ? kenticoItem.title_cookie_policy.value : null,
      description_cookie_policy: kenticoItem.description_cookie_policy.value ? kenticoItem.description_cookie_policy.value : null,
      title_what_are_cookie: kenticoItem.title_what_are_cookie.value ? kenticoItem.title_what_are_cookie.value : null,
      description_what_are_cookie: kenticoItem.description_what_are_cookie.value ? kenticoItem.description_what_are_cookie.value : null,
      title_cookie_first_part: kenticoItem.title_cookie_first_part.value ? kenticoItem.title_cookie_first_part.value : null,
      description_cookie_first_part: kenticoItem.description_cookie_first_part.value ? kenticoItem.description_cookie_first_part.value : null,
      title_cookie_third_part: kenticoItem.title_cookie_third_part.value ? kenticoItem.title_cookie_third_part.value : null,
      description_cookie_third_part: kenticoItem.description_cookie_third_part.value ? kenticoItem.description_cookie_third_part.value : null,
      title_cookie_profiling: kenticoItem.title_cookie_profiling.value ? kenticoItem.title_cookie_profiling.value : null,
      description_cookie_profiling: kenticoItem.description_cookie_profiling.value ? kenticoItem.description_cookie_profiling.value : null,
      title_deactivation_cookie: kenticoItem.title_deactivation_cookie.value ? kenticoItem.title_deactivation_cookie.value : null,
      description_deactivation_cookie: kenticoItem.description_deactivation_cookie.value ? kenticoItem.description_deactivation_cookie.value : null,
      save_and_proceed_button: kenticoItem.save_and_proceed_button.value ? kenticoItem.save_and_proceed_button.value : null
    };
  }

  initForm(): void {
    let cookies;
    if (this.cookieService.getCookie('user-cookie-preferences')) {
      cookies = JSON.parse(this.cookieService.getCookie('user-cookie-preferences'));
    }
    this.form = this.formBuilder.group({
      required: new FormControl({value: true, disabled: true}),
      experience: new FormControl(cookies ? cookies[1].enabled : false),
      adv: new FormControl(cookies ? cookies[2].enabled : false)
    });
  }

  refuseAllCookies(): void {
    this.cookieService.refuseAllCookies();
    this.activeModal.dismiss();
  }

  acceptAllCookies(): void {
    this.cookieService.acceptAllCookies();
    this.activeModal.dismiss();
  }

  setCookies(): void {
    const listCookies = [
      {name: 'required', enabled: this.form.controls['required'].value},
      {name: 'experience', enabled: this.form.controls['experience'].value},
      {name: 'adv', enabled: this.form.controls['adv'].value}
    ];
    this.cookieService.setCookiesUserPreferences('user-cookie-preferences', listCookies);
    this.activeModal.dismiss();
  }

  closeModal(): void {
    if (window.location.pathname === '/cookies') {
      this.activeModal.dismiss();
    } else {
      this.activeModal.dismiss();
      this.modalService.openModalCentered('cookies_preferences_modal', 'CookiesModal');
    }
  }

}
