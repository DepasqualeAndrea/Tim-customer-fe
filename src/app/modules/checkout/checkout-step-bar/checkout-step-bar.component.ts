import {Component, Input, OnInit} from '@angular/core';
import {CheckoutStep, StepProgressBarAuthFalse} from '../checkout-step/checkout-step.model';
import {Observable} from 'rxjs';
import {CheckoutService, DataService} from '@services';
import {KenticoTranslateService} from '../../kentico/data-layer/kentico-translate.service';
import {map, take} from 'rxjs/operators';
import { CheckoutProduct } from '../checkout.model';

@Component({
    selector: 'app-checkout-step-bar',
    templateUrl: './checkout-step-bar.component.html',
    styleUrls: ['./checkout-step-bar.component.scss'],
    standalone: false
})
export class CheckoutStepBarComponent implements OnInit {

  @Input() step: CheckoutStep;
  @Input() allSteps: CheckoutStep[];
  @Input() product: CheckoutProduct;

  stepProgressBarAuthFalse: StepProgressBarAuthFalse;

  private stepNamesMapping: { [key: string]: Observable<string> } = {};
  currentStep: any;
  progressBarTxt: any;
  stepName: any;
  imaginStepName: any[] = [];

  // key is step name from API, value is element codename from Kentico
  private stepKenticoFieldsMapping = {
    'insurance-info': 'insurance_info_step',
    address: 'address_step',
    survey: 'survey_step',
    payment: 'payment_step',
    confirm: 'confirm_step',
    complete: 'complete_step',
  };

  constructor(private kenticoTranslateService: KenticoTranslateService,
              public dataService: DataService,
              private checkoutService: CheckoutService) {
  }

  ngOnInit() {
    for (const step of this.allSteps) {
      const key = step.name;
      const value = this.kenticoTranslateService.getItem<any>(`checkout.${this.stepKenticoFieldsMapping[key]}`).pipe(map<any, string>(item => item.value));
      this.stepNamesMapping[key] = value;
    }
    if ((this.dataService.isTenant('imagin-es-es_db') || this.dataService.isTenant('santa-lucia_db'))&& this.product.code === 'chubb-deporte' || this.product.code === 'chubb-deporte-rec') {
      this.getImaginProgressStepName();
      }
  }

  getImaginProgressStepName(){
    this.kenticoTranslateService.getItem<any>('checkout_sport').pipe(take(1)).subscribe(item => {
      this.imaginStepName.push(
        item.progress_bar_step_address_name.value,
        item.progress_bar_step_survey_name.value
      );
    });
  }

  getStepName(stepName: string): any {
    this.stepProgressBarAuthFalse = this.checkoutService.getStepProgressBarAuthFalse();
    return this.stepNamesMapping[this.stepProgressBarAuthFalse ? this.stepProgressBarAuthFalse.name : stepName];
  }

  getStepNameImagin(stepName: string): any {
    this.stepProgressBarAuthFalse = this.checkoutService.getStepProgressBarAuthFalse();
      switch (stepName) {
        case 'insurance-info': return stepName = 'Información del seguro';
        case 'address': return stepName = this.imaginStepName[0];
        case 'survey': return stepName =  this.imaginStepName[1];
        case 'payment': return stepName =  'Pago';
        default: return this.stepNamesMapping[this.stepProgressBarAuthFalse ? this.stepProgressBarAuthFalse.name : stepName];
      }
  }
}
