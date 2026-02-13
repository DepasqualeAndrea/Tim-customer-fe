import { Component, OnInit, Input } from '@angular/core';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {ActivatedRoute} from '@angular/router';
import * as moment from 'moment';
import {InsurancesService, DataService} from '@services';
import { Policy } from 'app/modules/private-area/private-area.model';
import { PolicyConfirmModalClaimComponent } from '../../policy-confirm-modal-claim/policy-confirm-modal-claim.component';

@Component({
    selector: 'app-policy-detail-modal-claim-pet-form',
    templateUrl: './policy-detail-modal-claim-pet-form.component.html',
    styleUrls: ['./policy-detail-modal-claim-pet-form.component.scss'],
    standalone: false
})
export class PolicyDetailModalClaimPetFormComponent implements OnInit {

  policy: Policy;

  @Input() public policyData;

  constructor(public activeModal: NgbActiveModal,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private dataService: DataService,
    private insurancesService: InsurancesService) {}

  openPicker = false;
  stringFromDate: string;
  claimDate: string;
  claimMessage: string;
  datepicker: NgbDateStruct;
  richiestaInviata = false;
  startDate: NgbDateStruct;
  endDate: NgbDateStruct;
  yoloEndDate: string;


  ngOnInit() {
    this.policy = this.route.snapshot.data.policy;

    this.startDate = {
      year: +moment(this.policyData.startDate, 'DD/MM/YYYY').format('YYYY'),
      month: +moment(this.policyData.startDate, 'DD/MM/YYYY').format('MM'),
      day: +moment(this.policyData.startDate, 'DD/MM/YYYY').format('DD')
    };
    this.yoloEndDate = this.dataService.genEndDateYoloWay(this.policyData.expirationDate);
    this.endDate = {
      year: +moment(this.yoloEndDate, 'DD/MM/YYYY').format('YYYY'),
      month: +moment(this.yoloEndDate, 'DD/MM/YYYY').format('MM'),
      day: +moment(this.yoloEndDate, 'DD/MM/YYYY').format('DD')
    };
  }

  setClaimDate() {
    this.claimDate = moment(`${this.datepicker.month}/${this.datepicker.day}/${this.datepicker.year}`, 'MM/DD/YYYY').format('YYYY-MM-DD');
    this.openPicker = false;
  }
  toggleDatePicker() {
    this.openPicker = !this.openPicker;
  }


  submitClaim() {
    const body = {
      date: this.claimDate,
      message: this.claimMessage,
      policy_number: this.policyData.policyNumber,
    };
    this.insurancesService.submitClaims(body).subscribe((res) => {
      this.richiestaInviata = true;
      const modalRef = this.modalService.open(PolicyConfirmModalClaimComponent, { size: 'lg'});
    }, (error) => {
      throw error;
    });
  }


}
