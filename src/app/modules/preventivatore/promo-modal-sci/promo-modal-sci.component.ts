import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Router} from '@angular/router';

@Component({
  selector: 'app-promo-modal-sci',
  templateUrl: './promo-modal-sci.component.html',
  styleUrls: ['./promo-modal-sci.component.scss']
})
export class PromoModalSciComponent implements OnInit {

  @Input() kenticoContent: any;
  promoTabWeek: boolean = true;
  promoTabWeekend: boolean = false;

  constructor(
    public activeModal: NgbActiveModal,
    public router: Router
  ) {
  }

  ngOnInit() {
  }

  changeToPromoTabWeek() {
    if (this.promoTabWeek === false) {
      this.promoTabWeek = !this.promoTabWeek;
      this.promoTabWeekend = !this.promoTabWeekend;
    }
    return this.promoTabWeek;
  }

  changeToPromoTabWeekend() {
    if (this.promoTabWeekend === false) {
      this.promoTabWeekend = !this.promoTabWeekend;
      this.promoTabWeek = !this.promoTabWeek;
    }
    return this.promoTabWeekend;
  }

  dismissModal() {
    this.activeModal.dismiss();
  }

}
