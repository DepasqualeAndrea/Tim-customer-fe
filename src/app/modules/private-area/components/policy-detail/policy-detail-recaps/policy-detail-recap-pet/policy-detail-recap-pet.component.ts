import { Component, OnInit } from '@angular/core';
import {PolicyDetailRecapDynamicComponent} from '../policy-detail-recap-dynamic.component';

@Component({
  selector: 'app-policy-detail-recap-pet',
  templateUrl: './policy-detail-recap-pet.component.html',
  styleUrls: ['./policy-detail-recap-pet.component.scss']
})
export class PolicyDetailRecapPetComponent extends PolicyDetailRecapDynamicComponent implements OnInit {

  constructor() {
    super();
  }

  ngOnInit() {
  }

}
