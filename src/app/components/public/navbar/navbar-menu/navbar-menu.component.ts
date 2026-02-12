import { Component, OnInit, Inject, LOCALE_ID } from '@angular/core';
import { DataService, AuthService } from '@services';
import { Router } from '@angular/router';
import { RouterService } from 'app/core/services/router.service';
import {LocaleService} from '../../../../core/services/locale.service';

@Component({
  selector: 'app-navbar-menu',
  templateUrl: './navbar-menu.component.html',
  styleUrls: ['./navbar-menu.component.scss']
})
export class NavbarMenuComponent implements OnInit {

  isLoginDisabled: boolean;

  constructor(
    public dataService: DataService,
    private router: Router,
    public auth: AuthService,
    public routerService: RouterService,
  ) {
  }

  ngOnInit(): void {
    this.isLoginDisabled = this.dataService.getIsLoginDisabled();
  }

  openUserProfile() {
    this.router.navigate(['private-area/home']);
  }

  login() {
    if (this.dataService.tenantInfo.sso.required) {
      this.auth.redirectToSsoPage();
    } else {
      this.router.navigate(['login']);
    }
  }

  get navbarLogo(): any {
    return ((this.dataService.tenantInfo || {}).navbar || {}).logo;
  }

  get menuItems(): any {
    return ((this.dataService.tenantInfo || {}).navbar || {}).menuItems;
  }

  goToView(route) {
    if (route) {
      this.router.navigateByUrl(route);
    }
  }

  goToBaseUrl(): void {
    this.routerService.navigateBaseUrl();
  }

}
