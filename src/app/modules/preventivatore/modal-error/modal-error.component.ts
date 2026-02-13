import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataService } from '@services';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';

@Component({
    selector: 'app-modal-error',
    templateUrl: './modal-error.component.html',
    styleUrls: ['./modal-error.component.scss'],
    standalone: false
})
export class ModalErrorComponent implements OnInit {
  claimImage: string;
  modal: any;

  constructor(
    public  activeModal: NgbActiveModal,
    public  dataService: DataService,
    private kenticoTranslateService: KenticoTranslateService,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    this.kenticoTranslateService.getItem<any>('modal_prev_error').pipe(take(1)).subscribe(item => {
      this.modal = item;
      this.claimImage = item.claim_img.value[0].url;
    });
  }

}
