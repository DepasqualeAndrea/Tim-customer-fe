import {AfterViewInit, Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {CONSTANTS} from 'app/app.constants';
import {NavbarCbVariantSkinComponent} from '../../../../components/public/navbar/navbar-cb/navbar-cb-variant-skin.component';
import { DataService } from '@services';
import {SystemError} from '../../../../shared/errors/system-error.model';
import {HumanError} from '../../../../shared/errors/human-error.model';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-not-confirmed-cb',
  templateUrl: './not-confirmed-cb.component.html',
  styleUrls: ['./not-confirmed-cb.component.scss']
})
export class NotConfirmedCBComponent extends NavbarCbVariantSkinComponent implements OnInit, AfterViewInit {

  unexpectedError = false;
  notConfirmedIcon: string;
  notConfirmedIconDesc: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dataService: DataService,
    private kenticoTranslateService: KenticoTranslateService
  ) {
    super();
  }


  ngOnInit() {
    // super.ngOnInit();
    this.unexpectedError = this.route.snapshot.queryParamMap.has(CONSTANTS.SSO_UNEXPECTED_ERROR_PARAM);

    this.kenticoTranslateService.getItem<any>('page_not_confirmed').pipe(take(1)).subscribe(item => {
    this.notConfirmedIcon = item.image.value[0].url;
    this.notConfirmedIconDesc = item.image.value[0].description;
    });
  }

  ngAfterViewInit(): void {
    if(this.unexpectedError) {
      throw new SystemError('Cannot login using SSO. Unexpected error');
    } else {
      throw new HumanError('SSO login failed due to wrong data');
    }
  }


  goToCustomerArea() {
    if(this.dataService.tenantInfo.ssoNotConfirmedUrl) {
      window.location.href = this.dataService.tenantInfo.ssoNotConfirmedUrl;
    } else {
      // Old behavior
      window.location.href = 'https://clienti.chebanca.it/';
    }
  }

  backToLandingPage() {
    this.router.navigate(['/landing-page']);
  }

}
