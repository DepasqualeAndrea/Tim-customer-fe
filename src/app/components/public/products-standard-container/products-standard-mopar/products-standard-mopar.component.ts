import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { take } from 'rxjs/operators';


@Component({
  selector: 'app-products-standard-mopar',
  templateUrl: './products-standard-mopar.component.html',
  styleUrls: ['./products-standard-mopar.component.scss']
})
export class ProductsStandardMoparComponent implements OnInit {
  
    kenticoProductList = [];
    
    constructor(
      private kenticoTranslateService: KenticoTranslateService,
      private router: Router,
    ) { }
  
    ngOnInit() {
      this.loadContent();
    }
  
    loadContent() {
      this.kenticoTranslateService.getItem<any>('products_standard_page').pipe(take(1)).subscribe( 
        item => {
          this.createProductListToRender(item.product_list.value);
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
          size: product.size.value,
          active: !!product.active.value.length,
        })
      )
    }
    
    goToPreventivatore(code:string): void {
      this.router.navigate(['preventivatore', {code}])
    }

}
