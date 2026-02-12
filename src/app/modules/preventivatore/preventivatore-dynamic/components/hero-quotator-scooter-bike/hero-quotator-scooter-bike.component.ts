import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { PreventivatoreAbstractComponent } from '../preventivatore-abstract/preventivatore-abstract.component';
import { DataService } from '@services';

@Component({
  selector: 'app-hero-quotator-scooter-bike',
  templateUrl: './hero-quotator-scooter-bike.component.html',
  styleUrls: ['./hero-quotator-scooter-bike.component.scss']
})
export class HeroQuotatorScooterBikeComponent extends PreventivatoreAbstractComponent implements OnInit {

  constructor(ref: ChangeDetectorRef, public dataService:DataService){
    super(ref);
  }

  ngOnInit() {
  }

  sendActionEvent(action: any) {
    this.actionEvent.next(action);
  }

}
