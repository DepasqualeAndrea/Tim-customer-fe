import { ProductAddressStepController } from '../product-address-step-controller.interface';
import { ResponseOrder, RequestOrder, User } from '@model';
import { Injectable } from '@angular/core';
import { CheckoutModule } from '../../checkout.module';
import { DataService, AuthService } from '@services';
import { CostLineGeneratorService } from '../../services/cost-line-generators/cost-line-generator.service';
import { CheckoutStepService } from '../../services/checkout-step.service';
import { CheckoutStepInsuranceInfoHelper } from '../../checkout-step/checkout-step-insurance-info/checkout-step-insurance-info.helper';
import { PriceChangedReason } from '../../checkout-step/checkout-step-insurance-info/price-changed-reason.enum';
import { ReplaySubject, Observable, zip } from 'rxjs';
import { KenticoTranslateService } from '../../../kentico/data-layer/kentico-translate.service';
import { take, map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SportAddressStepController implements ProductAddressStepController {
  constructor(private dataService: DataService,
    private costLineGeneratorService: CostLineGeneratorService,
    private checkoutStepService: CheckoutStepService,
    private authService: AuthService,
    private kenticoTranslateService: KenticoTranslateService
  ) { }
  private addressFieldsToDisable = new ReplaySubject<string[]>(1);
  public addressFieldsToDisable$ = this.addressFieldsToDisable.asObservable();
  userIsInsuredSubject() {
    const responseOrder = this.dataService.getResponseOrder();
    const contractorInInsuredSubjects = this.isUserInInsuredSubjects(this.authService.loggedUser, this.authService.loggedIn, responseOrder);
    if (contractorInInsuredSubjects) {
      const addressFieldsUpdater = ['firstName', 'lastName', 'birthDate'];
      this.addressFieldsToDisable.next(addressFieldsUpdater);
    }
  }

  responseOrderChanged(): void {
    //TODO: extract method to a common method to use in sports components
    this.notifyCurrentPrice();
    this.userIsInsuredSubject();
  }

  private loadCostItemsLabel(): Observable<string[]> {
    const labelCostItemsTranslations = [
      this.kenticoTranslateService.getItem('checkout.unit_cost'),
      this.kenticoTranslateService.getItem('checkout.total_price')
    ];
    return zip(...labelCostItemsTranslations).pipe(take(1)
      , map(policyStatus => policyStatus.map<string>((item: any) => item.value)));
  }

  private notifyCurrentPrice() {
    this.loadCostItemsLabel()
      .subscribe(labelCostItems => {
          const productFromDataService = this.dataService.getResponseProduct();
          const reponseOrder = this.dataService.getResponseOrder();
          const costItems = this.costLineGeneratorService.getCostLineItemGenerator(productFromDataService, reponseOrder).computeCostItems(labelCostItems);
          const total = this.dataService.getResponseOrder().item_total;
          const changeValue = this.getPriceChangedReason(reponseOrder);
          let labelName: string;
          switch (changeValue) {
            case PriceChangedReason.ChangedByAge:
              labelName = 'checkout.recalculated_price_age';
              break;
            case PriceChangedReason.ChangeAgeNotCorresponding:
              labelName = 'checkout.age_not_corresponding';
              break;
            default:
              break;
          }
          if (!!labelName) {
            this.kenticoTranslateService.getItem<any>(labelName).subscribe(translation => {
              this.checkoutStepService.potentialPriceChange({ current: total, previous: total, reason: translation.value, costItems: costItems });
            });
          } else {
            this.checkoutStepService.potentialPriceChange({ current: total, previous: total, reason: '', costItems: costItems });
          }
      });
  }

  private getPriceChangedReason(responseOrder: ResponseOrder): PriceChangedReason {
    const quotationAttributes = this.dataService.getOrderAttributes();
    if (!quotationAttributes) {
      return PriceChangedReason.NotChanged;
    }
    const orderAttributes = responseOrder.data;
    const oaDifference = CheckoutStepInsuranceInfoHelper.diffOrderAttributes(quotationAttributes, orderAttributes);
    const agesChanged = CheckoutStepInsuranceInfoHelper.quantity(oaDifference);
    if (agesChanged !== 0) {
      return PriceChangedReason.ChangedByAge;
    }
    return PriceChangedReason.NotChanged;
  }

  getRequest(requestOrder: RequestOrder): RequestOrder {
    //----TODO: use to know if contractor is insured
    //const responseOrder = this.dataService.getResponseOrder();
    //const contractorInInsuredSubjects = this.isUserInInsuredSubjects(this.authService.loggedUser, this.authService.loggedIn, responseOrder);
    return requestOrder;
  }
  private isUserInInsuredSubjects(user: User, isUserloggedin: boolean, responseOrder: ResponseOrder): boolean {
    if (isUserloggedin) {
      const insuranceSubjects = CheckoutStepInsuranceInfoHelper.fromResponseInsuranceHoldersToCheckoutSubjects(responseOrder.line_items[0].insured_entities.insurance_holders);
      const insuranceSubject = CheckoutStepInsuranceInfoHelper.fromAddressToInsuredSubject(null, user.address);
      return CheckoutStepInsuranceInfoHelper.existsInsuredSubject(insuranceSubject, insuranceSubjects);
    }
    return false;
  }
}
