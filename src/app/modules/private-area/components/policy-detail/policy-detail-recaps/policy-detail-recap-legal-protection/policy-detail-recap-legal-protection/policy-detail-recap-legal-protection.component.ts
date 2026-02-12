import { Component, OnInit, Input } from '@angular/core';
import { PolicyDetailRecapDynamicComponent } from '../../policy-detail-recap-dynamic.component';
import { Policy } from 'app/modules/private-area/private-area.model';

@Component({
  selector: 'app-policy-detail-recap-legal-protection',
  templateUrl: './policy-detail-recap-legal-protection.component.html',
  styleUrls: ['./policy-detail-recap-legal-protection.component.scss']
})
export class PolicyDetailRecapLegalProtectionComponent extends PolicyDetailRecapDynamicComponent implements OnInit {

  @Input() policy: Policy;

  constructor() {
    super();
  }

  ngOnInit() {
  }

}
