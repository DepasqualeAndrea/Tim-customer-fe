import { Component, Input, OnInit } from '@angular/core';
import { PreventivatoreComponent } from '../preventivatore/preventivatore.component';

@Component({
  selector: 'app-quotator-simple',
  templateUrl: './quotator-simple.component.html',
  styleUrls: ['../preventivatoreY.component.scss']
})
export class QuotatorSimpleComponent extends PreventivatoreComponent implements OnInit {

  @Input() product;
  mounthly: string;


  ngOnInit() {
    if (this.product.payment_methods[0].type === 'Spree::Gateway::BraintreeRecurrent') {
      this.kenticoTranslateService.getItem<any>('quotator.month').pipe().subscribe(item => {
        return this.mounthly = item.value;
    });
    }
  }

  createOrderObj(variant) {
    return {
      order: {
        line_items_attributes: {
          0: {
            variant_id: variant,
            quantity: 1
          },
        },
      }
    };
  }

  checkout() {
    const order = this.createOrderObj(this.product.master_variant);
    this.checkoutService.addToChart(order).subscribe((res) => {
      this.dataService.setResponseOrder(res);
      this.dataService.setProduct(this.product);
      return this.router.navigate(['apertura']);
    });
  }
}

