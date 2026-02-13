import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CheckoutService, DataService } from '@services';
import {UntypedFormGroup, UntypedFormBuilder, Validators} from '@angular/forms';
import * as _ from 'lodash';
import { RequestOrder } from '@model';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
    selector: 'app-quotator-screen-protection',
    templateUrl: './quotator-screen-protection.component.html',
    styleUrls: ['./quotator-screen-protection.component.scss'],
    standalone: false
})
export class QuotatorScreenProtectionComponent implements OnInit {

  @Input() product;
  @Output() actionEvent = new EventEmitter<any>();

  form: UntypedFormGroup;
  imeiError: string;

  constructor(
    public router: Router,
    public dataService: DataService,
    private checkoutService: CheckoutService,
    private formBuilder: UntypedFormBuilder,
  ) {}

  ngOnInit() {
    this.createForm();
  }

  private createForm(): void {
    this.form = this.formBuilder.group({
      imeiCode: [null, [Validators.required, Validators.minLength(15)]]
    })
  }

  public createOrder(): void {
    const orderRequest = this.getOrderRequest();
    this.checkoutService.addToChart(orderRequest).pipe(
      catchError( err => {
        this.imeiError = this.form.value.imeiCode;
        return throwError(new Error(err))
      })
    ).subscribe(res => {
      this.dataService.setRequestOrder(orderRequest);
      this.dataService.setResponseOrder(res);
      this.dataService.setProduct(this.product);
      return this.router.navigate(['checkout']);
    })
  }

  private getOrderRequest(): RequestOrder{
    const line_items_attributes = {
      0: {
        variant_id: this.product.master_variant,
        insurance_info_attributes: {
          covercare_imei: this.form.value.imeiCode
        }
      }
    };
    return {
      order: {line_items_attributes}
    };
  }

}
