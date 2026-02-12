import { LineFirstItem, Variant } from '@model';
import { CheckoutProductCostItem, CheckoutProductCostItemType } from '../../checkout.model';
import { CostLineGenerator } from './cost-line-generator';

export class BasicCostLinesGenerator implements CostLineGenerator {
    constructor(private product: any, private responseOrder: { line_items?: LineFirstItem[], item_total?: number }) {

    }
    public computeCostItems(labelCostItems: any): CheckoutProductCostItem[] {
        const costLabels = labelCostItems;
        if (this.includeAddOnCostItemLine(this.product)) {
            return this.getCostLineItemsFromAddOns(this.responseOrder, costLabels, this.product);
        }
        return this.getCostLineItems(this.responseOrder, costLabels);
    }
    private includeAddOnCostItemLine(product: any): boolean {
        return !!product && !!product.product_structure.template_properties
            && !!product.product_structure.template_properties.show_addons_in_shopping_cart;
    }
    private getCostLineItemsFromAddOns(order: { line_items?: LineFirstItem[], item_total?: number }, costLabels: any, product: any) {
        const lineItem: LineFirstItem = order.line_items['0'];
        const variant: Variant = <Variant>order.line_items['0'].variant;
        const addons = this.getProductCostItemFromProductAddons(order.line_items['0'].addons);
        const addonsTotal = this.getAddOnsTotal(order.line_items['0'].addons);
        const total = lineItem.total;
        const variantCalculatePrice = total - addonsTotal;
        const variantPrice = this.getVariantPriceBasedOnProductCode(product, variantCalculatePrice, variant.price);
        const variantLabel = this.getVariantPriceLabelBasedOnProductCode(product, costLabels);
        const multiplicator = this.getMultiplicatorLabelBasedOnProductCode(product, lineItem.quantity);
        return [
            { name: variantLabel, amount: variantPrice, multiplicator: multiplicator, type: CheckoutProductCostItemType.regular },
            ...addons,
            { name: costLabels[1], amount: order.item_total, type: CheckoutProductCostItemType.total }
        ].filter(a => a);
    }
    private getProductCostItemFromProductAddons(addons: any): CheckoutProductCostItem[] {
        const addonCostItems = [];
        addons.forEach(addon => {
            addonCostItems.push({ name: addon.name, amount: addon.price, type: CheckoutProductCostItemType.regular });
        });
        return addonCostItems;
    }
    private getAddOnsTotal(addons: any): number {
        let addOnsTotal = 0;
        addons.forEach(addon => {
            addOnsTotal = addOnsTotal + (addon.price || parseInt(addon.price));
        });
        return addOnsTotal;
    }
    private getCostLineItems(order: { line_items?: LineFirstItem[], item_total?: number }, costLabels: any) {
        const lineItem: LineFirstItem = order.line_items['0'];
        const variant: Variant = <Variant>order.line_items['0'].variant;
        const addons = [];
        return [
            { name: costLabels[0], amount: variant.price, multiplicator: lineItem.quantity, type: CheckoutProductCostItemType.regular },
            ...addons,
            { name: costLabels[1], amount: order.item_total, type: CheckoutProductCostItemType.total }
        ].filter(a => a);
    }
    private getVariantPriceBasedOnProductCode(product: any, variantCalculatedPrice: number, variantPrice: number) {
        if (product.product_code === 'chubb-deporte' || product.product_code === 'chubb-deporte-rec') {
            return variantCalculatedPrice;
        } if (product.product_code === 'chubb-sport' || product.product_code === 'chubb-sport-rec') {
            return variantCalculatedPrice;
        }
        return variantPrice !== 0 ? variantPrice : variantCalculatedPrice;
    }
    private getVariantPriceLabelBasedOnProductCode(product: any, costLabels: any): string {
        if (product.product_code === 'chubb-deporte' || product.product_code === 'chubb-deporte-rec') {
            return product.name;
        } if (product.product_code === 'chubb-sport' || product.product_code === 'chubb-sport-rec') {
            return 'Costo Unitario  ';
        }
        return costLabels[0];
    }
    private getMultiplicatorLabelBasedOnProductCode(product: any, multiplicator: number): number {
        if (product.product_code === 'chubb-deporte' || product.product_code === 'chubb-deporte-rec') {
            return 1;
        } if (product.product_code === 'chubb-sport' || product.product_code === 'chubb-sport-rec') {
            return 1;
        }
        if (product.product_code === 'axa-annullament')
        {
            return 1;
        }
        return multiplicator;
    }

}
