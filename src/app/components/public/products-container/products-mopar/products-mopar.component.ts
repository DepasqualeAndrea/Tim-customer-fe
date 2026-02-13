import { Component, OnInit } from '@angular/core';
import { DataService, DiscountCodeService } from '@services';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { take } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { DiscountCodeAuthorizationResult } from 'app/core/services/discount-code-authorization-result.enum';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-products-mopar',
    templateUrl: '../products-component/products-page.component.html',
    styleUrls: ['../products-component/products-page.component.scss'],
    standalone: false
})
export class ProductsMoparComponent implements OnInit {

  kenticoProductList = [];
  warningMessage: string;
  nonAuthorizedCode: boolean;

  constructor(
    private kenticoTranslateService: KenticoTranslateService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private discountToken: DiscountCodeService,
    public dataService: DataService,
  ) { }

  ngOnInit() {
    this.getAndCheckCouponCode();
  }

  private getAndCheckCouponCode() {
    this.checkCouponCodeIsValid(this.activatedRoute)
      .pipe(take(1))
      .subscribe(result => {
        if (result === DiscountCodeAuthorizationResult.AuthorizedCouponCodeSupplied) {          
          this.loadContentWhenAuthorized();
          return;
        }
        if (result === DiscountCodeAuthorizationResult.UnAuthorizedCodeConsumed) {
          this.loadContentWhenAuthorized();
          this.nonAuthorizedCode = true;
          return;
        }
        this.redirectToPrivateArea();
      }, error => this.redirectToPrivateArea());
  }
  
  private redirectToPrivateArea() {
    this.router.navigate(['/private-area/home']);
  }
  private checkCouponCodeIsValid(route: ActivatedRoute): Observable<DiscountCodeAuthorizationResult> {
    const couponCode = this.getCouponCodeParameter(route);
    return this.discountToken.getCouponAuthorizationResult(couponCode);
  }
  private getCouponCodeParameter(route: ActivatedRoute) {
    const couponCode = route.snapshot.queryParams['coupon'];
    if (couponCode) {
      try {
        return atob(couponCode);
      } catch (error) {
        return couponCode;
      }
    }
  }
  
  
  loadContentWhenAuthorized() {
    this.kenticoTranslateService.getItem<any>('products_page').pipe(take(1)).subscribe( 
      item => {
        this.createProductListToRender(item.list_products.value);
        this.warningMessage = item.warning_message.value;
      })
  }
  
  createProductListToRender(kenticoProductsData){
    kenticoProductsData.map( product =>
      this.kenticoProductList.push({
        code: product.code.value,
        name: product.nome.value,
        img: product.immagine.value[0].url,
        description: product.descrizione.value,
        cta: product.cta.value,
        size: product.size.value 
      })
    )    
  }
  
  public goToPreventivatore(code:string): void {
    this.router.navigate(['preventivatore', {code}])
  }

}
