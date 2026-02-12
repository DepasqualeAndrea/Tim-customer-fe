import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DataService } from '@services';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';

@Component({
  selector: 'app-modal-withdrawal-success-net',
  templateUrl: './modal-withdrawal-success-net.component.html',
  styleUrls: ['./modal-withdrawal-success-net.component.scss']
})
export class ModalWithdrawalSuccessNetComponent implements OnInit {

  kenticoContent;

  constructor(
    public activeModal: NgbActiveModal,
    public  dataService: DataService,
    private kenticoTranslateService: KenticoTranslateService
  ) { }

  ngOnInit() {
  }
  closeModal() {
    this.activeModal.close();
  }
}
