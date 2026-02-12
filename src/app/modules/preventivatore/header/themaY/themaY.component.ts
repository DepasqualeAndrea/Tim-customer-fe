import {Component, Input, OnInit} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataService } from '@services';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { take } from 'rxjs/operators';
import { ModalSportImaginIncludeComponent } from '../../modal-sport-imagin-include/modal-sport-imagin-include.component';

@Component({
  selector: 'app-header-thema-y',
  templateUrl: './themaY.component.html',
  styleUrls: ['../../preventivatoreY.component.scss'],
})
export class HeaderThemaY implements OnInit {

  @Input() product;
  content: any;

  constructor(
    public dataService: DataService,
    private kenticoTranslateService: KenticoTranslateService,
    private modalService: NgbModal,
  ) {}

  ngOnInit() {
    this.kenticoTranslateService.getItem<any>('quotator').pipe(take(1)).subscribe(item => {
      this.content = item;
    });
  }
  openModalImaginSportInfoInclude(): void {
    const modalRef = this.modalService.open(ModalSportImaginIncludeComponent,
      {size: 'lg', backdropClass: 'backdrop-class ' + this.dataService.tenantInfo.main.layout, windowClass: 'modal-window', centered: true});
    modalRef.componentInstance.product = this.product;
  }
}
