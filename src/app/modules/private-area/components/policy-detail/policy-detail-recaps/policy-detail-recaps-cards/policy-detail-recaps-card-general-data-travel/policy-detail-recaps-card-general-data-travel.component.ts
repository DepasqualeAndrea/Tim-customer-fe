import {Component, Input, OnInit} from '@angular/core';
import {Policy} from '../../../../../private-area.model';

@Component({
  selector: 'app-policy-detail-recaps-card-general-data-travel',
  templateUrl: './policy-detail-recaps-card-general-data-travel.component.html',
  styleUrls: ['./policy-detail-recaps-card-general-data-travel.component.scss']
})
export class PolicyDetailRecapsCardGeneralDataTravelComponent implements OnInit {

  @Input() policy: Policy;

  constructor() {
  }

  ngOnInit() {
  }

  isPolicyPriceANumber(): boolean {
    return !!this.policy && !!this.policy.price && !isNaN(<number>this.policy.price);
  }

}
