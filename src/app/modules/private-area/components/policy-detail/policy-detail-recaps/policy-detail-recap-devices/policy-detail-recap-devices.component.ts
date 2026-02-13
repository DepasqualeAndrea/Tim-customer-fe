import {Component, OnInit} from '@angular/core';
import {PolicyDetailRecapDynamicComponent} from '../policy-detail-recap-dynamic.component';

@Component({
    selector: 'app-policy-detail-recap-devices',
    templateUrl: './policy-detail-recap-devices.component.html',
    styleUrls: ['./policy-detail-recap-devices.component.scss'],
    standalone: false
})
export class PolicyDetailRecapDevicesComponent extends PolicyDetailRecapDynamicComponent implements OnInit {

  constructor() {
    super();
  }

  ngOnInit() {
  }

}
