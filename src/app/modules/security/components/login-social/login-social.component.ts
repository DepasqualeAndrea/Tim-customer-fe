import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {SocialAuthService, FacebookLoginProvider, SocialUser} from 'angularx-social-login';
import {SocialAuth} from '@model';
import {LoginSocialHelper} from './login-social.helper';
import {DataService} from '@services';

@Component({
    selector: 'app-login-social',
    templateUrl: './login-social.component.html',
    styleUrls: ['./login-social.component.scss'],
    standalone: false
})
export class LoginSocialComponent implements OnInit, OnDestroy {

  @Input() facebookButtonText: string;

  @Output() signinChange: EventEmitter<SocialAuth> = new EventEmitter<SocialAuth>();

  constructor(private socialAuthService: SocialAuthService,
              private dataService: DataService) {
    this.handleSignInWithFacebook.bind(this);
  }

  ngOnInit() {
  }

  signInWithFacebook() {
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID, {scope: 'email,profile'})
      .then(this.handleSignInWithFacebook())
      .catch(this.handleSignInWithFacebookError());
  }

  handleSignInWithFacebook(): any {
    return (socialUser: SocialUser) => {
      const fbAuth = this.dataService.tenantInfo.facebookAuth || {};
      this.signinChange.emit(LoginSocialHelper.convertFacebookUser(socialUser, fbAuth.secret));
    };
  }

  handleSignInWithFacebookError() {
    return (error) => console.log(error);
  }

  ngOnDestroy(): void {
  }

}
