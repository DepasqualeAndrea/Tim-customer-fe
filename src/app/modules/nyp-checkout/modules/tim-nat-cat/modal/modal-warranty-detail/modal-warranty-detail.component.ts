import { Component, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-warranty-detail',
  templateUrl: './modal-warranty-detail.component.html',
  styleUrls: ['./modal-warranty-detail.component.scss']
})
export class ModalWarrantyDetailComponent {
  @Input() kenticoContent: any;
  @Input() iconClose: any;

  constructor( private modalService: NgbModal ) {}

  closeModal(){
    this.modalService.dismissAll();
  }
}
