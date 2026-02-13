import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-modal-additional-warrenty-y-multirisk',
    templateUrl: './modal-additional-warrenty-y-multirisk.component.html',
    styleUrls: ['./modal-additional-warrenty-y-multirisk.component.scss'],
    standalone: false
})
export class ModalAdditionalWarrentyYMultiriskComponent implements OnInit {

  contentItem: any;
  @Input() kenticoItem: any;
  @Input() id;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  closeModal(){
    this.activeModal.dismiss();
  }

}
