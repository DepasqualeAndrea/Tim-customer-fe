import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService, InsurancesService } from '@services';
import { ComponentFeaturesService } from 'app/core/services/componentFeatures.service';
import { Claim } from '../../private-area.model';
import { NypInsurancesService } from '@NYP/ngx-multitenant-core';

@Component({
    selector: 'app-claim-detail',
    templateUrl: './claim-detail.component.html',
    styleUrls: ['./claim-detail.component.scss'],
    standalone: false
})
export class ClaimDetailComponent implements OnInit {
  idDisabled: boolean;
  claimDateDisabled: boolean;
  messageDisabled: boolean;
  claim: Claim;

  constructor(private route: ActivatedRoute,
    public dataService: DataService,
    private componentFeaturesService: ComponentFeaturesService,
    private nypInsurancesService: NypInsurancesService
  ) {
  }

  ngOnInit() {
    this.claim = this.route.snapshot.data.claim;
    this.setNameProduct();
    this.idDisabledRule();
    this.claimDateDisabledRule();
    this.messageDisabledRule();
  }

  idDisabledRule(): boolean {
    this.componentFeaturesService.useComponent('claims');
    this.componentFeaturesService.useRule('claim-id-disabled');
    this.idDisabled = this.componentFeaturesService.isRuleEnabled();
    return this.idDisabled;
  }

  claimDateDisabledRule(): boolean {
    this.componentFeaturesService.useComponent('claims');
    this.componentFeaturesService.useRule('claim-id-disabled');
    this.claimDateDisabled = this.componentFeaturesService.isRuleEnabled();
    return this.idDisabled;
  }

  messageDisabledRule(): boolean {
    this.componentFeaturesService.useComponent('claims');
    this.componentFeaturesService.useRule('claim-id-disabled');
    this.messageDisabled = this.componentFeaturesService.isRuleEnabled();
    return this.idDisabled;
  }

  setNameProduct() {
    this.nypInsurancesService.getProducts().subscribe(list => {
      const nameProduct = list.products.find(prod => prod.name === this.claim.product).properties.find(prop => prop.name === 'name_product');
      if (nameProduct) {
        this.claim.product = nameProduct.value + this.claim.product;
      }
    });
  }

  // TODO in this moment don't have API for remove attachment file
  removeFile(file: any) {
  }

}
