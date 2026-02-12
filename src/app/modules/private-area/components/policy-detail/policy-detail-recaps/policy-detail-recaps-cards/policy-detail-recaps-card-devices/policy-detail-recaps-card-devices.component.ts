import {Component, Input, OnInit} from '@angular/core';
import {Policy} from '../../../../../private-area.model';

@Component({
  selector: 'app-policy-detail-recaps-card-devices',
  templateUrl: './policy-detail-recaps-card-devices.component.html',
  styleUrls: ['./policy-detail-recaps-card-devices.component.scss']
})
export class PolicyDetailRecapsCardDevicesComponent implements OnInit {

  @Input() policy: Policy;

  constructor() { }

  ngOnInit() {
  }

}
