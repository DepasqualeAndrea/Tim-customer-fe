import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-product-detail-section-info-modal',
  templateUrl: './product-detail-section-info-modal.component.html',
  styleUrls: ['./product-detail-section-info-modal.component.scss']
})
export class ProductDetailSectionInfoModalComponent implements OnInit {

  @Input() content

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

  closeModal() {
    this.activeModal.close()
  }
}
