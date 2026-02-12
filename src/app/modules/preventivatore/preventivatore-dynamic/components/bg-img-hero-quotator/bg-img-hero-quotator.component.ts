import { Component, OnInit } from '@angular/core';
import { PreventivatoreAbstractComponent } from '../preventivatore-abstract/preventivatore-abstract.component';

@Component({
  selector: 'app-bg-img-hero-quotator',
  templateUrl: './bg-img-hero-quotator.component.html',
  styleUrls: ['./bg-img-hero-quotator.component.scss']
})
export class BgImgHeroQuotatorComponent extends PreventivatoreAbstractComponent implements OnInit {

 

  ngOnInit() {
  }

  sendActionEvent(action: any) {
    this.actionEvent.next(action);
  }

}
