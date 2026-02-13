import {Component, Input, OnInit} from '@angular/core';
import {Installment} from '../../../private-area.model';
import {KenticoTranslateService} from '../../../../kentico/data-layer/kentico-translate.service';

@Component({
    selector: 'app-policy-detail-list-payments',
    templateUrl: './policy-detail-list-payments.component.html',
    styleUrls: ['./policy-detail-list-payments.component.scss'],
    standalone: false
})
export class PolicyDetailListPaymentsComponent implements OnInit {

  @Input() listPayments: Installment[];
  kenticoBody: any;


  constructor(private kenticoTranslateService: KenticoTranslateService) {
  }

  ngOnInit() {
    this.kenticoTranslateService.getItem<any>('private_area').pipe().subscribe(resp => {
      this.kenticoBody = resp;
    });
  }

  getKenticoState(state: string) {
    switch (state) {
      case 'paid':
        return this.kenticoBody.state_done.value;
        break;
      case 'due':
        return this.kenticoBody.state_fail.value;
        break;
      default:
        break;
    }
  }

}
