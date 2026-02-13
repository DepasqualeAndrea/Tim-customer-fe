import {Component, Input, OnInit} from '@angular/core';
import {DomesticAppliance} from '../../../../../../appliance-management/appliance-management.model';

@Component({
    selector: 'app-policy-detail-recaps-card-appliances',
    templateUrl: './policy-detail-recaps-card-appliances.component.html',
    styleUrls: ['./policy-detail-recaps-card-appliances.component.scss'],
    standalone: false
})
export class PolicyDetailRecapsCardAppliancesComponent implements OnInit {

  @Input() appliances: DomesticAppliance[];

  constructor() { }

  ngOnInit() {
  }

}
