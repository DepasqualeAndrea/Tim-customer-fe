import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AuthService, DataService } from '@services';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { animate, animateChild, group, query, state, style, transition, trigger } from '@angular/animations';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { fromEvent } from 'rxjs/internal/observable/fromEvent';
import { filter, map, take, tap, throttleTime } from 'rxjs/operators';
import { User } from '@model';
import { Meta } from '@angular/platform-browser';
import { NavbarMenu } from '../navbar.model';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';

@Component({
  selector: 'app-navbar-cb',
  templateUrl: './navbar-cb.component.html',
  styleUrls: ['./navbar-cb.component.scss'],
  animations: [
    trigger('changeNavState', [
      state('initial', style({})),
      state('scrolling', style({ backgroundColor: '#333', height: '54.5px', paddingTop: '0px', paddingBottom: '0px' })),
      transition('*=>initial', [group([query('@changeLogoState', animateChild()), animate('300ms 200ms')])]),
      transition('*=>scrolling', [group([query('@changeLogoState', animateChild()), animate('300ms')])]),
    ]),
    trigger('changeLogoState', [
      state('initial', style({ fontSize: '25px', marginLeft: '15px', transform: 'scale(1)' })),
      state('scrolling', style({ fontSize: '20px', marginLeft: '-30px', transform: 'scale(0.6)' })),
      transition('*=>initial', [group([query('@changeNavTextState', animateChild()), animate('300ms 600ms')])]),
      transition('*=>scrolling', [group([query('@changeNavTextState', animateChild()), animate('300ms')])]),
    ]),
    trigger('changeNavTextState', [
      state('initial', style({ marginLeft: '-10px', transform: 'scale(0.9)' })),
      state('scrolling', style({ marginLeft: '15px', transform: 'scale(1.4)' })),
      transition('*=>initial', animate('300ms 1000ms')),
      transition('*=>scrolling', animate('300ms 600ms')),
    ]),
    trigger('changeSubNavState', [
      state('initial', style({ top: '80px' })),
      state('scrolling', style({ top: '53px', backgroundColor: '#454545' })),
      transition('*=>initial', animate('300ms 200ms')),
      transition('*=>scrolling', animate('300ms')),
    ])
  ]
})
export class NavbarCbComponent implements OnInit, OnDestroy, AfterViewInit {

  currentState = 'initial';
  navbarInfo: { logo: '', menuItems: NavbarMenu[] };
  userInfo: any;
  loc: string;
  mobileMenuOpened = false;

  @ViewChild('navbarContainer', { static: true }) elementView: ElementRef;

  @ViewChild('navbarMenu') navbarRef: ElementRef;
  navbarLogo: any;
  kenticoItem: any;

  @ViewChild('navbarMain') navMain: ElementRef;
  @ViewChild('navbarSub') navSub: ElementRef;

  constructor(private dataService: DataService,
    private authService: AuthService,
    private router: Router,
    private kenticoTranslateService: KenticoTranslateService,
    private route: ActivatedRoute,

    private meta: Meta) {
    this.loc = encodeURI(`${window.location.protocol}//${window.location.hostname}:${window.location.port === '80' ? '' : window.location.port}/landing-page`);
    this.meta.addTag({ name: 'og:url', content: this.loc });
    this.meta.addTag({ name: 'og:type', content: 'website' });
    this.meta.addTag({ name: 'og:title', content: 'Protezione CheBanca!' });
    this.meta.addTag({ name: 'og:image', content: '../../../../assets/images/chebanca/cover-vetrina.jpg' });
  }

  ngOnInit() {
    this.KenticoNavBarMenuItems();
    if (this.dataService.tenantInfo) {
      this.navbarInfo = this.dataService.tenantInfo.navbar;
    }
    this.authService.userChangedSource.pipe(untilDestroyed(this)).subscribe((user) => {
      this.userInfo = this.authService.loggedIn && user ? this.computeUserInfo(user) : null;
    });
  }


  KenticoNavBarMenuItems() {
    this.kenticoTranslateService.getItem<any>('navbar_items').pipe(take(1)).subscribe(item => {
      this.navbarLogo = item.logo.value[0].url;
      this.kenticoItem = item.menu_items;
    });
  }

  ngOnDestroy(): void {
  }

  computeUserInfo(user: User): any {
    return Object.assign({
      username: user.address['firstname'] && `${user.address.firstname} ${user.address.lastname}` || user.email,
      address: {}
    }, user);
  }


  ngAfterViewInit() {
    this.changeNavbarNewCheckout();
    this.createScrollEventListener()
      .pipe(filter(() => !this.mobileMenuOpened))
      .pipe(tap(() => this.closeMenuItemDropdowns()))
      .subscribe(scrollOffset => {
        this.currentState = scrollOffset === 0 ? 'initial' : 'scrolling';
      });
  }

  onSubNavItemClick($event, subItem, i) {
    this.resetNavbarState();
    $event.preventDefault();
    if (!this.router.isActive(subItem.route, true)) {
      document.getElementById(`nav-link-${i}`).click();
    }
  }

  resetNavbarState() {
    this.mobileMenuOpened = false;
    this.navbarRef.nativeElement.classList.remove('show');
    this.currentState = 'initial';
  }

  createScrollEventListener(): Observable<number> {
    return fromEvent(window, 'scroll').pipe(untilDestroyed(this), throttleTime(10), map(() => window.pageYOffset));
  }

  goToSso() {
    this.authService.redirectToSsoPage();
  }

  openFBWindow($event, w, h) {
    return this.openShareWindow($event, w, h, `https://www.facebook.com/sharer/sharer.php?u=${this.loc}`);
  }

  openTwitterWindow($event, w, h) {
    return this.openShareWindow($event, w, h, `https://twitter.com/intent/tweet?text=${this.loc}`);
  }

  openLinkedinWindow($event, w, h) {
    return this.openShareWindow($event, w, h, `https://www.linkedin.com/sharing/share-offsite/?url=${this.loc}`);
  }

  openShareWindow($event, w, h, url) {
    $event.preventDefault();
    const dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : window.screenX;
    const dualScreenTop = window.screenTop !== undefined ? window.screenTop : window.screenY;
    const width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
    const height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;
    const systemZoom = width / window.screen.availWidth;
    const left = (width - w) / 2 / systemZoom + dualScreenLeft;
    const top = height / systemZoom + dualScreenTop;
    const newWindow = window.open(url, '', 'scrollbars=yes, width=' + w / systemZoom + ', height=' + height / systemZoom + ', top=' + top + ', left=' + left);
    if (window.focus) {
      newWindow.focus();
    }
  }

  displayMobileMenu() {
    this.mobileMenuOpened = !this.mobileMenuOpened;
    this.currentState = this.mobileMenuOpened ? 'scrolling' : window.scrollY === 0 ? 'initial' : 'scrolling';
  }

  private closeMenuItemDropdowns() {
    this.kenticoItem.value.forEach(item => {
      const anchor = document.getElementById(`nav-link-${item.id}`);
      if (item.children && anchor && !anchor.classList.contains('collapsed')) {
        anchor.click();
      }
    });
  }

  private changeNavbarNewCheckout() {
    this.route.url.subscribe(urls => {
      if (/\bcheckout\b/.test(this.router.url) && this.dataService.product.product_code === 'ge-home') {
        this.navMain.nativeElement.classList.add('variant');
        this.navSub.nativeElement.classList.add('variant');
      } else {
        if (document.getElementById('nav-main').classList.contains('variant')) {
          this.navMain.nativeElement.classList.remove('variant');
          this.navSub.nativeElement.classList.remove('variant');
        }
      }
    });
  }


}
