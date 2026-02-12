import { KenticoTranslateService } from './../../../../kentico/data-layer/kentico-translate.service';
import { Component, OnInit } from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { DataService } from '@services';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-policy-detail-modal-withdrawal-success',
  templateUrl: './policy-detail-modal-withdrawal-success.component.html',
  styleUrls: ['./policy-detail-modal-withdrawal-success.component.scss']
})
export class PolicyDetailModalWithdrawalSuccessComponent implements OnInit {

  withdrawalImage: any;

  constructor(
    public activeModal: NgbActiveModal,
    public  dataService: DataService,
    private kenticoTranslateService: KenticoTranslateService
  ) { }

  ngOnInit() {
    this.kenticoTranslateService.getItem<any>('private_area.cancelation_withdrawal_confirm_image').pipe(take(1)).subscribe(item => {
      this.withdrawalImage = item.images[0].url;
    });
  }


}
