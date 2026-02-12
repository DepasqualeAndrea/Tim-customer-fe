import {Component, Input, OnInit} from '@angular/core';
import {Policy} from '../../../private-area.model';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {DataService} from "@services";

@Component({
  selector: 'app-policy-detail-modal-cancelation',
  templateUrl: './policy-detail-modal-cancelation.component.html',
  styleUrls: ['./policy-detail-modal-cancelation.component.scss']
})
export class PolicyDetailModalCancelationComponent implements OnInit {

  @Input() policyData: Policy;
  expirationDate: string;

  questions = [
    {key: 'NONEED', value: 'Non ne ho piú bisogno'},
    {key: 'NOTUSEFUL', value: 'Poco utile'},
    {key: 'TOOEXPENSIVE', value: 'Troppo costosa'},
    {key: 'BETTERPROD', value: 'Ho trovato un prodotto migliore'},
    {key: 'OTHER', value: 'Altro'},
  ];

  answer: string;

  step = 2; // 1;

  constructor(public activeModal: NgbActiveModal, public dataService: DataService) {
  }

  ngOnInit() {
    this.expirationDate = this.getExpirationDate(this.policyData.expirationDate);
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

  getExpirationDate(date) {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (1 + date.getMonth()).toString().padStart(2, '0');
    const year = date.getFullYear();
    return day + '/' + month + '/' + year;
  }
  get checkCheBanca(): boolean {
    return this.dataService.tenantInfo.tenant === 'chebanca_db' && this.policyData.product.product_code === 'ge-home';
  }
}
