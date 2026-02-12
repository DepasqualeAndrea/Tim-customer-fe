import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ContentItem } from 'kentico-cloud-delivery';

@Component({
  selector: 'app-modal-screen-protection-promo-code',
  templateUrl: './modal-screen-protection-promo-code.component.html',
  styleUrls: ['./modal-screen-protection-promo-code.component.scss']
})
export class ModalScreenProtectionPromoCodeComponent implements OnInit {

  @Input() content: ContentItem;

  constructor(
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit() {
  }

}
