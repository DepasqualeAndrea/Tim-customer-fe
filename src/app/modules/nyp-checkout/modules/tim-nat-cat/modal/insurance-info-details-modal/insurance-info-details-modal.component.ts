import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-insurance-info-details-modal',
    templateUrl: './insurance-info-details-modal.component.html',
    styleUrls: ['./insurance-info-details-modal.component.scss'],
    standalone: false
})
export class InsuranceInfoDetailsModalComponent implements OnInit {
  @Input() kenticoContent: any;
  @Input() packetTitle: string;
  openedIndex: number | null = null;
  accordionList: any[] = [];

  constructor( private modalService: NgbModal ) {}

  ngOnInit(): void {
    Object.keys(this.kenticoContent.accordion_conf).forEach(el=>{
      if(el.includes('modal')){
        this.accordionList.push(this.kenticoContent.accordion_conf[el]);
      }
    });
  }

  togglePanel(index: number): void {
    this.openedIndex = this.openedIndex === index ? null : index;
  }

  closeModal(){
    this.modalService.dismissAll();
  }

}
