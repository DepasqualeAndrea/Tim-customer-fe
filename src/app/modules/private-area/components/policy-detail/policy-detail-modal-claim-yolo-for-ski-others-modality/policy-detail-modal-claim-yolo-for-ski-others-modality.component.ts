import { Component, OnInit } from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {KenticoTranslateService} from 'app/modules/kentico/data-layer/kentico-translate.service';
import {take} from 'rxjs/operators';

@Component({
  selector: 'app-policy-detail-modal-claim-yolo-for-ski-others-modality',
  templateUrl: './policy-detail-modal-claim-yolo-for-ski-others-modality.component.html',
  styleUrls: ['./policy-detail-modal-claim-yolo-for-ski-others-modality.component.scss']
})
export class PolicyDetailModalClaimYoloForSkiOthersModalityComponent implements OnInit {

  kenticoItem: any;
  faqsContent: any;

  constructor(
    public activeModal: NgbActiveModal,
    private kenticoTranslateService: KenticoTranslateService
  ) { }

  ngOnInit() {
    this.kenticoTranslateService.getItem<any>('yolo_for_ski_modal_open_claim')
      .pipe(take(1)).subscribe(contentItem => {
        this.kenticoItem = contentItem;
      });
  }
  closeModal() {
    this.activeModal.close();
  }

}
