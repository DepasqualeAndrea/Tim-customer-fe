import {Component, Input, OnInit} from '@angular/core';
import {Policy} from '../../../private-area.model';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {DataService} from '@services';
import { RequestWithdrawIBAN } from '@model';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-policy-detail-modal-withdrawal-new',
  templateUrl: './policy-detail-modal-withdrawal-new.component.html',
  styleUrls: ['./policy-detail-modal-withdrawal-new.component.scss']
})
export class PolicyDetailModalWithdrawalNewComponent implements OnInit {

  @Input() policyData: Policy;

  withdrawReason: string = '';
  withdrawIBAN: string;
  form: FormGroup;

  constructor(
    public activeModal: NgbActiveModal,
    public dataService: DataService
  ) {
  }

  ngOnInit() {
    if(this.dataService.tenantInfo.tenant === 'chebanca_db'){
      this.form = new FormGroup({
        iban: new FormControl(null, [Validators.required, Validators.pattern('^(it|IT)[0-9]{2}[A-Za-z][0-9]{10}[0-9A-Za-z]{12}$')])
      });
    }
  }


  closeModal(){
    if(this.dataService.tenantInfo.tenant === 'chebanca_db'){
      let result : RequestWithdrawIBAN = {withdraw: {message: this.withdrawReason, policy_number: this.policyData.policyNumber, iban: this.form.controls.iban.value}}
      this.activeModal.close(result);
    } else {
      this.activeModal.close(this.withdrawReason);
    }
  }
}
