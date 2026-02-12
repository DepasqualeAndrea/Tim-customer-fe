import { NypIadPolicyService, NypInsurancesService } from '@NYP/ngx-multitenant-core';
import { Component, OnInit } from '@angular/core';
import { AuthService, DataService, InsurancesService, Tenants } from '@services';
import { ComponentFeaturesService } from 'app/core/services/componentFeatures.service';
import { KenticoTranslatePipe } from 'app/modules/kentico/data-layer/kentico-translate.pipe';
import * as moment from 'moment';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-my-claims',
  templateUrl: './my-claims.component.html',
  styleUrls: ['./my-claims.component.scss']
})
export class MyClaimsComponent implements OnInit {

  claims: any;
  noclaims = false;
  idDisabled: boolean;
  claimNumber: boolean;
  showNumPolicy: boolean;

  constructor(
    private insuranceService: InsurancesService,
    protected nypInsurancesService: NypInsurancesService,
    private nypIadPolicyService: NypIadPolicyService,
    public dataService: DataService,
    private authService: AuthService,
    private componentFeaturesService: ComponentFeaturesService,
    private kenticoPipe: KenticoTranslatePipe,
  ) {
  }

  ngOnInit() {
    this.idDisabledRule();
    this.setShowNumPolicy();
    if (this.dataService.isTenant(Tenants.INTESA)) {
      this.insuranceService.getClaimsFromProviders().pipe(take(1)).subscribe(claimsList => {
        claimsList.claims.sort((a, b) => b.id as any - a.id as any);
        this.claims = claimsList.claims;
        if (claimsList.claims.length === 0) {
          this.noclaims = true;
          return;
        }
        this.setNameProduct();
      });

    } else {
      this.nypIadPolicyService.getClaims(this.authService.loggedUser.id).pipe(take(1)).subscribe(claimsList => {
        this.claims = claimsList.data;
        if (!claimsList.data || claimsList.data.length === 0) {
          this.noclaims = true;
          return;
        }
        this.setNameProduct();
      });
    }
  }


  idDisabledRule(): void {
    this.componentFeaturesService.useComponent('claims');
    this.componentFeaturesService.useRule('claim-id-disabled');
    this.idDisabled = this.componentFeaturesService.isRuleEnabled();
  }

  setShowNumPolicy(): void {
    this.componentFeaturesService.useComponent('claims');
    this.componentFeaturesService.useRule('show-num-insurance');
    this.showNumPolicy = this.componentFeaturesService.isRuleEnabled();
  }

  getDateCreatedClaim(date: string): string {
    return moment(date).format('DD/MM/YYYY');
  }

  isClaimPet(insurance) {
    return (insurance.pet_properties &&
      (insurance.name.toLowerCase().includes('vip')
        && insurance.name.toLowerCase().includes('prestige')
        && insurance.name.toLowerCase().includes('basic')))
      || insurance.policy_number.startsWith('YMF');
  }

  setNameProduct() {
    this.nypInsurancesService.getProducts().subscribe(list => {
      this.claims.forEach(claim => {
        const nameProduct = list.products.find(prod => prod.name === claim.insurance.name).properties.find(prop => prop.name === 'name_product');
        if (nameProduct) {
          claim.insurance.name = nameProduct.value + claim.insurance.name;
        }
      });
    });
  }

  getFileExt(base64: string): string {
    let base64Type = base64.substring(5).split(';base64,')[0];
    if (base64Type.includes('/')) base64Type = base64Type.split('/').pop();

    return base64Type;
  }

  downloadFile(base64: string, kenticoSlug: string, index: number) {
    this.kenticoPipe.transform(kenticoSlug).subscribe(filename => {
      const downloadLink = document.createElement("a");
      downloadLink.href = base64;
      downloadLink.download = `${filename}${index}.${this.getFileExt(base64)}`;

      downloadLink.click();
    });
  }
}
