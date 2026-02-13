import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {DataService, InsurancesService} from '@services';
import {Policy} from 'app/modules/private-area/private-area.model';
import {PolicyConfirmModalRequestComponent} from '../policy-confim-modal-request/policy-confirm-modal-request.component';
import {UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators} from '@angular/forms';


@Component({
    selector: 'app-send-request-modal',
    templateUrl: './send-request-modal.component.html',
    styleUrls: ['./send-request-modal.component.scss'],
    standalone: false
})
export class SendRequestModalComponent implements OnInit {

  policy: Policy;
  form: UntypedFormGroup;

  @Input() public policyData;

  constructor(
    public activeModal: NgbActiveModal,
    public dataService: DataService,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private insurancesService: InsurancesService,
    private formBuilder: UntypedFormBuilder
  ) {
  }

  ngOnInit() {
    this.policy = this.route.snapshot.data.policy;
    this.form = this.formBuilder.group({
      withdrawReason: new UntypedFormControl(),
      iban: new UntypedFormControl(undefined, [Validators.required])
    });
  }

  submitRequest() {
    const body = {
      message: this.form.controls.withdrawReason.value,
      policy_number: this.policyData.policyNumber,
      data: {
        bank_account: btoa(this.form.controls.iban.value.toUpperCase())
      }
    };
    this.insurancesService.genericRequest(this.policyData.id, body).subscribe(() => {
      this.modalService.open(PolicyConfirmModalRequestComponent, {size: 'lg'});
    }, (error) => {
      throw error;
    });
  }
}
