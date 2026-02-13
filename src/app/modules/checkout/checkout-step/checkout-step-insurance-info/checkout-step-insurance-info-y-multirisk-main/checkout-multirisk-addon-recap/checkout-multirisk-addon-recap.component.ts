import { EventEmitter, Component, OnInit, Output, Input, AfterViewInit } from '@angular/core';
import { CheckoutStepInsuranceInfoComponent } from '../../checkout-step-insurance-info.component';
import { ToastrService } from 'ngx-toastr';
import { DataService, InsurancesService } from '@services';
import { CheckoutStepService } from 'app/modules/checkout/services/checkout-step.service';
import { CheckoutStepInsuranceInfoProduct } from '../../checkout-step-insurance-info.model';

@Component({
    selector: 'app-checkout-multirisk-addon-recap',
    templateUrl: './checkout-multirisk-addon-recap.component.html',
    styleUrls: ['./checkout-multirisk-addon-recap.component.scss'],
    standalone: false
})
export class CheckoutMultiriskAddonRecapComponent implements OnInit {

  @Input() recapInfoChange: any;
  @Input() recapPriceChange: any;
  @Input() currentSubstep: string;
  @Input() provinceAbbrSelected: string;
  @Input() lastStepForm: any;
  @Input() product: CheckoutStepInsuranceInfoProduct;
  @Input() addonsSelected: boolean;
  @Output() operation = new EventEmitter<string>();
  public isCollapsed = true;
  public info: any;
  public infoPrice: any;
  public dataLoaded: any;

  constructor(
    private infoComponent: CheckoutStepInsuranceInfoComponent,
    private toastrService: ToastrService,
    private insurancesService: InsurancesService,
    private checkoutStepService: CheckoutStepService,
    public dataService: DataService
    ) {
  }

  ngOnInit() {
    this.recapInfoChange.subscribe(infoChange=> {
      this.info = infoChange;
      if(this.info !== undefined) {
        this.dataService.setParams({ infoRecapLoaded: this.info });
      }
    });

    this.recapPriceChange.subscribe(priceChange=> {
      this.infoPrice = priceChange;
      if(this.infoPrice !== undefined) {
        this.dataService.setParams({ priceRecapLoaded: this.infoPrice });
      }
    });

    this.dataLoaded = this.dataService.getParams();
    if((this.dataLoaded.priceRecapLoaded && this.dataLoaded.infoRecapLoaded) && (this.infoPrice && this.info) === undefined) {
      this.infoPrice = this.dataLoaded.priceRecapLoaded;
      this.info = this.dataLoaded.infoRecapLoaded;
    }

  }

  nextSubStep() {
    this.operation.emit('next');
  }

  nextStep(){
    if(this.lastStepForm.form.valid){
      this.insurancesService.checkZipCode(this.lastStepForm.form.controls.postalCode.value + "", this.lastStepForm.form.controls.searchCity.value.id, true).subscribe(res => {
        if (!res.result) {
          this.toastrService.error('Codice postale non valido!');
          return;
        } else {
          this.checkoutStepService.changeInfoDataBuilding(
                    this.lastStepForm.form.controls.address.value + ', '
                    + this.lastStepForm.form.controls.postalCode.value + ' '
                    + this.lastStepForm.form.controls.searchCity.value.name
                    + ' ' + this.provinceAbbrSelected);

           if(this.product.order.line_items[0].addons.length <= 0) {
              this.dataService.responseOrder.line_items[0].addons.forEach(addon => {
              this.product.order.line_items[0].addons.push(addon);
            });
          }

          this.infoComponent.handleNextStep();
        }
      });
    } else {
      this.toastrService.error('I dati del form sono obbligatori!');
    }
  }
}
