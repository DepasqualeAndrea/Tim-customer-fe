import { Component, OnInit } from '@angular/core';
import { AuthService, DataService } from '@services';
import { User } from '@model';
import { RouterService } from 'app/core/services/router.service';
import { take } from 'rxjs/operators';
import { ComponentFeaturesService } from 'app/core/services/componentFeatures.service';
import {KenticoTranslateService} from '../../../kentico/data-layer/kentico-translate.service';

@Component({
    selector: 'app-private-area-home-page',
    templateUrl: './private-area-home-page.html',
    styleUrls: ['./private-area-home-page.scss'],
    standalone: false
})

export class PrivateAreaHomePageComponent implements OnInit {

  user: User;
  insuranceButtonEnabled: boolean = true;
  firstImage: any;
  secondImage: any;

  constructor(
    private authService: AuthService,
    private routerService: RouterService,
    public  dataService: DataService,
    private kenticoTranslateService: KenticoTranslateService,
    private componentFeaturesService: ComponentFeaturesService
    ) { }

  ngOnInit() {
    this.user = this.authService.loggedUser;
    this.kenticoTranslateService.getItem<any>('private_area.under_control_image').pipe(take(1)).subscribe(item => {
      this.firstImage = item.images[0].url;
      if (item.images[1]) {
        this.secondImage = item.images[1].url;
      }
    });

    this.componentFeaturesService.useComponent('private-area-home-page');
    this.componentFeaturesService.useRule('insurance-button');
    this.insuranceButtonEnabled = this.componentFeaturesService.isRuleEnabled();
  }

  goToBaseUrl(): void {
    this.routerService.navigateBaseUrl();
  }

}
