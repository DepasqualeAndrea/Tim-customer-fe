import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {Policy} from '../../../private-area.model';
import {ActivatedRoute} from '@angular/router';
import * as moment from 'moment';
import {InsurancesService, DataService} from '@services';
import { PolicyConfirmModalClaimComponent } from '../policy-confirm-modal-claim/policy-confirm-modal-claim.component';


@Component({
    selector: 'app-sunny-policy-detail-modal-claim',
    templateUrl: './sunny-policy-detail-modal-claim.component.html',
    styleUrls: ['./sunny-policy-detail-modal-claim.component.scss'],
    standalone: false
})
export class SunnyPolicyDetailModalClaimComponent implements OnInit {

  policy: Policy;

  @Input() public policyData;

  constructor(
    public  activeModal: NgbActiveModal,
    public  dataService: DataService,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private insurancesService: InsurancesService
  ) {
   }

  openPicker = false;
  stringFromDate: string;
  claimDate: string;
  claimMessage: string;
  addDocs = true;
  hasDocument = false;
  fileNameList = [];
  datepicker: NgbDateStruct;
  richiestaInviata = false;
  startDate: NgbDateStruct;
  endDate: NgbDateStruct;
  yoloEndDate: string;
  countNumber: string;



  ngOnInit() {
    this.policy = this.route.snapshot.data.policy;
    this.startDate = {
      year: +moment(this.policyData.startDate, 'DD/MM/YYYY').format('YYYY'),
      month: +moment(this.policyData.startDate, 'DD/MM/YYYY').format('MM'),
      day: +moment(this.policyData.startDate, 'DD/MM/YYYY').format('DD')
    };

    const endDate = moment(this.policyData.expirationDate).format('DD/MM/YYYY') !== moment(this.policyData.startDate).format('DD/MM/YYYY')
                    ? this.dataService.genEndDateYoloWay(this.policyData.expirationDate)
                    : moment(this.policyData.expirationDate).format('DD/MM/YYYY');

    this.endDate = {
      year: +moment(endDate, 'DD/MM/YYYY').format('YYYY'),
      month: +moment(endDate, 'DD/MM/YYYY').format('MM'),
      day: +moment(endDate, 'DD/MM/YYYY').format('DD')
    };
  }

  toggleDatePicker() {
    this.openPicker = !this.openPicker;
  }

  getFileName(fileInput: any) {
    const fileName = fileInput.target.files[0].name;
    this.fileNameList.push(fileName);
  }

  removeFile(file: string) {
    const filteredAry = this.fileNameList.filter(f => f !== file);
    this.fileNameList = filteredAry;
  }

  submitClaim() {
    const body = {
      date: this.policyData.expirationDate,
      message: 'true',
      policy_number: this.policyData.policyNumber,
      data: {
        bankAccount : btoa(this.countNumber)
        }
    };
    this.insurancesService.submitClaims(body).subscribe((res) => {
      this.richiestaInviata = true;
      const modalRef = this.modalService.open(PolicyConfirmModalClaimComponent, { size: 'lg'});
    }, (error) => {
      throw error;
    });

    localStorage.removeItem('canOpenClaim');
  }


}
