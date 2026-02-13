import { Component, OnInit, ViewChild, ElementRef, OnDestroy, Input, OnChanges, AfterViewInit } from '@angular/core';
import { trigger, state, style, transition, animateChild, animate, query, group } from '@angular/animations';
import { DataService, AuthService } from '@services';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { filter, tap, throttleTime, map, take } from 'rxjs/operators';
import { fromEvent, Observable } from 'rxjs';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { User } from '@model';
import { RouterService } from 'app/core/services/router.service';

@Component({
    selector: 'app-navbar-pc',
    templateUrl: './navbar-pc.component.html',
    styleUrls: ['./navbar-pc.component.scss'],
    animations: [
        trigger('changeNavState', [
            state('initial', style({})),
            state('scrolling', style({ backgroundColor: '#fff', boxShadow: '0px -8px 16px #000', height: '72.5px', paddingTop: '0px', paddingBottom: '0px' })),
            transition('*=>initial', [group([query('@changeLogoState', animateChild()), animate('300ms 200ms')])]),
            transition('*=>scrolling', [group([query('@changeLogoState', animateChild()), animate('300ms')])]),
        ]),
        trigger('changeLogoState', [
            state('initial', style({ marginLeft: '5px', transform: 'scale(1)' })),
            state('scrolling', style({ marginLeft: '-15px', transform: 'scale(0.8)' })),
            transition('*=>initial', animate('300ms 600ms')),
            transition('*=>scrolling', animate('300ms'))
        ]),
    ],
    standalone: false
})
export class NavbarPcComponent implements OnInit, OnDestroy, AfterViewInit, OnChanges {

  currentState = 'initial';
  primaryLogo: string;
  secondaryLogo: string;
  navbarLogo: string;
  menuItems: any[];
  userInfo: any;
  mobileMenuOpened = false;
  iOSDevice: boolean;
  insuranceLogo: string;
  tertiaryNavbar: boolean;

  @Input() secondaryNavbar;

  @ViewChild('navbarContainer', { static: true }) elementView: ElementRef;
  @ViewChild('navbarMenu', { static: true }) navbarRef: ElementRef;


  constructor(
    public dataService: DataService,
    public authService: AuthService,
    private kenticoTranslateService: KenticoTranslateService,
    public routerService: RouterService
  ) { }

  ngOnInit() {
    this.kenticoTranslateService.getItem<any>('navbar.logo').pipe(take(1)).subscribe(item => {
      this.primaryLogo = item.images[1].url;
      this.secondaryLogo = item.images[0].url;
      this.insuranceLogo = item.images[2].url;
      this.navbarLogo = this.primaryLogo;
    });
    this.authService.userChangedSource.pipe(untilDestroyed(this)).subscribe((user) => {
      this.userInfo = this.authService.loggedIn && user ? this.computeUserInfo(user) : null;
    });
    this.switchLogos();
    this.iOSDevice = !!navigator.userAgent.match(/iPhone|iPod|iPad/);
    if (this.dataService.isTenant('banco-desio_db')) {
      this.tertiaryNavbar = true;
      this.currentState = 'scrolling';
    }
  }

  computeUserInfo(user: User): any {
    return Object.assign({
      username: user.address['firstname'] && `${user.address.firstname} ${user.address.lastname}` || user.email,
      address: {}
    }, user);
  }

  switchLogos() {
    if (!this.secondaryNavbar) {
      this.navbarLogo = this.currentState === 'initial' ? this.primaryLogo : this.secondaryLogo;
    } else {
      this.navbarLogo = this.secondaryLogo;
    }
  }

  ngOnChanges() {
    if ((this.dataService.tenantInfo.tenant === 'banco-desio_db' || this.dataService.tenantInfo.tenant === 'civibank_db') && (window.innerWidth < 768)) {
      this.dataService.getLoggedMenu().pipe(untilDestroyed(this)).subscribe(mItems => this.menuItems = this.dataService.getMenuItems().concat(mItems));
    } else {
      this.secondaryNavbar ? this.dataService.getLoggedMenu().pipe(untilDestroyed(this)).subscribe(mItems => this.menuItems = mItems)
        : this.menuItems = this.dataService.getMenuItems();
    }
  }

  ngOnDestroy() {
  }

  ngAfterViewInit() {
    this.createScrollEventListener()
      .pipe(filter(() => !this.mobileMenuOpened))
      .pipe(tap(() => this.closeMenuItemDropdowns()))
      .subscribe(scrollOffset => {
        this.currentState = scrollOffset === 0 ? 'initial' : 'scrolling';
        this.switchLogos();
      });
  }

  resetNavbarState() {
    this.mobileMenuOpened = false;
    this.navbarRef.nativeElement.classList.remove('show');
    this.currentState = 'initial';
  }

  createScrollEventListener(): Observable<number> {
    return fromEvent(window, 'scroll').pipe(untilDestroyed(this), throttleTime(10), map(() => window.pageYOffset));
  }

  displayMobileMenu() {
    this.mobileMenuOpened = !this.mobileMenuOpened;
    this.currentState = this.mobileMenuOpened ? 'scrolling' : window.scrollY === 0 ? 'initial' : 'scrolling';
    this.switchLogos();
  }

  navigate(url: string) {
    if (!!url && url.length > 0) {
      this.routerService.navigate(url);
    }
  }

  private closeMenuItemDropdowns() {
    this.menuItems.forEach(item => {
      const anchor = document.getElementById(`nav-link-${item.id}`);
      if (item.children && anchor && !anchor.classList.contains('collapsed')) {
        anchor.click();
      }
    });
  }
}
