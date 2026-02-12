import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DataService } from '@services';

@Component({
  selector: 'app-checkout-insurance-info-motor-modal-details-warranties',
  templateUrl: './checkout-insurance-info-motor-modal-details-warranties.component.html',
  styleUrls: ['./checkout-insurance-info-motor-modal-details-warranties.component.scss']
})
export class CheckoutInsuranceInfoMotorModalDetailsWarrantiesComponent implements OnInit {

  @Input() addon: any;
  @Input() kenticoBody: any;


  constructor(
    public activeModal: NgbActiveModal,
    public dataService: DataService,
  ) {
  }

  ngOnInit() {
  }

}
