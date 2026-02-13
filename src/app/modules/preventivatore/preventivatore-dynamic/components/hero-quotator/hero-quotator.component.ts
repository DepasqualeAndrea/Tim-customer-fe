import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import { PreventivatoreAbstractComponent } from '../preventivatore-abstract/preventivatore-abstract.component';
import { DataService } from '@services';

@Component({
    selector: 'app-hero-quotator',
    templateUrl: './hero-quotator.component.html',
    styleUrls: ['./hero-quotator.component.scss'],
    standalone: false
})
export class HeroQuotatorComponent extends PreventivatoreAbstractComponent implements OnInit {

  hideSticky: number;

  constructor(ref: ChangeDetectorRef, public dataService:DataService){
    super(ref);
  }

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

  sendActionEvent(action: any) {
    this.actionEvent.next(action);
  }

  scrollHeight() {
    return document.documentElement.scrollTop;
  }

}
