import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@services';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { take } from 'rxjs/operators';
import { RouteHash } from './route-hashes.enum';

@Component({
    selector: 'app-login-register-tim-retirees',
    templateUrl: './login-register-tim-retirees.component.html',
    styleUrls: ['./login-register-tim-retirees.component.scss'],
    standalone: false
})
export class LoginRegisterTimRetireesComponent implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute,
    private kenticoTranslateService: KenticoTranslateService,
    private router: Router,
    private auth: AuthService
  ) { }

  content: any

  ngOnInit() {
    this.getKenticoContent()
    this.subscribeAuthentication()
    this.setDefaultNavigationHash()
  }

  ngOnDestroy() {}

  private setDefaultNavigationHash(): void {
    if(!this.activatedRoute.snapshot.fragment) {
      this.activatedRoute.snapshot.fragment = RouteHash.LOGIN
      this.router.navigate(['pensioner-access'], {preserveFragment: true })
    }
  }

  showLoginPageOnLand() {
    return this.activatedRoute.snapshot.fragment === RouteHash.LOGIN
  }

  showRegisterPageOnLand() {
    return this.activatedRoute.snapshot.fragment === RouteHash.REGISTER
  }

  getKenticoContent() {
    this.kenticoTranslateService.getItem<any>('login_register_retirees').pipe(take(1)).subscribe(kenticoItem => {
      this.content = {
        logo:         kenticoItem['logo'].value[0].url,
        background:   kenticoItem['background'].value[0].url,

        background_tl:   kenticoItem['background'].value[0].url,
        background_bl:   kenticoItem['background'].value[1].url,
        background_tr:   kenticoItem['background'].value[2].url,
        background_br:   kenticoItem['background'].value[3].url,

        description:  kenticoItem['description'].value,
        registration: kenticoItem['registration'].value,
        want_to_register:           kenticoItem['want_to_register'].value,
        already_registered:         kenticoItem['already_registered'].value,
        sign_in_link:               kenticoItem['sign_in_link'].value,
        login_form: {
          password_form_label:        kenticoItem['password'].value,
          password_form_placeholder:  kenticoItem['password_placeholder'].value,
          taxcode_form_label:         kenticoItem['taxcode'].value,
          taxcode_form_placeholder:   kenticoItem['taxcode_placeholder'].value,
          forgot_password:            kenticoItem['forgot_password'].value
        },
        register_form: {
          alatel_code_form_label:     kenticoItem['alatel_code'].value,
          phone_form_label:           kenticoItem['phone'].value,
          register_button:            kenticoItem['register_button'].value,
          registration_successful:    kenticoItem['registration_successful'].value,
          registration_unsuccessful:  kenticoItem['registration_unsuccessful'].value,
        }
      }
    })
  }

  navigateToRegistrationForm() {
    this.router.navigate( ['/pensioner-access'], {fragment: RouteHash.REGISTER});
  }

  navigateToLoginForm() {
    this.router.navigate( ['/pensioner-access'], {fragment: RouteHash.LOGIN});
  }

  subscribeAuthentication() {
    this.auth.userChangedSource.pipe(untilDestroyed(this)).subscribe(() => {
      if (this.auth.loggedIn) {
        this.router.navigate(['/products']);
      }
    })
  }

}
