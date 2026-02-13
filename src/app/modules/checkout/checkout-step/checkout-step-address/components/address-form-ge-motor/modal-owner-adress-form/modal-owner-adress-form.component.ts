import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-modal-owner-adress-form',
    templateUrl: './modal-owner-adress-form.component.html',
    styleUrls: ['./modal-owner-adress-form.component.scss'],
    standalone: false
})
export class ModalOwnerAdressFormComponent implements OnInit {

  @Input() kenticoContent: any;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

}
