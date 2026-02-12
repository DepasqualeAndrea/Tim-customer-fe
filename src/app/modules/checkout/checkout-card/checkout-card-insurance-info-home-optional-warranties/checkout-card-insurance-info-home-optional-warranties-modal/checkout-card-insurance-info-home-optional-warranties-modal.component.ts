import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DataService } from '@services';

@Component({
  selector: 'app-checkout-card-insurance-info-home-optional-warranties-modal',
  templateUrl: './checkout-card-insurance-info-home-optional-warranties-modal.component.html',
  styleUrls: ['./checkout-card-insurance-info-home-optional-warranties-modal.component.scss']
})
export class CheckoutCardInsuranceInfoHomeOptionalWarrantiesModalComponent implements OnInit {

@Input() addon: any;

  constructor(    
    public activeModal: NgbActiveModal,
    public dataService: DataService,
    ) { }

  ngOnInit() {
  }

}
