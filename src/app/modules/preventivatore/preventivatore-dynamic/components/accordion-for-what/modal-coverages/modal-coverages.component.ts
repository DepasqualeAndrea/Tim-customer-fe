import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DataService } from '@services';

@Component({
    selector: 'app-modal-coverages',
    templateUrl: './modal-coverages.component.html',
    styleUrls: ['./modal-coverages.component.scss'],
    standalone: false
})
export class ModalCoveragesComponent implements OnInit {

  @Input() kenticoContent: any;

  constructor(
    public dataService: DataService,
    public activeModal: NgbActiveModal,
  ) { }

  ngOnInit() {
  }

  closeModal() {
    this.activeModal.close();
  }

}
