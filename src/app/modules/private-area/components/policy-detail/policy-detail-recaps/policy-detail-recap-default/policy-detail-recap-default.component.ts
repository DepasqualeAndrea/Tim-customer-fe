import {Component, OnInit} from '@angular/core';
import {PolicyDetailRecapDynamicComponent} from '../policy-detail-recap-dynamic.component';

@Component({
  selector: 'app-policy-detail-recap-default',
  templateUrl: './policy-detail-recap-default.component.html',
  styleUrls: ['./policy-detail-recap-default.component.scss']
})
export class PolicyDetailRecapDefaultComponent extends PolicyDetailRecapDynamicComponent implements OnInit {

  constructor() {
    super();
  }

  ngOnInit() {
  }

}
