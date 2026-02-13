import { trigger, state, style, transition, group, animate } from '@angular/animations';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import {DataService} from '@services';
import { fromEvent, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
    selector: 'app-quotator-yolo-for-ski',
    templateUrl: './quotator-yolo-for-ski.component.html',
    styleUrls: ['./quotator-yolo-for-ski.component.scss'],
    animations: [
        trigger('changePanelState', [
            state('floating', style({ display: 'none' })),
            state('sticking', style({ margin: '0', position: 'fixed', zIndex: '100', bottom: '0', left: '0', width: '100vw', backgroundColor: '#fff',
                boxShadow: '0 0 8px rgb(0 0 0 / 25%)', maxHeight: '120px', height: '100px', justifyContent: 'flex-end' })),
            transition('*=>floating', [group([animate('0ms 0ms')])]),
            transition('*=>sticking', [group([animate('0ms 0ms')])]),
        ]),
    ],
    standalone: false
})
export class QuotatorYoloForSkiComponent implements OnInit {

  @Input() product;
  @Output() actionEvent = new EventEmitter<any>();
  peopleQuantity = 1;
  maximumPeople;
  daysQuantity = 1;
  maximumDays = 29;
  price;
  daily = false;
  selectedVariant;
  public currentState = 'floating';

  constructor(
    public dataService: DataService
  ) {}

  ngOnInit(): void {
    this.maximumPeople = this.product.maximum_insurable;
    this.setDefaultValue();
  }
  setDefaultValue() {
    this.daily = true;
    this.selectedVariant = this.product.variants.find((value) => value.name === '1 day');
    this.setPackage( this.selectedVariant.name);
  }

  subtractQuantityPeople() {
    if (this.peopleQuantity > 1) {
      this.peopleQuantity--;
    }
  }
  addQuantityPeople() {
    if (this.peopleQuantity < this.maximumPeople) {
      this.peopleQuantity++;
    }
  }
  subtractQuantityDays() {
    if (this.daysQuantity > 1) {
      this.daysQuantity--;
    }
  }
  addQuantityDays() {
    if (this.daysQuantity) {
      this.daysQuantity++;
    }
  }

  setPackage(variantName) {
    this.daysQuantity = 1;
    if (variantName === 'Seasonal') {
      this.daily = false;
    } else {
      this.daily = true;
    }
    this.selectedVariant =  this.product.variants.find((value) => value.name === variantName);
    return   this.selectedVariant;
  }

  checkout() {
    const daysNumber =  this.selectedVariant.name === 'Seasonal' ?  null : this.daysQuantity;
    const firstLine = {
      variant_id: this.selectedVariant.id,
      quantity: this.peopleQuantity,
      days_number: daysNumber
     };
    const order = { order: { line_items_attributes: { '0': firstLine } } };
    this.sendCheckoutAction(order);
  }
  sendCheckoutAction(order) {
    const action = {
      action: 'checkout_product',
      payload: {
        product: this.product,
        order: order,
        router: 'checkout'
      }
    };
    this.dataService.daysOfCoverage = order.order.line_items_attributes[0].days_number;
    this.emitActionEvent(action);
  }
  emitActionEvent(action) {
    this.actionEvent.next(action);
  }

  ngAfterViewInit() {
    this.createScrollEventListener()
      .subscribe(scrollOffset => {
        this.currentState = scrollOffset >= 700 ? 'sticking' : 'floating';
      });
  }

  private createScrollEventListener(): Observable<number> {
    return fromEvent(window, 'scroll').pipe( map(() => window.pageYOffset));
  }

  public scrollTop(): void {
    const element = document.querySelector('card-body') || window;
    element.scrollTo(0, 0);
  }

}
