import {LineFirstItem, ResponseOrder, Variant} from '@model';
import {CheckoutProductCostItem, CheckoutProductCostItemType} from '../../checkout.model';
import {CostLineGenerator} from './cost-line-generator';

export class DetailedShoppingCartGenerator implements CostLineGenerator {
    private yearlySku = ['TUTLEG12_', 'pmi-pndmc'];
    constructor(private responseOrder: ResponseOrder) {

    }
    public computeCostItems(labelCostItems: any): CheckoutProductCostItem[] {
        const costLabels = labelCostItems;
        return this.getCostLineItemsFromAddOns(this.responseOrder, costLabels);
    }
    private getCostLineItemsFromAddOns(responseOrder: ResponseOrder, costLabels: any): CheckoutProductCostItem[] {
        const period_time = this.getPeriodTime(costLabels, responseOrder);
        const lineItem: LineFirstItem = responseOrder.line_items['0'];
        const variant: Variant = <Variant>responseOrder.line_items['0'].variant;
        const productName = this.getProductName(variant);
        const addons = this.getProductCostItemFromProductAddons(responseOrder.line_items['0'].addons, responseOrder, variant);
        const isYearly = this.isYearlyPayment(variant);
        const variantCalculatePrice = this.getBasePrice(responseOrder, variant);
        const productTotal = this.getProductTotal(costLabels, responseOrder, variant);
        const items = [];
        items.push(period_time);
        items.push({ name: productName, amount: variantCalculatePrice, multiplicator: 1, type: CheckoutProductCostItemType.regular });
        items.push(...addons);
        if (!isYearly) {
            productTotal.type = CheckoutProductCostItemType.propertyValue;
            items.push(productTotal);
            const isMonthlyItem: CheckoutProductCostItem = {name: '', amount: undefined, type: CheckoutProductCostItemType.monthlyPayment};
            items.push(isMonthlyItem);
            const monthlyRate = this.getMonthlyRate(costLabels, responseOrder);
            items.push(monthlyRate);

        } else {
          const inYearlyItem: CheckoutProductCostItem = {name: '', amount: undefined, type: CheckoutProductCostItemType.yearlyPayment};
          items.push(inYearlyItem);
          items.push(productTotal);
        }
        return items;
    }
    private isYearlyPayment(variant: any): boolean {
        return !!variant.sku && this.yearlySku.some(sku => variant.sku.startsWith(sku));
    }
    private getProductName(variant: Variant) {
        if (variant.name.startsWith('legal_protection')) {
            return 'Tutela legale';
        }
        if (variant.sku.startsWith('pmi-pndmc')) {
            return 'Protezione Pandemia';
        }
        return '';
    }
    private getPeriodTime(costLabels: any, responseOrder: ResponseOrder): CheckoutProductCostItem {
        const period_time: CheckoutProductCostItem = {
            name: costLabels[0],
            amount: 0,
            type: CheckoutProductCostItemType.propertyValue,
            value: costLabels[3]
        };
        return period_time;
    }

    private getProductCostItemFromProductAddons(addons: any, responseOrder: ResponseOrder, variant: Variant): CheckoutProductCostItem[] {
        if (variant.name.startsWith('legal_protection')) {
            return this.getProductCostItemFromProductAddonsData(addons, responseOrder);
        }
        return this.getProductCostItemFromProductAddonsList(addons, responseOrder);
    }

    private getProductCostItemFromProductAddonsList(addons: any, responseOrder: ResponseOrder): CheckoutProductCostItem[] {
        const lineItem: LineFirstItem = responseOrder.line_items['0'];
        const multiplicator = lineItem.quantity;

        const addonCostItems = [];
        addons.forEach(addon => {
            let price = 0;
            if (multiplicator > 1) {
                price = addon.price * multiplicator;
            } else {
                price = addon.price;
            }
            addonCostItems.push({ name: addon.name, amount: price, type: CheckoutProductCostItemType.regular });
        });
        return addonCostItems;
    }

    private getProductCostItemFromProductAddonsData(addons: any, responseOrder: ResponseOrder): CheckoutProductCostItem[] {
        const addonCostItems = [];
        const annual_premiums = responseOrder.data.annual_premiums;
        addons.forEach(addon => {
            const addonPrice = annual_premiums.addons[addon.code.toLowerCase()];
            addonCostItems.push({ name: addon.name, amount: addonPrice, type: CheckoutProductCostItemType.regular });
        });
        return addonCostItems;
    }
    private getMonthlyRate(costLabels: any, responseOrder: ResponseOrder) {
        return { name: costLabels[2], amount: responseOrder.item_total, type: CheckoutProductCostItemType.total };
    }
    private getProductTotalFromDataNode(costLabels: any, responseOrder: ResponseOrder) {
        const annual_premium = responseOrder.data.annual_premiums.total;
        return { name: costLabels[1], amount: annual_premium, type: CheckoutProductCostItemType.total, value: null };
    }
    private getProductTotalFromVariant(costLabels: any, responseOrder: ResponseOrder) {
        return { name: costLabels[1], amount: responseOrder.item_total, type: CheckoutProductCostItemType.total, value: null };
    }
    private getProductTotal(costLabels: any, responseOrder: ResponseOrder, variant: Variant) {
        if (variant.name.startsWith('legal_protection')) {
            return this.getProductTotalFromDataNode(costLabels, responseOrder);
        }
        return this.getProductTotalFromVariant(costLabels, responseOrder);
    }

    private getBasePrice(responseOrder: ResponseOrder, variant: Variant): number {
        if (variant.name.startsWith('legal_protection')) {
            return this.getBasePriceFromData(responseOrder);
        }
        return this.getBasePriceFromVariant(variant, responseOrder);
    }
    private getBasePriceFromVariant(variant: Variant, responseOrder: ResponseOrder): number {
        const lineItem: LineFirstItem = responseOrder.line_items['0'];
        const multiplicator = lineItem.quantity;
        if (multiplicator > 1) {
            return variant.price * multiplicator;
        }
        return variant.price;
    }
    private getBasePriceFromData(responseOrder: ResponseOrder): number {
        return responseOrder.data.annual_premiums.base;
    }
}
