import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {DataService} from '@services';

@Component({
    selector: 'app-checkout-insurance-info-pet-modal-optional-warranties',
    templateUrl: './checkout-insurance-info-pet-modal-optional-warranties.component.html',
    styleUrls: ['./checkout-insurance-info-pet-modal-optional-warranties.component.scss'],
    standalone: false
})
export class CheckoutInsuranceInfoPetModalOptionalWarrantiesComponent implements OnInit {

  @Input() pets: any;

  constructor(
    public activeModal: NgbActiveModal,
    public dataService: DataService,
  ) {
  }

  ngOnInit() {}
}
