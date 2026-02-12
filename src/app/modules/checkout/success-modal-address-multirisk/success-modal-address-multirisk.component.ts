import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-success-modal-address-multirisk',
  templateUrl: './success-modal-address-multirisk.component.html',
  styleUrls: ['./success-modal-address-multirisk.component.scss']
})
export class SuccessModalAddressMultiriskComponent implements OnInit {

  @Input() kenticoContent: any;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

}
