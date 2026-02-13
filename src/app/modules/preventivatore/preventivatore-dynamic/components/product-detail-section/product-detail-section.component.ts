import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RouterService } from 'app/core/services/router.service';
import { ContainerComponent } from 'app/modules/tenants/component-loader/containers/container.component';
import { FTTH_QUERY_PARAM } from 'app/shared/shared-queryparam-keys';
import { PreventivatoreAbstractComponent } from '../preventivatore-abstract/preventivatore-abstract.component';
import { digitalData } from 'app/core/services/adobe_analytics/adobe-analytics-data.model';
import { AdobeAnalyticsDatalayerService } from 'app/core/services/adobe_analytics/adobe-init-datalayer.service';

@Component({
    selector: 'app-product-detail-section',
    templateUrl: './product-detail-section.component.html',
    styleUrls: ['./product-detail-section.component.scss'],
    standalone: false
})
export class ProductDetailSectionComponent extends PreventivatoreAbstractComponent implements OnInit{

  get productCode(): string {
    return this.data[0].product_code;
  }

  constructor(
    private ngbModal: NgbModal,
    public routerService: RouterService,
    ref: ChangeDetectorRef,
    private route: ActivatedRoute,
    private adobeAnalyticsDataLayerService: AdobeAnalyticsDatalayerService
  ) {
    super(ref)
  }

  hasQueryParam() : boolean{
    const queryParamMap = this.route.snapshot.queryParamMap;
    return queryParamMap.has(FTTH_QUERY_PARAM)
  }

  isProductCode(productCode: string): boolean {
    return this.productCode === productCode;
  }

  showDetailLink(link) {
    return link !== "<p><br></p>";
  }

  openInfoModal(modal) {
    const infoModal = this.ngbModal.open(ContainerComponent, {centered: true, size: 'lg'})
    infoModal.componentInstance.type = 'ProductDetailInfoModal'
    infoModal.componentInstance.componentInputData = {
      content: modal
    }
  }

  isLinkInternal(link: string): boolean {
    return link.startsWith('/')
  }

  goToLink(link) {
    this.isLinkInternal(link) ? this.routerService.navigate(link) : window.open(link, "_blank");
  }

  createOrderObj() {
    return {
      order: {
        line_items_attributes: {
          0: {
            variant_id: this.data[0].master_variant,
            quantity: 1,
          },
        },
      }
    };
  }

  checkout() {
    if (this.isProductCode('tim-my-home') || this.isProductCode('customers-tim-pet') || this.isProductCode('ehealth-quixa-homage') || this.isProductCode('ehealth-quixa-standard')
      || this.isProductCode('tim-my-sci')) {
      const form: any = {
        paymentmethod: '',
        mypet_pet_type: '',
        codice_sconto: 'no',
        sci_numassicurati: 0,
        sci_min14: 0,
        sci_polizza: '',
      }
      let digitalData: digitalData = this.adobeAnalyticsDataLayerService.setDigitalData(this.data[0], 1, '', {}, form, 'tim broker', '');
      this.adobeAnalyticsDataLayerService.pushAdobeCustomTags(digitalData);  
    }
    
    const order = this.createOrderObj();
    this.sendCheckoutAction(order);
  }

  sendCheckoutAction(order: any) {
    const action = {
      action: 'checkout_product'
      , payload: {
        product: this.data[0]
        , order: order
        , router: 'checkout'
      }
    };
    this.sendActionEvent(action);
  }

  ngOnInit(): void {
    console.log('product-code', this.data[0].product_code);
  }

}
