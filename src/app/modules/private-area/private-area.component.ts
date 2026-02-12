import {Component, OnInit} from '@angular/core';
import {NavbarCbVariantSkinComponent} from '../../components/public/navbar/navbar-cb/navbar-cb-variant-skin.component';
import { DataService } from '@services';
import { ComponentFeaturesService } from 'app/core/services/componentFeatures.service';


@Component({
  selector: 'app-private-area',
  templateUrl: './private-area.component.html',
  styleUrls: ['./private-area.component.scss']
})
export class PrivateAreaComponent extends NavbarCbVariantSkinComponent implements OnInit{

    constructor(
      public dataService: DataService,
      private componentFeaturesService: ComponentFeaturesService
    ) { super(); }

    useBasicComponents: boolean;
    fullWidth = true;

    ngOnInit(): void {
      this.componentFeaturesService.useComponent('private-area');
      this.componentFeaturesService.useRule('basic-components');
      this.useBasicComponents = this.componentFeaturesService.isRuleEnabled();

      this.componentFeaturesService.useRule('recommended-products');
      const recommendedProductsRule = this.componentFeaturesService.isRuleEnabled();
      if (recommendedProductsRule) {
        this.fullWidth = this.componentFeaturesService.getConstraints().get('full-width');
      }

    }
}
