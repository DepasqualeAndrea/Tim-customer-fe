import {ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {CheckoutService, DataService} from '@services';
import {Router} from '@angular/router';
import { NgForm } from '@angular/forms';
import { PreventivatoreAbstractComponent } from '../preventivatore-abstract/preventivatore-abstract.component';
import { fromEvent, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { animate, group, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-quotator-axa-annullamento-viaggio',
  templateUrl: './quotator-axa-annullamento-viaggio.component.html',
  styleUrls: ['./quotator-axa-annullamento-viaggio.component.scss'],
  animations: [
    trigger('changePanelState', [
      state('floating', style({ display: 'none'})),
      state('sticking', style({ margin: '0', position: 'fixed', zIndex: '100', bottom: '0', left: '0', width: '100vw', backgroundColor: '#fff',
      boxShadow: '0 0 8px rgb(0 0 0 / 25%)', maxHeight: '120px', height: '100px', justifyContent: 'flex-end' })),
      transition('*=>floating', [group([animate('0ms 0ms')])]),
      transition('*=>sticking', [group([animate('0ms 0ms')])]),
    ]),
  ]
})
export class QuotatorAxaAnnullamentoViaggioComponent extends PreventivatoreAbstractComponent implements OnInit,OnDestroy {

  @Input() product;
  @Output() actionEvent = new EventEmitter<any>();
  peopleQuantity = 1;
  totalPrice = 0;
  price= 0;
  travelPrice = null;
  showErrorMessagge = false;
  variants = [];
  @ViewChild('annulmentTripForm') private annulmentTripForm: NgForm;
  public currentState: string = 'floating';

  constructor(
    private checkoutService: CheckoutService,
    public dataService: DataService,
    private router: Router,
    ref: ChangeDetectorRef
  ) {
    super(ref);
  }
  ngOnDestroy() {

  }

  ngOnInit() {
    console.log(this.product);
  }

  private createScrollEventListener(): Observable<number> {
    return fromEvent(window, 'scroll').pipe(untilDestroyed(this), map(() => window.pageYOffset));
  }

  ngAfterViewInit() {
    this.createScrollEventListener()
      .subscribe(scrollOffset => {
        this.currentState = scrollOffset >= 700 ? 'sticking' : 'floating';
      });
  }

  addQuantity() {
    if (this.peopleQuantity < this.product.maximum_insurable) {
      this.peopleQuantity++;
    }
  }

  subtractQuantity() {
    if (this.peopleQuantity > 1) {
      this.peopleQuantity--;
    }
  }

  calcTotalPrice() {

    this.totalPrice = this.travelPrice > 2000 ? 0 : this.dataService.calculateFlightPrice(this.travelPrice);
    console.log(this.totalPrice, 'total price');
  }

  createOrderObj(variant) {
    return {
      order: {
        line_items_attributes: {
          0: {
            variant_id: variant,
            quantity: this.peopleQuantity,
            insured_is_contractor: true,
            insurance_info_attributes: {
              price: this.travelPrice
            }
          },
        },
      }
    };
  }

  checkout(annulmentTripForm: NgForm): Promise<any> | void {
    const order = this.createOrderObj(this.product.master_variant);
    this.checkoutService.addToChart(order).subscribe((res) => {
      this.dataService.setResponseOrder(res);
      this.dataService.setProduct(this.product);
      return this.router.navigate(['checkout']);
    });
  }

  scrollTop($event) {
    const element = document.querySelector('container-quotator') || window;
    element.scrollTo(0, 0);
  }

}
