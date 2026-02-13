import { Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataService, InsurancesService } from '@services';
import { ModalTerminiCondizioniInvestorComponent } from './modal-termini-condizioni-investor/modal-termini-condizioni-investor.component';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { Action } from 'rxjs/internal/scheduler/Action';
import { StringifyOptions } from 'querystring';
@Component({
    selector: 'app-investor-governance',
    templateUrl: './investor-governance.component.html',
    styleUrls: ['./investor-governance.component.scss'],
    standalone: false
})
export class InvestorGovernanceComponent implements OnInit, OnDestroy {
  header : any;
  subtitle: any;
  body: any;
  textButton = true;
  isModalOpen: boolean;
  urlSafe: SafeResourceUrl;


  constructor(private sanitizer: DomSanitizer,
    private kenticoTranslateService: KenticoTranslateService,
    private modalService: NgbModal,
    public insurancesService: InsurancesService,
    public dataService: DataService)
    { }

  ngOnInit() {
    this.getContentFromKentico().subscribe();
    window.addEventListener('scroll', this.scrollTop, true);
  }

  private getContentFromKentico(): Observable<any> {

    return this.kenticoTranslateService.getItem('yolo_investor').pipe
      (take(1),map((contentItem: any) => {

        console.log(contentItem)

        this.header = {
          title: contentItem.header.value
        }
        this.subtitle = {
          value: contentItem.subtitle.value
        }
       this.body = {
         card_list: contentItem.body.value

       }

       let externalUrl = this.body.card_list[6].iframe_url.value;
       this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(externalUrl);
      }));
  }
  // When the user click on the button, open the modal
  showDoc() {
    let modal = document.getElementById("myModal");
    modal.style.display = "block";
  }
  // When the user click on <span> (x), close the modal
  closeDoc() {
    let modal = document.getElementById("myModal");
    modal.style.display = "none";
  }
  /* scroll top button */
  scrollTop($event) {
    const myButton = document.getElementById('scroll-btn');
    const doc = document.documentElement;
    const top = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);
    if (top > 800) {
      myButton.style.display = 'block';
    } else {
      myButton.style.display = 'none';
    }
  }

  /* SCROLL TO ELEMENT */
  scrollToSection( event:any){
    const elem = event;
    const section = elem.target.outerText.toLowerCase();
    const sectionsMenu = document.querySelectorAll('.link_nav_menu > .btn');
    sectionsMenu.forEach(el=> {
      el.classList.remove('active');
    })
    elem.srcElement.classList.add('active');
    document.getElementById(section).scrollIntoView({ behavior: 'smooth',block:'center'});
  }

  changeText(divContainer: string, className: string){
    let pElement = divContainer.replace('_divContainer', '');
    pElement = pElement + '_text';
    let idDivYear = divContainer.replace('_divContainer', '');
    let labelElement = divContainer.replace('_divContainer', '') + '_label';

    if(document.getElementById(labelElement).innerHTML == '+'){
      // expanded
      document.getElementById(labelElement).innerHTML = '-';
      document.getElementById(labelElement).style.color = '#fff';
      document.getElementById(divContainer).style.backgroundColor = '#4a90e2';
      document.getElementById(pElement).style.color = '#fff';

      // set collpase other container
      let listElements = document.getElementsByClassName(className);
      for (let i = 0; i < listElements.length; i++) {
        const element = listElements[i] as HTMLElement;
        if(element.id !== idDivYear){
          element.classList.remove("show");
          element.classList.add("collapse");
          document.getElementById(element.id + '_label').innerHTML = '+';
          document.getElementById(element.id + '_label').setAttribute('aria-expanded', 'false');
          document.getElementById(element.id + '_divContainer').style.backgroundColor = '#fff';
          document.getElementById(element.id + '_text').style.color = '#4a90e2';
          document.getElementById(element.id + '_label').style.color = '#4a90e2';
        } else {
          element.classList.add("show");
        }
      }

    } else {
      // collapse
      document.getElementById(labelElement).innerHTML = '+';
      document.getElementById(divContainer).style.backgroundColor = '#fff';
      document.getElementById(pElement).style.color = '#4a90e2';
      document.getElementById(labelElement).style.color = '#4a90e2';
      let listElements = document.getElementsByClassName(className);
      for (let i = 0; i < listElements.length; i++) {
        const element = listElements[i] as HTMLElement;
        if(element.id === idDivYear){
          element.classList.remove("show");
          element.classList.add("collapse");
        }
      }

    }
  }

  openModal(){
      const modalRef = this.modalService.open(ModalTerminiCondizioniInvestorComponent, {size: 'lg', backdropClass: 'backdrop-class ' + this.dataService.tenantInfo.main.layout, windowClass: 'modal-window'});
      (<ModalTerminiCondizioniInvestorComponent>modalRef.componentInstance).kenticoItem = this.body;
      modalRef.result.then(action =>{
        switch(action){
          case 'Acceptance':
            document.getElementById('myBtn').style.display = 'none';
            document.getElementById('myCard').style.display= 'block';
              break;
          default :
            document.getElementById('myBtn').style.display  = 'block';
            document.getElementById('myCard').style.display= 'none';
              break;
        }
      })
  }

  public isEmptyText(text: string) {
    return (text === '' || text === '<p><br></p>')? true : false
  }

  ngOnDestroy() {
    window.removeEventListener('scroll', this.scrollTop, true);
  }

}
