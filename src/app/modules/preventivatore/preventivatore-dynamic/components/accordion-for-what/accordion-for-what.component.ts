import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DataService } from '@services';
import { ModalService } from 'app/core/services/modal.service';
import { PreventivatoreAbstractComponent } from '../preventivatore-abstract/preventivatore-abstract.component';

@Component({
  selector: 'app-accordion-for-what',
  templateUrl: './accordion-for-what.component.html',
  styleUrls: ['./accordion-for-what.component.scss']
})
export class AccordionForWhatComponent extends PreventivatoreAbstractComponent implements OnInit {

  openAccordion: boolean[] = [true, false];

  constructor(
    public dataService: DataService,
    ref: ChangeDetectorRef,
    private modalService : ModalService,
  ){
    super(ref);
  }

  ngOnInit() {
    if(this.dataService.tenantInfo.tenant === 'banca-sella_db' && this.data.container_class[1] === 'ge-travel-plus'){
      this.modalLogic()
    }
  }

  openCloseAccordion(index : number){
    this.openAccordion[index]= !this.openAccordion[index];
  }

  openModalCoverage(){
    this.modalService.openModal('container_modal','ModalCoverages');
  }

  openModalCoverageHoliday(id: any){
    let idObj : Object = {
      id: id,
    }
    this.modalService.openModalSCA('container_modal_holiday', 'ModalCoveragesHoliday', idObj);
  }

  private modalLogic(){
    let elements = document.getElementsByTagName("em");
    for (var i=0; i < elements.length; i++) {
      elements[i].addEventListener('click', event => {
        this.openModalCoverage()
      })
  };
  }
}
