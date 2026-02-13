import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DataService } from '@services';
import { values } from 'lodash';

@Component({
    selector: 'app-modal-coverages-holiday',
    templateUrl: './modal-coverages-holiday.component.html',
    styleUrls: ['./modal-coverages-holiday.component.scss'],
    standalone: false
})
export class ModalCoveragesHolidayComponent implements OnInit {

  @Input() kenticoContent: any;
  @Input() sendRequest: { id: string};

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
