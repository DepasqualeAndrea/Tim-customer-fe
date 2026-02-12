import {GtmPageInfoStrategy} from '../../../core/services/gtm/gtm-page-info-strategy.interface';
import {GtmService} from '../../../core/services/gtm/gtm.service';
import {AuthService} from '@services';
import {Router} from '@angular/router';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GtmYoloItPageFiller implements GtmPageInfoStrategy {

  constructor(private router: Router, private gtmService: GtmService, private authService: AuthService) {
  }

  private deviceTypeFn(): string {
    if (screen.width >= 1200) {
      return 'd';
    } else if (screen.width <= 767) {
      return 'm';
    } else  {
      return 't';
    }
  }

  private loggedIn(logged: boolean): string {
    return logged ? 'Logged In' : 'Not Logged in';
  }


  fill(): void {
    const dl: object = {};
    Object.assign(dl, {pageName: this.router.url});
    Object.assign(dl, {deviceType: this.deviceTypeFn()});
    Object.assign(dl, {isLoggedIn: this.loggedIn(this.authService.loggedIn)});
    if(this.authService.loggedIn) {
      Object.assign(dl, {userId: this.authService.loggedUser.id || ''});
    }

    this.gtmService.overwrite(dl);
  }

}
