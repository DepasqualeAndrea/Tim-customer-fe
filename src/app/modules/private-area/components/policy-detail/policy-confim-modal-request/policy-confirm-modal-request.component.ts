import { take } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataService } from '@services';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';

@Component({
  selector: 'app-policy-confirm-modal-request',
  templateUrl: './policy-confirm-modal-request.component.html',
  styleUrls: ['./policy-confirm-modal-request.component.scss']
})
export class PolicyConfirmModalRequestComponent implements OnInit {

  claimImage: string;

  constructor(
    public  activeModal: NgbActiveModal,
    public  dataService: DataService,
    private kenticoTranslateService: KenticoTranslateService,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    this.kenticoTranslateService.getItem<any>('private_area.claim_confirm_image').pipe(take(1)).subscribe(item => {
      this.claimImage = item.images[0].url;
    });
  }

}
