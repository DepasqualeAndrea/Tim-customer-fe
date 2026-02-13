import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-modal-furto-e-rapina',
    templateUrl: './modal-furto-e-rapina.component.html',
    styleUrls: ['./modal-furto-e-rapina.component.scss'],
    standalone: false
})
export class ModalFurtoERapinaComponent implements OnInit {

  @Input() kenticoContent: any;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  closeModal(){
    this.activeModal.dismiss()
  }

}
