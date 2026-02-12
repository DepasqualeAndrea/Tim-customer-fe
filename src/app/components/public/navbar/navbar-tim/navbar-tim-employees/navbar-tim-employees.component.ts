import { Component, Input, OnInit } from '@angular/core';
import { AuthService, DataService } from '@services';
import { RouterService } from 'app/core/services/router.service';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-navbar-tim-employees',
  templateUrl: './navbar-tim-employees.component.html',
  styleUrls: ['./navbar-tim-employees.component.scss']
})
export class NavbarTimEmployeesComponent implements OnInit {

  @Input() secondaryNavbar: boolean

  constructor(
    public dataService: DataService,
    private kenticoTranslateService: KenticoTranslateService,
    public routerService: RouterService,
    private auth: AuthService
  ) { }

  get menuItems(): any {
    return ((this.dataService.tenantInfo || {}).navbar || {}).menuItems;
  }

  navbarLogo: string;
  privateAreaLabel: string
  preNavbar: string;
  loggedMenuItems = []
  isUserLoggedIn: boolean

  ngOnInit() {
    this.getLoggedMenuItems()
    this.kenticoTranslateService.getItem<any>('navbar').pipe(take(1)).subscribe(item => {
      this.navbarLogo = item.logo.images[0].url; 
      this.privateAreaLabel = item.reserved_area.value
      this.preNavbar = item.pre_navbar_list.value.map(item => {return {title: item.title.value, link: item.text.value}});
    }); 
    this.auth.userChangedSource.pipe(untilDestroyed(this)).subscribe(() => {
      this.isUserLoggedIn = this.auth.loggedIn && this.hasUserInfo()
    })
  }

  hasUserInfo(): boolean {
    const user = this.auth.loggedUser
    return !!user && !!user.address && !!user.address.firstname && !!user.address.lastname
  }
  
  ngOnDestroy() {}

  getLoggedMenuItems() {
    if (this.secondaryNavbar) {
      this.dataService.getLoggedMenu().pipe(untilDestroyed(this)).subscribe(mItems => this.loggedMenuItems = mItems)
    }
  }

  goToBaseUrl(): void {
    this.routerService.navigateBaseUrl();
  }

  navigate(url: string) {
    if (!!url && url.length > 0) {
      this.routerService.navigate(url);
    }
  }
}
