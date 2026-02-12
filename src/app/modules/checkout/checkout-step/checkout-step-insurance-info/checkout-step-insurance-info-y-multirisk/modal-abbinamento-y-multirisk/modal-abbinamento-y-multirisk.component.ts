import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { ContentItem } from 'kentico-cloud-delivery';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-modal-abbinamento-y-multirisk',
  templateUrl: './modal-abbinamento-y-multirisk.component.html',
  styleUrls: ['./modal-abbinamento-y-multirisk.component.scss']
})
export class ModalAbbinamentoYMultiriskComponent implements OnInit {

  content: any;

  constructor(private kenticoTranslateService: KenticoTranslateService,
              public activeModal: NgbActiveModal) { }

  ngOnInit() {
    this.getKenticoContent();
    console.log('kenticoContent: ', this.content);
  }

  getKenticoContent() {
    this.kenticoTranslateService.getItem<any>('modal_abbinamento_tutela_legale').pipe(take(1)).subscribe(item => {
      this.createContentItem(item);
    });
  }

  createContentItem(kenticoItem) {
    this.content = {
      close_icon: kenticoItem.close_icon.value[0].url,
      description: kenticoItem.description.value
    };
  }



}
