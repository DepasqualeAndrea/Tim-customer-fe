import {Component, OnInit} from '@angular/core';
import { RouterService } from 'app/core/services/router.service';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { take } from 'rxjs/operators';

@Component({
    selector: 'app-landing-page-tim-employees',
    templateUrl: './landing-page-tim-employees.component.html',
    styleUrls: ['./landing-page-tim-employees.component.scss'],
    standalone: false
})
export class LandingPageTimEmployeesComponent implements OnInit {

  content: any

  constructor(
    private routerService: RouterService,
    private kenticoTranslateService: KenticoTranslateService
  ) {}

  ngOnInit() {
    if (this.routerService.previousUrl === '/logout') {
      this.initializeKenticoContent()
    } else {
      this.ssoAuthRedirect()
    }
  }

  ssoAuthRedirect() {
    const url = window.location.origin + '/users/auth/tim/connect'
    window.location.href = url
  }

  initializeKenticoContent() {
    this.kenticoTranslateService.getItem<any>('landing_page').pipe(take(1)).subscribe(item => {
      this.content = {
        title: item.title.value,
        logo: item.logo.value[0].url,
        description: item.description.value,
        button: item.button_label.value
      }
    })
  }
}


