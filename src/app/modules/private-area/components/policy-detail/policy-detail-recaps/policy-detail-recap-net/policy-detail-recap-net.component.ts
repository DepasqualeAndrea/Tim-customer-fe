import { Component, OnInit } from '@angular/core';
import {PolicyDetailRecapDynamicComponent} from '../policy-detail-recap-dynamic.component';

@Component({
  selector: 'app-policy-detail-recap-net',
  templateUrl: './policy-detail-recap-net.component.html',
  styleUrls: ['./policy-detail-recap-net.component.scss']
})
export class PolicyDetailRecapNetComponent extends PolicyDetailRecapDynamicComponent implements OnInit {

  constructor() {
    super();
  }

  ngOnInit() {
  }

}
