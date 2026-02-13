import { DataService } from './../../../../../core/services/data.service';
import {InsurancesService} from './../../../../../core/services/insurances.service';
import {Component, Input, OnInit} from '@angular/core';
import {UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators} from '@angular/forms';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Policy} from 'app/modules/private-area/private-area.model';
import {PolicyDetailModalWithdrawalSuccessComponent} from '../policy-detail-modal-withdrawal-success/policy-detail-modal-withdrawal-success.component';
import {Router} from '@angular/router';

@Component({
    selector: 'app-policy-detail-modal-withdrawal-civibank',
    templateUrl: './policy-detail-modal-withdrawal-civibank.component.html',
    styleUrls: ['./policy-detail-modal-withdrawal-civibank.component.scss'],
    standalone: false
})
export class PolicyDetailModalWithdrawalCivibankComponent implements OnInit {

  @Input() policyData: Policy;

  form: UntypedFormGroup;
  withdrawReason: string;
  iban: string;
  requestOpen: boolean;

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: UntypedFormBuilder,
    private insurancesService: InsurancesService,
    private modalService: NgbModal,
    private router: Router,
    public dataService: DataService
  ) {
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      withdrawReason: new UntypedFormControl(),
      iban: new UntypedFormControl('', [Validators.required])
    });
  }

  submitWithdrawal() {
    const body = {
      withdraw: {
        message: this.form.controls.withdrawReason.value,
        policy_number: this.policyData.policyNumber,
        data: {
          bank_account: btoa(this.form.controls.iban.value.toUpperCase())
        }
      }
    };

    this.insurancesService.withdrawWithMoreInfo(this.policyData.id, body).subscribe((res) => {
      this.requestOpen = true;
      const modalRefSuccess = this.modalService.open(PolicyDetailModalWithdrawalSuccessComponent, {size: 'lg'});
      modalRefSuccess.result.then(() => this.rerunGuradsAndResolvers(), () => this.rerunGuradsAndResolvers());
    }, (error) => {
      throw error;
    });
  }

  rerunGuradsAndResolvers() {
    const defaltOnSameUrlNavigation = this.router.onSameUrlNavigation;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigateByUrl(this.router.url, {replaceUrl: true});
    this.router.onSameUrlNavigation = defaltOnSameUrlNavigation;
  }
}
