import { OnDestroy, OnInit, ViewChild, ViewContainerRef, Directive } from '@angular/core';
import { PreventivatoreAbstractComponent } from './components/preventivatore-abstract/preventivatore-abstract.component';
import { PreventivatoreProviderService } from './services/preventivatore-provider.service';
import { take } from 'rxjs/operators';
import { ComponentDataFactory } from './services/component-data-factory.model';
import { PreventivatoreDynamicService } from './services/preventivatore-dynamic.service';
import { Router } from '@angular/router';
import { CheckOutBehavior } from '../partials/checkout-behavior';
import { CheckoutService, DataService } from '@services';
import { Subscription } from 'rxjs';
import { Product, RequestOrder } from '@model';
import { PreventivatorePage } from '../services/preventivatore-page.interface';
import 'hammerjs';
import { PreventivatoreReducerProvider } from './state/preventivatore-reducer-provider';

@Directive()
export abstract class PreventivatoreAbstractDynamicComponent implements OnInit, OnDestroy, PreventivatorePage {
  @ViewChild('preventivatoreDynamicHeader', { read: ViewContainerRef, static: true }) headerContainer;
  @ViewChild('preventivatoreDynamicHero', { read: ViewContainerRef, static: true }) heroContainer;
  @ViewChild('preventivatoreDynamicBgImgHero', { read: ViewContainerRef, static: true }) bgImgHeroContainer;
  @ViewChild('preventivatoreDynamicHowWorks', { read: ViewContainerRef, static: true }) howWorksContainer;
  @ViewChild('preventivatoreDynamicMoreInfo', { read: ViewContainerRef, static: true }) moreInfoContainer;
  @ViewChild('preventivatoreDynamicWhatToKnow', { read: ViewContainerRef, static: true }) whatToKnowContainer;
  @ViewChild('preventivatoreDynamicForWho', { read: ViewContainerRef, static: true }) forWhoContainer;
  // generic containers
  @ViewChild('preventivatoreDynamicComponent1', { read: ViewContainerRef, static: true }) componentContainer1;
  @ViewChild('preventivatoreDynamicComponent2', { read: ViewContainerRef, static: true }) componentContainer2;
  @ViewChild('preventivatoreDynamicComponent3', { read: ViewContainerRef, static: true }) componentContainer3;
  @ViewChild('preventivatoreDynamicComponent4', { read: ViewContainerRef, static: true }) componentContainer4;
  @ViewChild('preventivatoreDynamicComponent5', { read: ViewContainerRef, static: true }) componentContainer5;
  @ViewChild('preventivatoreDynamicComponent6', { read: ViewContainerRef, static: true }) componentContainer6;
  @ViewChild('preventivatoreDynamicComponent7', { read: ViewContainerRef, static: true }) componentContainer7;
  @ViewChild('preventivatoreDynamicComponent8', { read: ViewContainerRef, static: true }) componentContainer8;

  protected preventivatoreDynamicService: PreventivatoreDynamicService;
  private subscriptions: Subscription[] = [];
  productCodes: string[];
  products: Product[];

  constructor(
    protected service: PreventivatoreProviderService,
    protected router: Router,
    protected dataService: DataService,
    protected checkoutService: CheckoutService,
    protected preventivatoreReducerProvider: PreventivatoreReducerProvider,
    ) {
  }

  ngOnInit() {
  }

  initializePreventivatore() {
    this.preventivatoreDynamicService = new PreventivatoreDynamicService(this.preventivatoreReducerProvider, this.productCodes);
    this.dataService.setProductsFromInsuranceServices(this.products);
    this.getContent(this.productCodes);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
      subscription = null;
    });
    this.subscriptions = null;
    this.preventivatoreDynamicService.onDestroy();
  }

  getContent(productCodes: string[]) {
    this.service.getHeroComponentFactory()
      .pipe(take(1)).subscribe(componentFactory => {
        const component = this.createComponentInView(this.heroContainer, componentFactory);
        this.preventivatoreDynamicService.setHeroComponent(component);
        this.preventivatoreDynamicService.sendAction('addHero', componentFactory.data);
      }
      );
    this.service.getBgImgHeroComponentFactory().pipe(take(1))
      .subscribe(componentFactory => {
        const component = this.createComponentInView(this.bgImgHeroContainer, componentFactory);
        this.preventivatoreDynamicService.setBgImgHeroComponent(component);
        this.preventivatoreDynamicService.sendAction('addBgImgHero', componentFactory.data);
      }
      );
    this.service.getHeaderComponentFactory()
      .pipe(take(1)).subscribe(componentFactory => {
        const component = this.createComponentInView(this.headerContainer, componentFactory);
        this.preventivatoreDynamicService.setHeaderComponent(component);
      }
      );
    this.service.getHowWorksComponentFactory().pipe(take(1))
      .subscribe(componentFactory => {
        const component = this.createComponentInView(this.howWorksContainer, componentFactory);
        this.preventivatoreDynamicService.setHowWorksComponent(component);
        this.preventivatoreDynamicService.sendAction('addHowWorks', componentFactory.data);
      }
      );
    this.service.getMoreInfoComponentFactory().pipe(take(1))
      .subscribe(componentFactory => {
        const component = this.createComponentInView(this.moreInfoContainer, componentFactory);
        this.preventivatoreDynamicService.setMoreInfoComponent(component);
        this.preventivatoreDynamicService.sendAction('addMoreInfo', componentFactory.data);
      }
      );
    this.service.getWhatToKnowComponentFactory()
      .pipe(take(1)).subscribe(componentFactory => {
        const component = this.createComponentInView(this.whatToKnowContainer, componentFactory);
        this.preventivatoreDynamicService.setWhatToKnowComponent(component);
        this.preventivatoreDynamicService.sendAction('addWhatToKnow', componentFactory.data);
      }
      );
    this.service.getForWhoComponentFactory()
      .pipe(take(1)).subscribe(componentFactory => {
        const component = this.createComponentInView(this.forWhoContainer, componentFactory);
        this.preventivatoreDynamicService.setForWhoComponent(component);
        this.preventivatoreDynamicService.sendAction('addForWho', componentFactory.data);
      }
      );

    // for generic containers
    this.createComponentInContainers();

    const checkoutSubscription = this.preventivatoreDynamicService.onCheckoutAction$
      .subscribe(action => this.checkout(action));
    this.subscriptions.push(checkoutSubscription);
    this.service.getContent(productCodes);
  }

  public createComponentInContainers() {
    Object.keys(this).filter(key => key.match(/^componentContainer\d+$/))
      .sort((keyA, keyB) => keyA.localeCompare(keyB))
      .map(k => this[k])
      .forEach((cc, i) => {
        const index = i + 1;
        this.service.getComponentFactory(index)
          .pipe(take(1)).subscribe(componentFactory => {
            const componentContainer = cc;
            const component = this.createComponentInView(componentContainer, componentFactory);
            this.preventivatoreDynamicService.setComponent(component, index);
            this.preventivatoreDynamicService.sendAction(`addComponent${index}`, componentFactory.data);
          });
      });
  }

  private createComponentInView(view: ViewContainerRef, factory: ComponentDataFactory): PreventivatoreAbstractComponent {
    const componentRef = view.createComponent(factory.componentFactory);
    return componentRef.instance;
  }

  private checkout(payload: any) {
    const checkoutBehavior = new CheckOutBehavior(this.checkoutService, this.dataService, this.router);
    payload.order = this.setUtmSourceAndTelemarketer(payload.order);
    payload.order = this.checkoutService.addQueryParamsToOrderRequest(payload.order);
    checkoutBehavior.checkout(payload.order, payload.product, payload.router, true);
  }

  private setUtmSourceAndTelemarketer(order: RequestOrder): RequestOrder {
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
