import { AfterViewInit, ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { DataService } from '@services';
import { Observable, of } from 'rxjs';
import { PreventivatoreAbstractComponent } from '../preventivatore-abstract/preventivatore-abstract.component';

@Component({
    selector: 'app-bg-img-hero',
    templateUrl: './bg-img-hero.component.html',
    styleUrls: ['./bg-img-hero.component.scss'],
    standalone: false
})
export class BgImgHeroComponent extends PreventivatoreAbstractComponent implements OnInit, AfterViewInit, OnDestroy {

  isWinterSportValue = false;

  constructor(ref: ChangeDetectorRef, public dataService: DataService){super(ref)}

  ngOnInit() {
    this.isWinterSport();
  }

  ngAfterViewInit(){
    if(this.isWinterSportValue){
      document.addEventListener('click', () => this.setPremium())
    }
  }

  ngOnDestroy(){
    document.removeEventListener('click', () => this.setPremium())
  }

  sendActionEvent(action: any) {
    if(((this.dataService.tenantInfo.tenant === 'banca-sella_db' || this.dataService.tenantInfo.tenant === 'yolodb') && action.payload.product.product_code === 'ge-ski-premium') || action.payload.product.product_code === 'winter-sport-premium'){
      let htmlElement = document.getElementById('hero');
      htmlElement.classList.add('premium')
    }
    this.actionEvent.next(action);
  }

  private setPremium() : EventListener {
    if(document.getElementById('tab-ge-ski-premium')?.ariaSelected === 'true' || document.getElementById('tab-winter-sport-premium')?.ariaSelected === 'true'){
      document.getElementById('breadcrumb').classList.add('premium');
      document.getElementById('hero').classList.add('premium');
    }else{
      document.getElementById('breadcrumb')?.classList?.remove('premium');
      document.getElementById('hero')?.classList?.remove('premium');
    }
    return
  }

  isWinterSport() {
    this.data.container_class.forEach(element => {
      if(element === 'winter-sport-plus' || element === 'winter-sport-premium' || (this.dataService.tenantInfo === 'banca-sella_db' && (element === 'ge-ski-plus' || element === 'ge-ski-plus'))){
        this.isWinterSportValue = true;
      }
    });
  }

}
