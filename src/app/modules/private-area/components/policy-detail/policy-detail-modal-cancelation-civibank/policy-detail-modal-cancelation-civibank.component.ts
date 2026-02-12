import {Component, Input, OnInit} from '@angular/core';
import {Policy} from '../../../private-area.model';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import {take} from 'rxjs/operators';
import {KenticoTranslateService} from '../../../../kentico/data-layer/kentico-translate.service';
import { DataService } from 'app/core/services/data.service';

@Component({
  selector: 'app-policy-detail-modal-cancelation-civibank',
  templateUrl: './policy-detail-modal-cancelation-civibank.component.html',
  styleUrls: ['./policy-detail-modal-cancelation-civibank.component.scss']
})
export class PolicyDetailModalCancelationCivibankComponent implements OnInit {
  @Input() policyData: Policy;
  expirationDate: string;
  kenticoBody: any;

  constructor(public activeModal: NgbActiveModal,
              private kenticoTranslateService: KenticoTranslateService,
              public dataService: DataService ) {}

  ngOnInit() {
    this.expirationDate = moment(this.policyData.expirationDate).format('DD/MM/YYYY');
    this.kenticoTranslateService.getItem<any>('private_area').pipe(take(1)).subscribe(resp => {
      this.kenticoBody = resp;
    });
  }

  confirmCancelation() {
    this.activeModal.close();
  }
}
