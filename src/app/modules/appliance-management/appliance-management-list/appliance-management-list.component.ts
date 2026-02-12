import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DomesticAppliance} from '../../checkout/checkout-step/checkout-step-insurance-info/checkout-step-insurance-info-elettrodomestici/checkout-step-insurance-info-elettrodomestici.model';

@Component({
  selector: 'app-appliance-management-list',
  templateUrl: './appliance-management-list.component.html',
  styleUrls: ['./appliance-management-list.component.scss']
})
export class ApplianceManagementListComponent implements OnInit {

  @Input() appliances: DomesticAppliance[];

  @Input() canRemove = true;

  @Output() applianceRemoved: EventEmitter<DomesticAppliance> = new EventEmitter();

  constructor() {
  }

  ngOnInit() {
  }

  onRemoveClicked(appliance: DomesticAppliance) {
    this.applianceRemoved.emit(appliance);
  }

}
