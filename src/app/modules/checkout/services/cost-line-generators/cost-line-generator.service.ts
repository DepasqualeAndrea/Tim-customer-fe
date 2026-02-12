import { ResponseOrder, Variant } from '@model';
import { CostLineGenerator } from './cost-line-generator';
import { DetailedShoppingCartGenerator } from './detailed-cost-line-generator';
import { BasicCostLinesGenerator } from './basic-cost-line-generator';
import { Injectable } from '@angular/core';
import { CheckoutModule } from '../../checkout.module';
import { KenticoTranslateService } from '../../../kentico/data-layer/kentico-translate.service';
import { Observable, zip } from 'rxjs';
import { take } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class CostLineGeneratorService {
    constructor(private kenticoTranslateService: KenticoTranslateService) {
    }
    getCostItemLabels(responseOrder: ResponseOrder): Observable<any> {
        if (responseOrder.line_items && responseOrder.line_items.length > 0) {
            const variant: Variant = <Variant>responseOrder.line_items['0'].variant;
            if (!!variant && variant.name.startsWith('legal_protection')) {
                return this.getDetailedCostItemLabels();
            }
            if (!!variant && variant.sku.startsWith('pmi-pndmc')) {
                return this.getDetailedCostItemLabels();
            }
        }
        return this.getBasicCostItemLabels();
    }
    getBasicCostItemLabels() {
        const labelCostItemsTranslations = [
            this.kenticoTranslateService.getItem('checkout.unit_cost.value'),
            this.kenticoTranslateService.getItem('checkout.total_price.value')
        ];
        return zip(...labelCostItemsTranslations).pipe(take(1));
    }
    getDetailedCostItemLabels() {
        const labelCostItemsTranslations = [
            this.kenticoTranslateService.getItem('checkout.period_time.value'),
            this.kenticoTranslateService.getItem('checkout.product_total.value'),
            this.kenticoTranslateService.getItem('checkout.monthly_payment.value'),
            this.kenticoTranslateService.getItem('checkout.annual_period.value')
        ];
        return zip(...labelCostItemsTranslations).pipe(take(1));
    }

    getCostLineItemGenerator(
        product: any,
        responseOrder: ResponseOrder): CostLineGenerator {
        if (responseOrder.line_items && responseOrder.line_items.length > 0) {
            const variant: Variant = <Variant>responseOrder.line_items['0'].variant;
            if (!!variant && variant.name.startsWith('legal_protection')) {
                return new DetailedShoppingCartGenerator(responseOrder);
            }
            if (!!variant && variant.sku.startsWith('pmi-pndmc')) {
                return new DetailedShoppingCartGenerator(responseOrder);
            }
        }
        return new BasicCostLinesGenerator(product, responseOrder);
    }
}
