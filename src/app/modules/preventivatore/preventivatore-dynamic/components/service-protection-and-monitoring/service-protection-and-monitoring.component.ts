import { Component, OnInit } from '@angular/core';
import { PreventivatoreAbstractComponent } from '../preventivatore-abstract/preventivatore-abstract.component';

@Component({
    selector: 'app-service-protection-and-monitoring',
    templateUrl: './service-protection-and-monitoring.component.html',
    styleUrls: ['./service-protection-and-monitoring.component.scss'],
    standalone: false
})
export class ServiceProtectionAndMonitoringComponent extends PreventivatoreAbstractComponent implements OnInit {

  ngOnInit() {
  }

  selectedTab(productCode) {
    this.data.selected_tab = productCode
  }

}
