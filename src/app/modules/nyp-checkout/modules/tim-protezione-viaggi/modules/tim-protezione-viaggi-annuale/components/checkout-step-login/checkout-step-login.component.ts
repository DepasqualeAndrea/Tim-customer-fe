import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RouteHash } from 'app/modules/checkout/login-register/tim-retirees/login-register-tim-retirees/route-hashes.enum';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { CheckoutStates } from 'app/modules/nyp-checkout/models/api.model';
import { TIM_PROTEZIONE_VIAGGI_EUROPE_Y_ANNUALE_PRODUCT_NAME, TIM_PROTEZIONE_VIAGGI_WORLD_Y_ANNUALE_PRODUCT_NAME } from 'app/modules/nyp-checkout/nyp-checkout.module';
import { NypDataService } from 'app/modules/nyp-checkout/services/nyp-data.service';
import { Observable, interval } from 'rxjs';
import { distinct, map, take, tap } from 'rxjs/operators';
import { TimProtezioneViaggiAnnualeApiService } from '../../services/api.service';
import { AuthService } from '@services';
import { TimMyBrokerCustomersService } from 'app/core/services/tim-my-broker-customers.service';

type ViewType = 'LOGIN' | 'REGISTER' | 'MIGRATION';

@Component({
    selector: 'app-checkout-step-login',
    templateUrl: './checkout-step-login.component.html',
    styleUrls: ['./checkout-step-login.component.scss', '../../../../../../styles/checkout-forms.scss', '../../../../../../styles/size.scss', '../../../../../../styles/colors.scss', '../../../../../../styles/text.scss', '../../../../../../styles/common.scss'],
    standalone: false
})
export class CheckoutStepLoginComponent implements OnInit {
  @Input('state') public state: CheckoutStates;
  @ViewChild('innerhide') public HIDE;
  public Order$ = this.nypDataService.Order$;
  public readonly summaryStates: CheckoutStates[] = ['user-control', 'address', 'insurance-info', 'survey', 'consensuses'];

  currentView: ViewType = 'LOGIN';
  hideLegacyLogin: boolean;
  hideSsoLogin: boolean = true;
  showOrNavigate$: Observable<boolean>;
  content: any;
  startDateString: string;
  endDateString: string;
  startDate: Date;
  expirationDate: Date;
  daysDifference: number;
  quantity: number;

  constructor(
    private activatedRoute: ActivatedRoute,
    private kenticoTranslateService: KenticoTranslateService,
    private router: Router,
    public nypDataService: NypDataService,
    private apiService: TimProtezioneViaggiAnnualeApiService,
    private authService: AuthService,
    private timMyBrokerCustomersService: TimMyBrokerCustomersService,
  ) { }

  ngOnInit() {
    this.quantity = this.Order$.value.orderItem[0]?.quantity;
    this.startDateString = this.nypDataService.Order$.value?.orderItem[0]?.start_date;
    this.endDateString = this.nypDataService.Order$.value?.orderItem[0]?.expiration_date;

    if (this.startDateString && this.endDateString) {
      this.startDate = new Date(this.startDateString);
      this.expirationDate = new Date(this.endDateString);

      const timeDiff = this.expirationDate.getTime() - this.startDate.getTime();
      this.daysDifference = Math.ceil(timeDiff / (1000 * 3600 * 24));
      console.log('daysDifference:', this.daysDifference);
    } else {
      console.error('Le date non sono valide.');
    }

    this.getKenticoContent();

    this.showOrNavigate$ = interval(50)
      .pipe(
        map(() => localStorage.getItem('user')),
        distinct(),
        map((user: string) => {
          if (!!user && !!JSON.parse(user)?.data?.email) {
            console.log(false, 'test scope only.', 'isUserLogged ', user);
            this.checkExistingPolicy();
            return false;
          } else {
            console.log(true, 'test scope only.', 'isUserLogged ', user);
            return true;
          }
        }),
      );
  }

  checkExistingPolicy() {
    if (this.authService.loggedIn) {
      this.apiService.checkExistingPolicy().subscribe(
        response => {
          console.log('Policy check response:', response);
          if (response.data === "Nessun'altra polizza trovata") {
            this.nypDataService.CurrentState$.next('address');
          } else if (response.data === "Polizza già esistente") {
            this.nypDataService.CurrentState$.next('user-control');
          } else {
            this.router.navigate(['error-page']);
          }
        },
        error => {
          console.error('Errore durante il controllo della polizza esistente:', error);
          this.router.navigate(['error-page']);
        }
      );
    }
  }

  showFormPage(form: ViewType): boolean {
    return this.currentView === form;
  }

  getHeaderLabel(): string {
    return this.currentView === 'REGISTER' ? 'registration_header' : 'login_header';
  }

  switchView(view: ViewType) {
    if (this.currentView !== view) {
      this.currentView = view;
    }
  }

  redirectToMyTimAuth() {
    const orderNumber = this.nypDataService?.Order$?.value?.['number'];
    this.timMyBrokerCustomersService.redirectToMyTimAuth(orderNumber);
  }

  getKenticoContent() {
    this.kenticoTranslateService.getItem<any>('access_customers').pipe(
      take(1),
      tap(() => console.log(TIM_PROTEZIONE_VIAGGI_EUROPE_Y_ANNUALE_PRODUCT_NAME, TIM_PROTEZIONE_VIAGGI_WORLD_Y_ANNUALE_PRODUCT_NAME, 'processing old-fashioned login translation')),
      map(kenticoItem => ({
        background_tl: kenticoItem['background'].value[0].url,
        background_bl: kenticoItem['background'].value[1].url,
        background_tr: kenticoItem['background'].value[2].url,
        background_br: kenticoItem['background'].value[3].url,

        registration_header: kenticoItem['registration_title'].value,
        login_header: kenticoItem['access_title'].value,
        sign_in_link: kenticoItem['sign_in_link'].value,

        customers_login_form: {
          want_to_register: kenticoItem['want_to_register'].value,
          already_registered: kenticoItem['already_registered'].value,
          access_title: kenticoItem['access_title'].value,
          customer_access: kenticoItem['customer_access'].value,
          not_customer: kenticoItem['not_customer'].value,
          icon: kenticoItem['icon'].value[0].url,
          login_form: {
            password_form_label: kenticoItem['password'].value,
            password_form_placeholder: kenticoItem['password'].value,
            taxcode_form_label: kenticoItem['taxcode'].value,
            taxcode_form_placeholder: kenticoItem['taxcode'].value,
            forgot_password: kenticoItem['forgot_password'].value
          }
        },

        customers_register_form: {
          registration_successful: kenticoItem['registration_successful'].value,
          registration_unsuccessful: kenticoItem['registration_unsuccessful'].value,
        },

        ndg_migration_form: {
          taxcode_form_label: kenticoItem['taxcode'].value,
          not_customer: kenticoItem['not_customer'].value,
          migration_successful: kenticoItem['migration_successful'].value,
          migration_unsuccessful: kenticoItem['migration_unsuccessful'].value,
        }
      })
      ),
      tap(() => console.log(TIM_PROTEZIONE_VIAGGI_EUROPE_Y_ANNUALE_PRODUCT_NAME, TIM_PROTEZIONE_VIAGGI_WORLD_Y_ANNUALE_PRODUCT_NAME, 'processed old-fashioned translation')),
    ).subscribe(content => this.content = content);
  }

  navigateToForm(routeFragment: string) {
    this.router.navigate([this.router.url.split('#')[0].split('?')[0]], { fragment: RouteHash[routeFragment] });
  }
  private triggerCheckExistingPolicy(orderId: string): void {
    this.apiService.checkExistingPolicy().subscribe(
      response => {
        console.log('Policy check response:', response);
      },
      error => {
        console.error('Error checking policy:', error);
      }
    );

  }
}
