import { NypConfigurationService, NypIadTokenService, } from "@NYP/ngx-multitenant-core";
import { DOCUMENT } from "@angular/common";
import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
  Renderer2
} from "@angular/core";
import { Meta, SafeUrl } from "@angular/platform-browser";
import { NavigationEnd, Router } from "@angular/router";
import { AuthService, DataService } from "@services";
import { environment } from "environments/environment";
import { BlockUI, NgBlockUI } from "ng-block-ui";
import { BehaviorSubject, Observable, Subject, of } from "rxjs";
import { filter, map, mergeMap } from "rxjs/operators";
import { LoaderLegacyComponent } from "./components/public/loader-legacy/loader-legacy.component";
import { GET_TOKEN, IS_GUEST_TOKEN, REDIRECT_TOKEN_LOCAL_STORAGE_KEY, REMOVE_GUEST_TOKEN, REMOVE_TOKEN, sessionSoftClear, SET_GUEST_TOKEN, SET_TOKEN } from "./core/models/token-interceptor.model";
import { AdobeAnalyticsDatalayerService } from './core/services/adobe_analytics/adobe-init-datalayer.service';
import { ComponentFeaturesService } from "./core/services/componentFeatures.service";
import { CookieService } from "./core/services/cookie.service";
import { LoaderService } from "./core/services/loader.service";
import { ModalService } from "./core/services/modal.service";
import { SharingDataService } from "./core/services/sharing-data.service";
import { NYP_KENTICO_NAME, NYP_KENTICO_SLUG } from "./modules/nyp-checkout/nyp-checkout.module";
import { NypDataService } from "./modules/nyp-checkout/services/nyp-data.service";

declare let fbq: Function; // fbq function declaration
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements AfterViewChecked, OnInit {
  private AUTH_PATH = ["signup", "/login", "/registrazione"];
  @BlockUI() blockUI: NgBlockUI;
  loaderTemplate: LoaderLegacyComponent;
  public sharingChekoutSteps: any;
  public visibleStepWizard = false;
  private reload = false;
  report = false;
  private stopSharingData = false;
  private typeModal = "modal";
  public isCheckoutFalse = false;
  nameTab: string;
  showInsurances = false;
  previousUrl: string;
  currentUrl: string;
  routingUrl = { previousUrl: "", currentUrl: "" };
  isChatEnabled: boolean;
  chatUrl: SafeUrl;
  tenantHasSeoTags: boolean;
  static token$: Subject<{ key: 'guest' | 'user', value: string }> = new Subject();
  token$: Observable<{ key: 'guest' | 'user', value: string }> = AppComponent.token$;
  showGuestToken: boolean = false;
  private static appReady$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public static AppReady$: Observable<boolean> = AppComponent.appReady$.asObservable();
  public runApp$ = AppComponent.appReady$;

  setToken(token: string, type: 'guest' | 'user') {
    AppComponent.setToken(token, type);
  }
  static setToken(token: string, type: 'guest' | 'user') {
    AppComponent.token$.next({ key: type, value: token });
  }

  constructor(
    private router: Router,
    private changeDetector: ChangeDetectorRef,
    private sharingData: SharingDataService,
    private modalService: ModalService,
    public dataService: DataService,
    private meta: Meta,
    private componentFeaturesService: ComponentFeaturesService,
    private loaderService: LoaderService,
    private cookieService: CookieService,
    private renderer: Renderer2,
    protected nypConfigurationService: NypConfigurationService,
    @Inject(DOCUMENT) private document: Document,
    private nypIadTokenService: NypIadTokenService,
    private adobeAnalyticsDatalayer: AdobeAnalyticsDatalayerService,
    private nypDataService: NypDataService,
    private authService: AuthService,
  ) {
    if (!!environment.username && !!environment.password && !GET_TOKEN())
      this.authService.ndgLogin({ user: { ndg_code: environment.username, password: environment.password } }).subscribe(() => this.loadingStorageInfoForToken());
    else
      this.loadingStorageInfoForToken();
  }

  private loadingStorageInfoForToken() {
    this.token$.pipe(
      map(token => !IS_GUEST_TOKEN() && token?.key != 'user'),
    ).subscribe(v => this.showGuestToken = v);

    REMOVE_GUEST_TOKEN();

    this.restoringSessionOrOpeningNewGuestSession();

    if (!!localStorage.getItem(REDIRECT_TOKEN_LOCAL_STORAGE_KEY) || !!GET_TOKEN()) {
      this.setToken(localStorage.getItem(REDIRECT_TOKEN_LOCAL_STORAGE_KEY) || GET_TOKEN(), 'user');
    } else {
      this.showGuestToken = true;
      // If no user token is found, we manually start the process to get a guest token.
      // The actual guest token value will be retrieved from dataService.getProperties()
      // inside the restoringSessionOrOpeningNewGuestSession pipe.
      AppComponent.setToken('REQUEST_GUEST_TOKEN', 'guest');
    }
  }

  private restoringSessionOrOpeningNewGuestSession() {
    this.token$
      .pipe(
        filter((token: { key: 'guest' | 'user', value: string }) => {
          // This filter logic ensures that we proceed if:
          // 1. There is currently no guest token stored (IS_GUEST_TOKEN() is false), OR
          // 2. The token emitted is of type 'user'.
          // This allows the guest flow to begin when AppComponent.setToken('REQUEST_GUEST_TOKEN', 'guest') is called.
          return !IS_GUEST_TOKEN() || token?.key === 'user';
        }),
        mergeMap((token: { key: 'guest' | 'user', value: string }) => {
          if (token.key === 'user') {
            return of(token);
          } else {
            // If the token is of type 'guest' (even our placeholder 'REQUEST_GUEST_TOKEN'),
            // we proceed to call getProperties to get the actual guest token.
            return this.dataService.getProperties().pipe(
              map(t => {
                return { key: 'guest', value: t.data.token };
              }),
            );
          }
        }),
        mergeMap((token: { key: 'guest' | 'user', value: string }) => {
          // In case the redirect storage is found under localstorage, just exchange it with guestToken, and erasing it from localstorage memory.
          sessionSoftClear(['old_path']);

          if (token.key === 'user') {
            SET_TOKEN(token.value);
            this.dataService.token = token.value;

            return this.authService.setCurrentUserObs();
          } else {
            REMOVE_TOKEN();

            //localStorage.clear();
            //sessionStorage.clear();

            SET_GUEST_TOKEN(token.value);
            this.dataService.token = token.value;
            return of(undefined);
          }
        }),
        mergeMap(() => this.nypDataService.downloadKenticoContent(NYP_KENTICO_NAME, NYP_KENTICO_SLUG),)
      )
      .subscribe(() => {
        this.appInitialization();
      });
  }

  private appInitialization() {
    // cookie configuration
    const cookieConfiguration =
      this.dataService.tenantInfo.cookieConfiguration;
    const cookieConfigurationEnabled = cookieConfiguration.enabled;
    if (cookieConfigurationEnabled) {
      this.loadCookiePreferences();
    }
    const clpConfiguration = cookieConfiguration.clp;
    const isClpConfigActive = clpConfiguration && clpConfiguration.enabled;
    if (isClpConfigActive) {
      const clpConfigElements = clpConfiguration.configElements;
      this.loadClpScript(clpConfigElements);
    }
    // this.localeService.setupLocale();
    this.sharingData.setReportDisabled.subscribe((event) => {
      this.nameTab = event.nameTab;
      this.report = event.params;
    });
    document.title = this.dataService.tenantInfo.pageTitle;
    const link = document.createElement("link");
    link.type = "image/x-icon";
    link.rel = "shortcut icon";
    link.href = this.dataService.tenantInfo.favicon;
    document.getElementsByTagName("head")[0].appendChild(link);
    this.getFeatureFlag();
    this.getComponentFeatures();
    this.loadLegacyLoader();
    /* metapixel TIM */
    this.router.events.subscribe((y: NavigationEnd) => {
      if (y instanceof NavigationEnd) {
        console.log(`Navigation from: \n\n${y.url} - to: ${y.urlAfterRedirects}\n\n`);
        fbq("track", "PageView");
      }
    });
  }

  loadClpScript(configElements) {
    configElements.forEach((element) => {
      const node = {} as any;
      const keys = Object.keys(element);
      const values = Object.values(element);
      keys.forEach((key, index) => {
        if (values[index]) {
          node[key] = values[index];
        }
      });
      const clpScriptNode = document.createElement(node.tag);
      delete node.tag;
      Object.assign(clpScriptNode, node);
      document.getElementsByTagName("head")[0].appendChild(clpScriptNode);
    });
  }

  ngOnInit() {
    this.isChatEnabled = this.getChatEnabled();
    this.chatUrl = this.getChatUrl();
    // seo meta tags managed with route events
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.nypConfigurationService
          .getFeaturesToggle()
          .subscribe((features) => {
            const seo_features = features.data.features.filter((f) => {
              return f.name === "seo_index";
            });
            if (seo_features.length && seo_features[0].enabled === false) {
              this.meta.addTag(
                { name: "robots", content: "noindex,nofollow" },
                true
              );
            }
          });
      }
      window.scrollTo(0, 0);
    });
    this.setLanguage();
    this.updateCanonicalUrl();
    if (this.dataService.tenantInfo.tenant === "banca-sella_db") {
      this.temporaryGeSkiRedirectToWinterSport();
    }
  }

  reportDisabled() {
    this.report = true;
    // if (this.nameTab !== undefined && this.nameTab !== 'active-services') {
    //   this.sharingData.setActiveTab(true);
    // }
  }

  setTab() {
    this.sharingData.setActiveTab(true);
  }

  ngAfterViewChecked() {
    this.changeDetector.detectChanges();
    if (!this.stopSharingData) {
      this.sharingData.currentData.subscribe(
        (data) => {
          if (data && data.length !== 0) {
            this.sharingChekoutSteps = data;
            this.visibleStepWizard = true;
          } else {
            this.visibleStepWizard = false;
          }
        },
        (error) => {
          throw error;
        }
      );
    }
  }

  searchItemShow(id_item) {
    const items = Array.from(
      document.getElementsByClassName("show-item-menu-mobile")
    );
    if (items.length > 0 && items[0] !== document.getElementById(id_item)) {
      items.forEach((item) => {
        item.classList.remove("show-item-menu-mobile");
        const nameArrow = item.id + "Arrow";
        this.rotateArrow(nameArrow);
      });
    }
  }

  rotateArrow(id_item) {
    const element = document.getElementById(id_item);
    if (!element.classList.contains("rotate")) {
      element.classList.add("rotate");
    } else {
      element.classList.remove("rotate");
    }
  }

  changeClassIcnBurger() {
    const icnBurger = document.getElementById("icn-burger");
    if (icnBurger.classList.contains("navbar-toggler")) {
      icnBurger.classList.add("collapsed");
    }
  }

  bodyOverflowHidden(type) {
    this.fixedFooterMenuBottom();
    const element = document.getElementById("body-element");
    const element_container = document.getElementById("wrapper-container");
    if (!element.classList.contains("overflow-hidden") && type !== "close") {
      element.classList.add("overflow-hidden");
      element_container.classList.add("overflow-hidden");
    } else {
      element.classList.remove("overflow-hidden");
      element_container.classList.remove("overflow-hidden");
    }
  }

  closeMenu() {
    if (window.innerWidth < 992) {
      const element = document.getElementById("navbarNav");
      if (element.classList.contains("show")) {
        element.classList.remove("show");
      }
      this.changeClassIcnBurger();
      this.bodyOverflowHidden("close");
    }
  }

  fixedFooterMenuBottom() {
    const element = document.getElementById("footer-menu-mob");
    element.style.position = "fixed";
    element.style.bottom = "0";
  }

  getFeatureFlag() {
    this.nypConfigurationService.getFeaturesToggle().subscribe(
      (res) => {
        const feature = {};
        res.data.features.forEach((value) => {
          feature[value.name] = value.enabled;
        });
        this.dataService.setFeatureToggle(feature);
        this.getContentPublic();
      },
      (error) => {
        throw error;
      }
    );
  }

  getContentPublic() {
    this.nypConfigurationService.getContents().subscribe((response) => {
      this.dataService.setContents(response["data"]);
      AppComponent.appReady$.next(true);
    });
  }

  getComponentFeatures() {
    this.nypConfigurationService.getComponentFeature().subscribe({
      next: (response) =>
        this.componentFeaturesService.setComponentFeatures(response),
      complete: () => this.afterGetComponentFeatures(),
    });
  }

  afterGetComponentFeatures() {
    this.componentFeaturesService.useComponent("seo");
    this.componentFeaturesService.useRule("seo-meta-tags");
    this.tenantHasSeoTags = this.componentFeaturesService.isRuleEnabled();
    /*  if (this.tenantHasSeoTags) {
       this.seoMetaTagsService.initSeoTags();
     } */
  }

  getChatEnabled() {
    const tenantInfo = this.dataService.getTenantInfo();
    return !!tenantInfo.chat && !!tenantInfo.chat.enabled;
  }

  getChatUrl() {
    const tenantInfo = this.dataService.getTenantInfo();
    if (tenantInfo.chat && tenantInfo.chat.url) {
      return tenantInfo.chat.url;
    }
    return;
  }

  setLanguage() {
    const tenantInfo = this.dataService.getTenantInfo();
    this.document.documentElement.lang = tenantInfo.language
      ? tenantInfo.language
      : "it";
  }

  updateCanonicalUrl() {
    const tenantInfo = this.dataService.getTenantInfo();
    const canonicalArray = tenantInfo.canonical;
    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        const head = this.document.getElementsByTagName("head")[0];
        let element: HTMLLinkElement =
          this.document.querySelector(`link[rel='canonical']`) || null;
        if (element == null) {
          element = this.document.createElement("link") as HTMLLinkElement;
          head.appendChild(element);
        }
        if (canonicalArray && canonicalArray.length > 0) {
          canonicalArray.some((canonical) => {
            if (canonical.path === val.url) {
              element.setAttribute("rel", "canonical");
              element.setAttribute("href", canonical.url);
              return true;
            }
            element.setAttribute("rel", "canonical");
            element.setAttribute("href", window.location.href);
            return false;
          });
        } else {
          element.setAttribute("rel", "canonical");
          element.setAttribute("href", window.location.href);
        }
      }
    });
  }

  loadLegacyLoader() {
    const tenantInfo = this.dataService.getTenantInfo();
    this.loaderService.setTypeLoader(tenantInfo.loader);
  }

  loadCookiePreferences() {
    if (this.dataService.tenantInfo.tenant === "genertel_db") {
      this.loadGenertelCookiesScript();
      this.cookieService.acceptNecessaryCookies();
    }
    if (this.dataService.tenantInfo.tenant !== "santa-lucia_db") {
      if (!this.cookieService.getCookie("user-cookie-preferences")) {
        this.modalService.openModalCentered(
          "cookies_preferences_modal",
          "CookiesModal"
        );
      } else {
        this.cookieService.handleUserPreferences("user-cookie-preferences");
      }
    }
  }

  private loadGenertelCookiesScript() {
    const { source, dataDomain } =
      this.dataService.tenantInfo.cookieConfiguration.scripts;
    const cookieScript = this.renderer.createElement(
      "script"
    ) as HTMLScriptElement;
    cookieScript.src = source;
    cookieScript.charset = "UTF-8";
    cookieScript.type = "text/javascript";
    cookieScript.setAttribute("data-domain-script", dataDomain);
    const optScript = this.renderer.createElement("script");
    optScript.type = "text/javascript";
    optScript.text = "function OptanonWrapper() { }";
    this.renderer.appendChild(this.document.head, cookieScript);
    this.renderer.appendChild(this.document.head, optScript);
  }

  private temporaryGeSkiRedirectToWinterSport(): void {
    if (
      window.location.pathname ===
      "/preventivatore;code=ge-ski-plus,ge-ski-premium"
    ) {
      window.location.pathname =
        "/preventivatore;code=winter-sport-plus,winter-sport-premium";
    }
  }
}
