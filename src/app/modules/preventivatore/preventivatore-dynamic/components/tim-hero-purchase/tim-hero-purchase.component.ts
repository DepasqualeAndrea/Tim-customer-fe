import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@services';
import { UserTypes } from 'app/components/public/products-container/products-tim-employees/user-types.enum';
import { digitalData } from 'app/core/services/adobe_analytics/adobe-analytics-data.model';
import { AdobeAnalyticsDatalayerService } from 'app/core/services/adobe_analytics/adobe-init-datalayer.service';
import { ComponentFeaturesService } from 'app/core/services/componentFeatures.service';
import { PreventivatoreAbstractComponent } from '../preventivatore-abstract/preventivatore-abstract.component';

@Component({
    selector: 'app-tim-hero-purchase',
    templateUrl: './tim-hero-purchase.component.html',
    styleUrls: ['./tim-hero-purchase.component.scss'],
    standalone: false
})
export class TimHeroPurchaseComponent extends PreventivatoreAbstractComponent implements OnInit {

  constructor(
    ref: ChangeDetectorRef,
    private router: Router,
    private componentFeaturesService: ComponentFeaturesService,
    private authService: AuthService,
    private adobeAnalyticsDataLayerService: AdobeAnalyticsDatalayerService
  ) {
    super(ref)
  }
  ngOnInit() {
    this.redirectIfUnaccessible()
  }

  private redirectIfUnaccessible() {
    const unaccessibleProducts = this.getRetireeUnaccessibleProducts()
    const userData = this.authService.loggedUser.data
    const isUserRetiree = !!userData.user_type && userData.user_type === UserTypes.RETIREE
    if (isUserRetiree && unaccessibleProducts) {
      let redirectToProducstPage = false
      unaccessibleProducts.forEach(unaccessibleProduct => {
        redirectToProducstPage = this.data.products.map(
          product => product.product_code
        ).some(productCode =>
          productCode === unaccessibleProduct
        )
      })
      if (redirectToProducstPage) {
        this.router.navigate(['products']) 
      }
    }
  }

  private getRetireeUnaccessibleProducts() {
    this.componentFeaturesService.useComponent('products-overview')
    this.componentFeaturesService.useRule('unaccessible-retiree-products')
    const isRuleEnabled = this.componentFeaturesService.isRuleEnabled()
    if (isRuleEnabled) {
      const unaccessibleProducts = this.componentFeaturesService.getConstraints().get('product-codes');
      return unaccessibleProducts
    }
    return false
  }
  emitActionEvent(action: any) {
    const form: any = {
      paymentmethod: '',
      mypet_pet_type: '',
      codice_sconto: 'no',
      sci_numassicurati: 0,
      sci_min14: 0,
      sci_polizza: '',
    }
    let digitalData: digitalData = this.adobeAnalyticsDataLayerService.setDigitalData(this.data.products[0], 1, "", {}, form, 'tim broker', '');
    this.adobeAnalyticsDataLayerService.pushAdobeCustomTags(digitalData);
    
    this.actionEvent.next(action);
  }

}
