
import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NypIadDocumentaryService } from '@NYP/ngx-multitenant-core';
import { AuthService, DataService } from '@services';
import { AdobeAnalyticsDatalayerService } from 'app/core/services/adobe_analytics/adobe-init-datalayer.service';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { IProduct, Packet, RecursivePartial } from 'app/modules/nyp-checkout/models/api.model';
import { NypApiService } from 'app/modules/nyp-checkout/services/api.service';
import { NypDataService } from 'app/modules/nyp-checkout/services/nyp-data.service';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { digitalData } from 'app/core/services/adobe_analytics/adobe-analytics-data.model';
import { TimForSkiApiService } from '../../services/api.service';

@Component({
  selector: 'app-preventivatore',
  templateUrl: './preventivatore.component.html',
  styleUrls: ['./preventivatore.component.scss', '../../../../styles/checkout-forms.scss', '../../../../styles/size.scss', '../../../../styles/colors.scss', '../../../../styles/text.scss', '../../../../styles/common.scss']
})
export class PreventivatoreComponent implements OnInit {
  selectedProduct: RecursivePartial<IProduct>;
  selectedCoverageDuration: string;
  selectedInsuredCount: number = 1;
  selectedDaysCount: number = 1;
  showDaysSection: boolean = true;
  totalPrice: number = 0;
  totalPriceSeasonal: number = 0;
  private documentToDownload: string;

  public isMobile: boolean = window.innerWidth < 768;
  public isTablet: boolean = window.innerWidth < 992;
  @HostListener('window:resize', ['$event'])
  onWindowResize(event): void {
    this.isMobile = event.target.innerWidth < 768;
    this.isTablet = event.target.innerWidth < 992;
  }


  public SkiProducts$ = this.nypDataService.Products$.pipe(
    map(p => p.filter(p => p.code.includes('tim-for-ski'))),
    map(packets => packets.sort((a, b) => {
      const order = ['tim-for-ski-silver', 'tim-for-ski-gold', 'tim-for-ski-platinum'];
      return order.indexOf(a.code) - order.indexOf(b.code);
    }))
  );
  constructor(
    public router: Router,
    public route: ActivatedRoute,
    private apiService: NypApiService,
    private timForSkiApiService: TimForSkiApiService,
    private authService: AuthService,
    private nypDataService: NypDataService,
    private dataService: DataService,
    private nypIadDocumentaryService: NypIadDocumentaryService,
    private adobeAnalyticsDataLayerService: AdobeAnalyticsDatalayerService,
    private kenticoTranslateService: KenticoTranslateService,
  ) { }

  ngOnInit(): void {
    this.kenticoTranslateService.getItem<any>('tim_for_ski').pipe(take(1)).subscribe(item => {
      const productName = item?.system?.name;
      let digitalData: any = window["digitalData"];
      digitalData.page.category.primaryCategory = productName;
      digitalData.cart.item[0].productInfo.productName = productName;
      digitalData.page.pageInfo.pageName = "tim-for-ski preventivatore";
      this.adobeAnalyticsDataLayerService.pushAdobeCustomTags(digitalData);
    });
    this.nypDataService.redirectIfUndefinedProduct();
    this.selectedCoverageDuration = 'Daily';
    this.SkiProducts$.subscribe(products => {
      const bluPackage = products.find(product => product.code === 'tim-for-ski-silver');
      if (bluPackage) {
        this.selectProduct(bluPackage);
        this.calculateTotalPrice();
      }
    });
  }
  selectProduct(product: RecursivePartial<IProduct>): void {
    this.selectedProduct = product;
    this.documentToDownload = product?.informativeSet;
    this.resetCounts();
    this.calculateTotalPrice();
  }
  getPackageColor(product: RecursivePartial<IProduct>): string {
    if (product === this.selectedProduct) {
      switch (product.code) {
        case 'tim-for-ski-silver':
          return '#0164f2';
        case 'tim-for-ski-gold':
          return '#0164f2';
        case 'tim-for-ski-platinum':
          return '#0164f2';
        default:
          return '#8c8a8a';
      }
    } else {
      return '#8c8a8a';
    }
  }
  getProductLabel(code: string): string {
    switch (code) {
      case 'tim-for-ski-silver':
        return 'BLU';
      case 'tim-for-ski-gold':
        return 'ROSSA';
      case 'tim-for-ski-platinum':
        return 'NERA';
      default:
        return '';
    }
  }
  decreaseInsuredCount(): void {
    if (this.selectedInsuredCount > 1) {
      this.selectedInsuredCount--;
      this.calculateTotalPrice();
    }
  }

  increaseInsuredCount(): void {
    if (this.selectedInsuredCount < 5) {
      this.selectedInsuredCount++;
      this.calculateTotalPrice();
    }
  }

  decreaseDaysCount(): void {
    if (this.selectedDaysCount > 1) {
      this.selectedDaysCount--;
      this.calculateTotalPrice();
    }
  }

  increaseDaysCount(): void {
    if (this.selectedDaysCount < 29) {
      this.selectedDaysCount++;
      this.calculateTotalPrice();
    }
  }
  private resetCounts(): void {
    this.selectedDaysCount = 1;
    this.selectedInsuredCount = 1;
    this.calculateTotalPrice();
  }

  selectCoverageDuration(coverageType: string): void {
    this.selectedCoverageDuration = coverageType;
    this.showDaysSection = coverageType === 'Daily';
    this.calculateTotalPrice();
    this.resetCounts();
    if (coverageType === 'Seasonal') {
      this.nypDataService.isSeasonal = true;
    } else {
      this.nypDataService.isSeasonal = false;
    }
  }
  private calculateTotalPrice(): void {

    if (this.selectedProduct) {
      let basePrice = this.selectedCoverageDuration === 'Daily'
        ? (typeof this.selectedProduct.price === 'number' ? this.selectedProduct.price : 0)
        : (this.selectedProduct.packets.find(packet => packet.name.includes('Seasonal'))?.packetPremium || 0);

      const additionalDaysPrice = (this.selectedDaysCount - 1) * basePrice * this.selectedInsuredCount;
      const additionalPersonsPrice = Math.max(0, this.selectedInsuredCount - 1) * basePrice;

      basePrice += additionalDaysPrice + additionalPersonsPrice;

      this.totalPrice = basePrice;
    }
    if (this.selectedProduct) {
      const seasonalPacket = this.selectedProduct.packets.find(packet => packet.name.includes('Seasonal'));
      if (seasonalPacket) {
        const additionalPersonsPriceSeasonal = Math.max(0, this.selectedInsuredCount - 1) * seasonalPacket.packetPremium;
        this.totalPriceSeasonal = seasonalPacket.packetPremium + additionalPersonsPriceSeasonal;
      }
    }
    else {

    }
  }

  next(currentProduct: RecursivePartial<IProduct>): void {
    const selectedPacketId = this.getSelectedPacketId(currentProduct);
    this.dataService.daysNumber = this.selectedDaysCount;
    this.dataService.quantity = this.selectedInsuredCount;
    this.dataService.isSeasonal = this.selectedCoverageDuration === 'Seasonal' ? true : false;
    this.dataService.totalPriceSeasonal = this.totalPriceSeasonal;
    this.apiService.postOrder({
      customerId: this.authService.loggedUser?.id,
      packetId: selectedPacketId,
      productId: currentProduct?.id,
      daysNumber: this.selectedDaysCount,
      quantity: this.selectedInsuredCount,
      isSeasonal: this.selectedCoverageDuration === 'Seasonal' ? true : false,
      totalPriceSeasonal: this.totalPriceSeasonal,
    })
      .pipe(tap(response => localStorage.setItem('product_code', response?.packet?.data?.product?.code)),
      switchMap(() => this.timForSkiApiService.getOrder(this.nypDataService.OrderCode)))
      .subscribe(() => {
        this.kenticoTranslateService.getItem<any>('tim_for_ski').pipe(take(1)).subscribe(item => {
          let digitalData: digitalData = window['digitalData'];
          digitalData.cart.form.button_name = this.nypDataService.CurrentState$.value + '_' + document.getElementById('continue').textContent.toLowerCase().replace(/\s/g, '');
          const stepName = item?.insurance_info_title_sci?.value;
          digitalData.page.pageInfo.pageName = stepName;
          this.adobeAnalyticsDataLayerService.adobeTrackClick();
          this.adobeAnalyticsDataLayerService.pushAdobeCustomTags(digitalData);
        });
        this.router.navigate(['/nyp-checkout', currentProduct.code])
      });
  }

  downloadProductDocuments() {
    this.nypIadDocumentaryService.downloadFileFromUrl({ filename: this.documentToDownload?.split('/')?.pop(), remoteUrl: this.documentToDownload })
      .pipe(
        map(r => ({ content: r, filename: this.documentToDownload?.split('/')?.pop(), }))
      )
      .subscribe(b => saveAs(b.content, b.filename));
  }

  private getSelectedPacketId(currentProduct: RecursivePartial<IProduct>): number {
    if (this.selectedCoverageDuration === 'Seasonal') {
      const seasonalPacketsSku = [
        'tim-for-ski-silver-season', 
        'tim-for-ski-gold-season', 
        'tim-for-ski-platinum-season'
      ];
      return currentProduct?.packets?.find(p => seasonalPacketsSku.includes(p.sku))?.id;
    } else {
      const dailyPacketsSku = [
        'tim-for-ski-silver-day',
        'tim-for-ski-gold-day',
        'tim-for-ski-platinum-day'
      ];
      return currentProduct?.packets?.find(p => dailyPacketsSku.includes(p.sku))?.id;
    }
  }
}
