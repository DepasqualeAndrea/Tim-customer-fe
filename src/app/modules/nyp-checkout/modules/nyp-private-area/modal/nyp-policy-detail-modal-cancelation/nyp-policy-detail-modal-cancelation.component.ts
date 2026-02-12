import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DataService } from "@services";
import { NypPolicy } from 'app/modules/nyp-checkout/models/api.model';

@Component({
  selector: 'app-nyp-policy-detail-modal-cancelation',
  templateUrl: './nyp-policy-detail-modal-cancelation.component.html',
  styleUrls: ['./nyp-policy-detail-modal-cancelation.component.scss']
})
export class NypPolicyDetailModalCancelationComponent implements OnInit {

  @Input() policyData: NypPolicy;
  expirationDate: string;

  questions = [
    { key: 'NONEED', value: 'Non ne ho piú bisogno' },
    { key: 'NOTUSEFUL', value: 'Poco utile' },
    { key: 'TOOEXPENSIVE', value: 'Troppo costosa' },
    { key: 'BETTERPROD', value: 'Ho trovato un prodotto migliore' },
    { key: 'OTHER', value: 'Altro' },
  ];

  answer: string;

  step = 2; // 1;

  constructor(public activeModal: NgbActiveModal, public dataService: DataService) {
  }

  ngOnInit() {
  }

  prevStep() {
    // if (this.step > 1) {
    //   this.step -= 1;
    // } else {
    this.activeModal.dismiss('canceled');
    // }
  }

  nextStep() {
    this.step += 1;
  }

  confirmCancelation() {
    this.activeModal.close();
  }


}

