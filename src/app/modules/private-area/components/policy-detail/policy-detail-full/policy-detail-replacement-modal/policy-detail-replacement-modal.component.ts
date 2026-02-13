import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataService, InsurancesService } from '@services';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { Policy } from 'app/modules/private-area/private-area.model';

@Component({
    selector: 'app-policy-detail-replacement-modal',
    templateUrl: './policy-detail-replacement-modal.component.html',
    styleUrls: ['./policy-detail-replacement-modal.component.scss'],
    standalone: false
})
export class PolicyDetailReplacementModalComponent implements OnInit {
  @Input() kenticoContent: any;
  @Input() policyData: Policy;

  form: UntypedFormGroup;

  constructor(
    public  activeModal: NgbActiveModal,
    private insurancesService: InsurancesService,
    public dataService: DataService,
    ) { }

  ngOnInit() {
    this.form = new UntypedFormGroup({
      choise: new UntypedFormControl(null, Validators.required),
      iban: new UntypedFormControl(null)
    });
    this.changeValidatorsAreaField();
  }
  changeValidatorsAreaField() {
    if (this.dataService.tenantInfo.tenant === 'chebanca_db') {
      this.form.controls['iban'].addValidators([Validators.required, Validators.pattern('^IT([0-9a-zA-Z]\s?){25}$') ]);
    }
    if (this.dataService.tenantInfo.tenant !== 'chebanca_db' ) {
      this.form.controls['iban'].addValidators(null);
    }
  }
  createRequest() {
    if(this.dataService.tenantInfo.tenant === 'chebanca_db'){
      const body = {
        recision: {
          reason: this.form.controls.choise.value,
          iban: this.form.controls.iban.value
        }
      };
      this.insurancesService.replacementWithIBAN(this.policyData.id, body).subscribe(() => {
        this.activeModal.close(this.form.controls.choise.value)
      }, (error) => {
        this.activeModal.dismiss();
        throw error;
      });
    } else{
      const body = {
        recision: {
          reason: this.form.controls.choise.value
        }
      };
      this.insurancesService.replacement(this.policyData.id, body).subscribe(() => {
        this.activeModal.close(this.form.controls.choise.value)
      }, (error) => {
        this.activeModal.dismiss();
        throw error;
      });
    }
  }
  get checkCheBanca(): boolean {
    return this.dataService.tenantInfo.tenant === 'chebanca_db' && this.policyData.product.product_code === 'ge-home';
  }
}
