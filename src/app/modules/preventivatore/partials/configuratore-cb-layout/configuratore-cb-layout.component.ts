import {Component, Input, OnInit} from '@angular/core';
import {GtmHandlerService} from '../../../../core/services/gtm/gtm-handler.service';
import {Product} from '@model';
import {CbGtmAction} from '../../../../core/models/gtm/cb/cb-gtm-action.model';

@Component({
    selector: 'app-configuratore-cb-layout',
    templateUrl: './configuratore-cb-layout.component.html',
    styleUrls: ['./configuratore-cb-layout.component.scss'],
    standalone: false
})
export class ConfiguratoreCbLayoutComponent implements OnInit {
  private actionsMap: Map<string, CbGtmAction> = new Map<string, CbGtmAction>();
  activeProduct = 1;
  @Input() products: any;

  constructor(private gtmHandler: GtmHandlerService) {

  }
  private initGtmActions(){
    this.actionsMap.set('ge-travel-premium', new CbGtmAction('travelEvent', 'click CheBanca! Protezione Viaggio Premium', 'Protezione Viaggio Premium'));
    this.actionsMap.set('ge-travel-plus', new CbGtmAction('travelEvent', 'click CheBanca! Protezione Viaggio Plus', 'Protezione Viaggio Plus'));
    this.actionsMap.set('ge-sport-premium', new CbGtmAction('sportEvent', 'click CheBanca! Protezione Sport Premium', 'Protezione Sport Premium'));
    this.actionsMap.set('ge-sport-plus', new CbGtmAction('sportEvent', 'click CheBanca! Protezione Sport Plus', 'Protezione Sport Plus'));
    this.actionsMap.set('ge-bike-premium', new CbGtmAction('bikeEvent', 'click CheBanca! Protezione Bike Premium', 'Protezione Bike Premium'));
    this.actionsMap.set('ge-bike-plus', new CbGtmAction('bikeEvent', 'click CheBanca! Protezione Bike Plus', 'Protezione Bike Plus'));
    /*this.actionsMap.set('ge-ski-premium', new CbGtmAction('winterSportsEvent', 'click CheBanca! Protezione Sci Premium', 'Protezione Sci Premium'));
    this.actionsMap.set('ge-ski-plus', new CbGtmAction('winterSportsEvent', 'click CheBanca! Protezione Sci Plus', 'Protezione Sci Plus'));
    this.actionsMap.set('ge-ski-seasonal-premium', new CbGtmAction('winterSeasonSportsEvent', 'click CheBanca! Protezione Sci Stagionale Premium', 'Protezione Sci Stagionale Premium'));
    this.actionsMap.set('ge-ski-seasonal-plus', new CbGtmAction('winterSeasonSportsEvent', 'click CheBanca! Protezione Sci Stagionale Plus', 'Protezione Sci Stagionale Plus'));
    this.actionsMap.set('ge-holiday-house-premium', new CbGtmAction('holidayHomeEvent', 'click CheBanca! Protezione Casa Premium', 'Protezione Casa Premium'));
    this.actionsMap.set('ge-holiday-house-plus', new CbGtmAction('holidayHomeEvent', 'click CheBanca! Protezione Casa Plus', 'Protezione Casa Plus'));*/

  }

  ngOnInit() {
    this.products.sort((a, b) => a.product_code.localeCompare(b.product_code));
    this.initGtmActions();

  }

  handleGtm(product: Product) {
    if(!product || !product.product_code || !product.name) {
      return;
    }

    const action: CbGtmAction = this.actionsMap.get(product.product_code);
    if(!!action) {
      this.gtmHandler.requireTenant("chebanca");
      this.gtmHandler.getModelHandler().reset();
      this.gtmHandler.getModelHandler().add(action);
      this.gtmHandler.push();
    }
  }
}
