import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {KenticoTranslateService} from 'app/modules/kentico/data-layer/kentico-translate.service';
import {take} from 'rxjs/operators';


@Component({
  selector: 'app-modal-sport-imagin-include',
  templateUrl: './modal-sport-imagin-include.component.html',
  styleUrls: ['./modal-sport-imagin-include.component.scss']
})
export class ModalSportImaginIncludeComponent implements OnInit {
  kenticoItem: any;
  faqsContent: any;

  constructor(
    public activeModal: NgbActiveModal,
    private kenticoTranslateService: KenticoTranslateService
  ) { }

  ngOnInit() {
    this.kenticoTranslateService.getItem<any>('modal_imagin_sport')
      .pipe(take(1)).subscribe(contentItem => {
        this.kenticoItem = contentItem;
        this.faqsContent = contentItem.faqs.value[0].list_items.value;
      });
  }
  closeModal() {
    this.activeModal.close();
  }
}

