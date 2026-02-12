import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CheckoutService, DataService, InsurancesService, TokenTimEmployeesService } from '@services';
import { PreventivatoreDynamicService } from './services/preventivatore-dynamic.service';
import { PreventivatoreProviderService } from './services/preventivatore-provider.service';
import { PreventivatoreReducerProvider } from './state/preventivatore-reducer-provider';
import { PreventivatoreAbstractDynamicComponent } from './preventivatore-dynamic-abstract';

@Component({
    selector: 'app-preventivatore-dynamic',
    templateUrl: './preventivatore-dynamic.component.html',
    styleUrls: ['./preventivatore-dynamic.component.scss']
})
export class PreventivatoreDynamicWithTokenComponent extends PreventivatoreAbstractDynamicComponent {

    constructor(
        service: PreventivatoreProviderService,
        router: Router,
        dataService: DataService,
        checkoutService: CheckoutService,
        preventivatoreReducerProvider: PreventivatoreReducerProvider,
    ) {
        super(service, router, dataService, checkoutService, preventivatoreReducerProvider)
    }

    initializePreventivatore() {
        this.preventivatoreDynamicService = new PreventivatoreDynamicService(this.preventivatoreReducerProvider, this.productCodes);
        this.loadContent();
    }

    loadContent() {
        this.dataService.setProductsFromInsuranceServices(this.products);
        this.getContent(this.productCodes);
    }


}