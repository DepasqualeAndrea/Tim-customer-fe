import {SocialUser} from 'angularx-social-login';
import {SocialAuth} from '@model';
import {environment} from '../../../../../environments/environment';

export class LoginSocialHelper {

  public static convertFacebookUser(facebookUser: SocialUser, secret: string) {
    return Object.assign({}, this.convertSocialUser(facebookUser, secret));
  }

  public static convertSocialUser(socialUser: SocialUser, secret: string): SocialAuth {
    return {
      auth_hash: {
        uid: socialUser.id,
        token: socialUser.authToken,
        secret: secret,
        provider: socialUser.provider.toLowerCase(),
        email: socialUser.email
      },
      user: {
        email: socialUser.email,
        firstname: socialUser.firstName,
        lastname: socialUser.lastName,
        phone: null,
        birth_date: null
      }
    };
  }


}
