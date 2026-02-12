import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { CheckoutIntesaPetContent } from './checkout-intesa-pet-content.model';
import { CheckoutContentProvider } from './checkout-content-provider.interface';
import { Injectable } from '@angular/core';
import { CheckoutModule } from 'app/modules/checkout/checkout.module';
 
@Injectable(
    {
        providedIn: 'root'
    }
)
export class CheckoutIntesaPetContentService
    implements CheckoutContentProvider {
    // private productCodes = ['net-pet-silver', 'net-pet-gold'];
    getContent(): Observable<CheckoutIntesaPetContent> {
        const mockItem = {
            header: 'prodotto',
            cost_item: {
                validation_title: 'Validità polizza',
                renovation_type: 'Rinonovo Mensile',
                cost_detail_title: 'Copertura',
                cost_detail_list: ['Spese per il ritrovamento dell’animale domestico',
                  'Responsabilità Civile per danni arrecati a terzi', 'Tutela Legale', 'Spese di sepoltura']
              },
        };
        return of(mockItem).pipe(delay(500));
    }
    // canGetContentForProduct(code: string): boolean {
    //     return this.productCodes.some(item => item === code);
    //     // const containsPetSilver = code.some(x => x === this.productCodes[0]);
    //     // const containsPetGold = code.some(x => x === this.productCodes[1]);
    //     // return containsPetSilver && containsPetGold;
    // }
}