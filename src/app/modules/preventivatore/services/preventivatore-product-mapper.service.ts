import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import {ComponentFactory, ComponentFactoryResolver, Injectable, Type} from '@angular/core';
import {PreventivatoreModule} from '../preventivatore.module';
import {Observable} from 'rxjs';
import {PreventivatorePage} from './preventivatore-page.interface';
import {PreventivatoreComponent} from '../preventivatore/preventivatore.component';

class ProductPattern {
  codePattern: RegExp;
  component: Type<PreventivatorePage>;

  constructor(codePattern: RegExp, component: Type<PreventivatorePage>) {
    this.codePattern = codePattern;
    this.component = component;
  }
}

@Injectable({
  providedIn: 'root'
})
export class PreventivatoreProductMapperService {
  private products: ProductPattern[] = [];
  private defaultPreventivatore: Type<PreventivatorePage> = PreventivatoreComponent;


  constructor(private resolver: ComponentFactoryResolver) {

  }


  register(productCodePattern: RegExp, preventivatore: Type<PreventivatorePage>) {
    const index: number = this.products.findIndex(p => p.codePattern === productCodePattern);
    const pattern: ProductPattern = new ProductPattern(productCodePattern, preventivatore);
    if(index < 0) {
      this.products.push(pattern);
    } else {
      this.products.splice(index, 1, pattern);
    }
  }

  getPreventivatoreFactory(productCode: string): ComponentFactory<PreventivatorePage> {
    let preventivatore: Type<PreventivatorePage> = null;
    this.products.forEach(pattern => {
      if(!preventivatore) {
        if(pattern.codePattern.test(productCode)) {
          preventivatore = pattern.component;
        }
      }
    });

    if(!preventivatore) {
      preventivatore = this.defaultPreventivatore;
    }

    return this.resolver.resolveComponentFactory<PreventivatorePage>(preventivatore);
  }

}
