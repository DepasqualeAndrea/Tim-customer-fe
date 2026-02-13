import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {DataService} from '@services';

@Component({
    selector: 'app-checkout-insurance-info-motor-modal-optional-warranties',
    templateUrl: './checkout-insurance-info-motor-modal-optional-warranties.component.html',
    styleUrls: ['./checkout-insurance-info-motor-modal-optional-warranties.component.scss'],
    standalone: false
})
export class CheckoutInsuranceInfoMotorModalOptionalWarrantiesComponent implements OnInit {

  @Input() allowedAddons: any;
  @Input() notAllowedAddons: any;
  @Input() kenticoBody: any;

  addonKasko: any;
  addonVandal: any;

  constructor(
    public activeModal: NgbActiveModal,
    public dataService: DataService,
  ) {
  }

  ngOnInit() {
    if (this.allowedAddons) {
      this.addonKasko = this.allowedAddons.find(addon => addon.code.toLowerCase() === 'kasko');
      this.addonVandal = this.allowedAddons.find(addon => addon.code.toLowerCase() === 'vandalnew');
    }
  }
}
