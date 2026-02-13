import { Component, OnInit, ChangeDetectorRef, DoCheck } from '@angular/core';
import { DataService } from '@services';
import { PreventivatoreAbstractComponent } from '../preventivatore-abstract/preventivatore-abstract.component';

@Component({
    selector: 'app-telemedicina-hero-quotator',
    templateUrl: './telemedicina-hero-quotator.component.html',
    styleUrls: ['./telemedicina-hero-quotator.component.scss'],
    standalone: false
})
export class TelemedicinaHeroQuotatorComponent extends PreventivatoreAbstractComponent implements OnInit, DoCheck {

  hideSticky: number;

  constructor(ref: ChangeDetectorRef, public dataService: DataService) {
    super(ref);
  }

  selectedPrice: number;

  ngOnInit() {
  }


  ngDoCheck() {
    if (document.documentElement.scrollWidth < 400 && document.documentElement.scrollWidth > 350) {
      this.hideSticky = 2800;
    }
    else if (document.documentElement.scrollWidth < 350) {
      this.hideSticky = 3100;
    }
    else {
      this.hideSticky = 2540;
    }
  }

  printPrice(price){
    this.selectedPrice = price;
  }

  sendActionEvent(action: any) {
    this.actionEvent.next(action);
  }

  scrollHeight() {
    return document.documentElement.scrollTop;
  }

}
