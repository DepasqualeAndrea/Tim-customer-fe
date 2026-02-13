import { Component, OnDestroy, OnInit } from '@angular/core';
import { DataService } from '@services';
import { ComponentFeaturesService } from 'app/core/services/componentFeatures.service';
import { RouterService } from 'app/core/services/router.service';
import { take } from 'rxjs/operators';
import { KenticoTranslateService } from '../../../modules/kentico/data-layer/kentico-translate.service';

@Component({
    selector: 'app-not-found',
    templateUrl: './not-found.component.html',
    styleUrls: ['./not-found.component.scss'],
    standalone: false
})
export class NotFoundComponent implements OnInit, OnDestroy {

  logoImage: string;
  contactsPageDisabled: boolean;
  assistancePageDisabled: boolean;
  pageImg: any;
  notfound: any;

  constructor(
    public dataService: DataService,
    private kenticoTranslateService: KenticoTranslateService,
    private componentFeaturesService: ComponentFeaturesService,
    public routerService: RouterService
  ) { }

  ngOnInit() {
    this.dataService.isSplash = true;
    this.kenticoNotFoundPage();
    this.contactsPageLink();
    this.assistancePageLink();
  }

  kenticoNotFoundPage() {
    this.kenticoTranslateService.getItem<any>('page_not_found').pipe(take(1)).subscribe(item => {
      this.pageImg = item.logo.value[0].url;
      this.notfound = item;
    });
  }

  contactsPageLink() {
    this.componentFeaturesService.useComponent('not-found-page');
    this.componentFeaturesService.useRule('contacts-page-disabled');
    this.contactsPageDisabled = this.componentFeaturesService.isRuleEnabled();
  }

  assistancePageLink () {
    this.componentFeaturesService.useComponent('not-found-page');
    this.componentFeaturesService.useRule('assistance-page-disabled');
    this.assistancePageDisabled = this.componentFeaturesService.isRuleEnabled();
  }

  getBaseUrl(): string {
    return '/' + this.dataService.tenantInfo.baseUrl;
  }

  navigate(url: string) {
    if (!!url && url.length > 0) {
      this.routerService.navigate(url);
    }
  }

  ngOnDestroy() {
    this.dataService.isSplash = false;
  }

}
