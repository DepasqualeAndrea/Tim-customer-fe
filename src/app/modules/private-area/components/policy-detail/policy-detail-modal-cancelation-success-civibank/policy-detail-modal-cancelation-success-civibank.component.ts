import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {KenticoTranslateService} from '../../../../kentico/data-layer/kentico-translate.service';
import {DataService} from '@services';
import {take} from 'rxjs/operators';
import {Policy} from '../../../private-area.model';
import * as moment from 'moment';

@Component({
  selector: 'app-policy-detail-modal-cancelation-success-civibank',
  templateUrl: './policy-detail-modal-cancelation-success-civibank.component.html',
  styleUrls: ['./policy-detail-modal-cancelation-success-civibank.component.scss']
})
export class PolicyDetailModalCancelationSuccessCivibankComponent implements OnInit {

  @Input() policyData: Policy;
  cancelationImage: string;
  expirationDate: string;
  productName: string;

  constructor(public activeModal: NgbActiveModal,
              private kenticoTranslateService: KenticoTranslateService,
              public dataService: DataService) {
  }

  ngOnInit() {
    this.getProductName();
    this.expirationDate = moment(this.policyData.expirationDate).format('DD/MM/YYYY');
    this.kenticoTranslateService.getItem<any>('private_area.cancelation_confirm_image').pipe(take(1)).subscribe(item => {
      this.cancelationImage = item.images[0].url;
    });
  }

  getProductName() {
    switch (this.policyData.product.product_code) {
      case 'hpet-vip':
      case 'hpet-basic':
      case 'hpet-prestige':
        this.productName = 'A spasso con Chiara';
        break;
      default:
        this.productName = this.policyData.name;
    }
  }
}
