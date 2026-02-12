import { Component, Input, OnInit } from '@angular/core';
import { AuthService, DataService } from '@services';
import { RouterService } from 'app/core/services/router.service';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { ContentItemIndexer } from 'kentico-cloud-delivery';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { Subscription } from 'rxjs';
import { take, filter } from 'rxjs/operators';
import { LoggedMenuItem, NavbarMenuItem } from '../../navbar.model';
import { NavbarTimCustomersModel } from './navbar-content.model';
import { UtilsService } from 'app/modules/nyp-checkout/modules/tim-nat-cat/services/utils.service';
import { UtilsServiceCyber } from 'app/modules/nyp-checkout/modules/net-cyber-business/services/utils.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar-tim-customers',
  templateUrl: './navbar-tim-customers.component.html',
  styleUrls: ['./navbar-tim-customers.component.scss']
})
export class NavbarTimCustomersComponent implements OnInit {

  @Input() secondaryNavbar: boolean;

  constructor(
    public dataService: DataService,
    private kenticoTranslateService: KenticoTranslateService,
    public routerService: RouterService,
    private auth: AuthService,
    private natCatUtilsService: UtilsService,
    private cyberUtilsService: UtilsServiceCyber,
    private router: Router
  ) { }

  subscriptions: Subscription[] = [];
  loggedMenuItems: LoggedMenuItem[] = [];
  content: NavbarTimCustomersModel;
  hidePivateAreaBtn: boolean = false;

  get menuItems(): NavbarMenuItem[] {
    return ((this.dataService.tenantInfo || {}).navbar || {}).menuItems;
  }
  get isUserLoggedIn(): boolean {
    return this.auth.loggedIn
  }
  get isCheckoutRoute(): boolean {
    return this.routerService.currentUrl.includes('checkout')
  }
  get isPrivateAreaRoute(): boolean {
    return this.routerService.currentUrl.includes('private-area')
  }

  ngOnInit() {
    this.subscriptions.push(
      this.getContent(),
      this.getLoggedMenuItems()
    )
    if(this.router.url === '/contatti'){
      this.hidePivateAreaBtn = true;
    }
  }

  private getContent(): Subscription {
    return this.kenticoTranslateService.getItem('navbar').pipe(take(1)).subscribe((item: ContentItemIndexer) => {
      this.content = this.buildContent(item)
    });
  }

  private buildContent(item: ContentItemIndexer): NavbarTimCustomersModel {
    const prenavbarElements = item.pre_navbar_list.value.map(item => ({title: item.title.value, link: item.text.value}))
    return {
      logo: {
        image: item.logo.images[0].url,
        link: item.logo_link.value
      },
      privateAreaLabel: item.reserved_area.value,
      accessAreaLabel: item.access_area.value,
      preNavbar: this.router.url !== '/contatti' ? prenavbarElements : prenavbarElements.filter(el => el.title.toUpperCase() === 'GRUPPO TIM')
    }
  }

  private getLoggedMenuItems(): Subscription {
    if (this.secondaryNavbar)
      return this.dataService.getLoggedMenu().pipe(
        untilDestroyed(this)
      ).subscribe(mItems => this.loggedMenuItems = mItems)
  }

  public goTo(link: string): void {
    if (this.isPrivateAreaRoute)
      window.location.href = link
  }

  getUserLink(): void {
    if (this.natCatUtilsService.getNypPrivateArea() || this.cyberUtilsService.getNypPrivateArea()) {
      window.location.href = '/nyp-private-area/home';
    } else {
      this.router.navigate(['/private-area/user-details']);
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s: Subscription) => s && s.unsubscribe())
  }

}
