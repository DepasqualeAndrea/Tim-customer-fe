import { ResponseOrder, Variant } from '@model';
import { CostLineGenerator } from './cost-line-generator';
import { DetailedShoppingCartGenerator } from './detailed-cost-line-generator';
import { BasicCostLinesGenerator } from './basic-cost-line-generator';

export const costLineItemGeneratorFactory = function (
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
