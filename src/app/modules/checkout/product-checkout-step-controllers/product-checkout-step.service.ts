import { Injectable, Injector } from '@angular/core';
import { ProductCheckoutController } from './product-checkout-controller.interface';
import { CheckoutModule } from '../checkout.module';
import { SportsController } from './sports/sports-controller';
import { DataService } from '@services';
import { ProductBaseController } from './base-controller/product-base-controller';
import { IntesaPetController } from './intesa-pet/intesa-pet-controller';
import { CseSerenetaController } from './cse-sereneta/cse-sereneta-controller';
import { PaiController } from './pai/pai-controller';
import { FreeTiresController } from './fca-mopar-tires-free/free-tires-controller';
import { CovidController } from './fca-mopar-covid-free/covid-controller';
import { EhealthController } from './tim-customers/ehealth-controller';
import { MyPetController } from './tim-employees/mypet-controller';
import { GeGenericController } from './ge-generic-controller/ge-generic-controller';
import { TimMotorController } from './tim-employees/tim-motor-controller';
import { ScreenProtectionController } from './screen-protection/screen-protection-controller';
import { AxaViaggioController } from './axa-viaggio/axa-viaggio-controller';
import { TimMyHomeController } from './tim-customers/tim-my-home-controller';

@Injectable({
    providedIn: 'root',
})
export class ProductCheckoutStepService {
    private productCheckoutStepControllerType = {
        chubbdeporte: SportsController,
        chubbdeporterec: SportsController,
        chubbsport: SportsController,
        chubbsportrec: SportsController,
        gebikepremium: GeGenericController,
        gebikeplus: GeGenericController,
        gesportpremium: GeGenericController,
        gesportplus: GeGenericController,
        geskiplus: GeGenericController,
        geskipremium: GeGenericController,
        geskiseasonalplus: GeGenericController,
        geskiseasonalpremium: GeGenericController,
        getravelplus: GeGenericController,
        getravelpremium: GeGenericController,
        gemotorplus: GeGenericController,
        gemotorpremium: GeGenericController,
        netpetgold: IntesaPetController,
        netpetsilver: IntesaPetController,
        sarasereneta: CseSerenetaController,
        paipersonalaccidentextra: PaiController,
        paipersonalaccident: PaiController,
        rbmpandemic: ProductBaseController,
        coveatirescoveredhomage: FreeTiresController,
        nobiscovidhomage: CovidController,
        nobiscovidstandard: CovidController,
        ehealthquixahomage: EhealthController,
        ehealthquixastandard: EhealthController,
        timmypet: MyPetController,
        timmotor: TimMotorController,
        screenprotection: ScreenProtectionController,
        axaannullament: AxaViaggioController,
        axaassistancesilver: AxaViaggioController,
        axaassistancegold: AxaViaggioController,
        timmyhome: TimMyHomeController
    };
    constructor(private injector: Injector,
        private dataService: DataService) { }
    private getController(productCode: string): ProductCheckoutController {
        productCode = productCode.replace(/-/g, '');
        const classType = this.productCheckoutStepControllerType[productCode] ? this.productCheckoutStepControllerType[productCode] : ProductBaseController;
        return this.injector.get<ProductCheckoutController>(classType);
    }
    public getProductCheckoutController(): ProductCheckoutController {
        const product = this.dataService.getResponseProduct();
        const productCode = !!product ? product.product_code : '';
        return this.getController(productCode);
    }
    public getProductCheckoutControllerFromCode(code: string) {
        return this.getController(code);
    }
}
