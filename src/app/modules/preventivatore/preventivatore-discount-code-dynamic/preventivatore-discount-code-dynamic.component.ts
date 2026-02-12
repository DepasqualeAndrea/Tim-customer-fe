import { Component, OnInit, OnDestroy, ViewChild, ViewContainerRef } from '@angular/core';
import { PreventivatorePage } from '../services/preventivatore-page.interface';
import { Product } from '@model';
import { Subscription, Observable } from 'rxjs';
import { PreventivatoreDiscountCodeProviderService } from './services/preventivatore-discount-code-provider.service';
import { DataService, CheckoutService, DiscountCodeService } from '@services';
import { Router, ActivatedRoute } from '@angular/router';
import { PreventivatoreDiscountCodeReducerProvider } from './state/preventivatore-discount-code-reducer-provider';
import { take } from 'rxjs/operators';
import { ComponentDataFactory } from './services/component-data-factory.model';
import { PreventivatoreDiscountCodeAbstractComponent } from './components/preventivatore-abstract/preventivatore-discount-code-abstract.component';
import { CheckOutBehavior } from '../partials/checkout-behavior';
import { PreventivatoreDiscountCodeDynamicService } from './services/preventivatore-discount-code-dynamic.service';
import { DiscountCodeAuthorizationResult } from 'app/core/services/discount-code-authorization-result.enum';



@Component({
  selector: 'app-preventivatore-discount-code-dynamic',
  templateUrl: './preventivatore-discount-code-dynamic.component.html',
  styleUrls: ['./preventivatore-discount-code-dynamic.component.scss']
})
export class PreventivatoreDiscountCodeDynamicComponent implements OnInit, OnDestroy, PreventivatorePage {
  @ViewChild('preventivatoreDiscountCodeDynamicBgImgHero', { read: ViewContainerRef, static: true }) bgImgHeroDCContainer;
  @ViewChild('preventivatoreDiscountCodeDynamicHowWorks', { read: ViewContainerRef, static: true }) howWorksContainer;
  @ViewChild('preventivatoreDiscountCodeDynamicWhatToKnow', { read: ViewContainerRef, static: true }) whatToKnowContainer;

  private preventivatoreDiscountCodeDynamicService: PreventivatoreDiscountCodeDynamicService;
  private subscriptions: Subscription[] = [];
  productCodes: string[];
  products: Product[];

  constructor(
    private service: PreventivatoreDiscountCodeProviderService,
    private router: Router,
    private dataService: DataService,
    private checkoutService: CheckoutService,
    private preventivatoreReducerProvider: PreventivatoreDiscountCodeReducerProvider,
    private discountToken: DiscountCodeService,
    private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
  }



  initializePreventivatore() {
    this.preventivatoreDiscountCodeDynamicService = new PreventivatoreDiscountCodeDynamicService(this.preventivatoreReducerProvider, this.productCodes);
    this.checkCouponCodeIsValid(this.activatedRoute)
      .pipe(take(1))
      .subscribe(result => {
        if (result === DiscountCodeAuthorizationResult.AuthorizedCouponCodeSupplied) {
          this.loadContentWhenAuthorized();
          return;
        }
        if (result === DiscountCodeAuthorizationResult.UnAuthorizedCodeConsumed) {
          this.loadContentWhenAuthorized();
          return;
        }
        this.redirectToPrivateArea();
      }, error => this.redirectToPrivateArea());
  }
  private loadContentWhenAuthorized() {
    this.dataService.setProductsFromInsuranceServices(this.products);
    this.getContent(this.productCodes);
  }
  private redirectToPrivateArea() {
    this.router.navigate(['/private-area/home']);
  }
  private checkCouponCodeIsValid(route: ActivatedRoute): Observable<DiscountCodeAuthorizationResult> {
    const couponCode = this.getCouponCodeParameter(route);
    return this.discountToken.getCouponAuthorizationResult(couponCode);
  }
  private getCouponCodeParameter(route: ActivatedRoute) {
    const couponCode = route.snapshot.queryParams['coupon'];
    if (couponCode) {
      try {
        return atob(couponCode);
      } catch (error) {
        return couponCode;
      }
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
      subscription = null;
    });
    this.subscriptions = null;
    this.preventivatoreDiscountCodeDynamicService.onDestroy();
  }

  private getContent(productCodes: string[]) {
    this.service.getBgImgHeroDCComponentFactory().pipe(take(1))
      .subscribe(componentFactory => {
        const component = this.createComponentInView(this.bgImgHeroDCContainer, componentFactory);
        this.preventivatoreDiscountCodeDynamicService.setBgImgHeroDCComponent(component);
        this.preventivatoreDiscountCodeDynamicService.sendAction('addBgImgHero', componentFactory.data);
      });
    this.service.getHowWorksComponentFactory().pipe(take(1))
      .subscribe(componentFactory => {
        const component = this.createComponentInView(this.howWorksContainer, componentFactory);
        this.preventivatoreDiscountCodeDynamicService.setHowWorksDCComponent(component);
        this.preventivatoreDiscountCodeDynamicService.sendAction('addHowWorks', componentFactory.data);
      });
      this.service.getWhatToKnowComponentFactory().pipe(take(1))
      .subscribe(componentFactory => {
        const component = this.createComponentInView(this.whatToKnowContainer, componentFactory);
        this.preventivatoreDiscountCodeDynamicService.setWhatToKnowDCComponent(component);
        this.preventivatoreDiscountCodeDynamicService.sendAction('addWhatToKnow', componentFactory.data);
      }
      );

    const checkoutSubscription = this.preventivatoreDiscountCodeDynamicService.onCheckoutAction$
      .subscribe(action => this.checkout(action));
    this.subscriptions.push(checkoutSubscription);
    this.service.getContent(productCodes);
  }

  private createComponentInView(view: ViewContainerRef, factory: ComponentDataFactory): PreventivatoreDiscountCodeAbstractComponent {
    const componentRef = view.createComponent(factory.componentFactory);
    return componentRef.instance;
  }

  private checkout(paylod: any) {
    const checkoutBehavior = new CheckOutBehavior(this.checkoutService, this.dataService, this.router);
    paylod.order = this.setUtmSourceAndTelemarketer(paylod.order);
    checkoutBehavior.checkout(paylod.order, paylod.product, paylod.router, true);
  }

  private setUtmSourceAndTelemarketer(order: any): any {
    const utm_source = this.router.routerState.root.snapshot.queryParamMap.get('utm_source');
    const telemarketer = parseInt(this.router.routerState.root.snapshot.queryParamMap.get('telemarketer'), 10);

    if (!utm_source || utm_source.length === 0) {
      return order;
    } else {
      const newOrder = this.checkoutService.addUtmSource(order, utm_source, telemarketer);
      return newOrder;
    }
  }
}
