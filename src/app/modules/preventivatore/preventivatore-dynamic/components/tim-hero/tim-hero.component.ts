import { Component, OnInit } from '@angular/core';
import { PreventivatoreAbstractComponent } from '../preventivatore-abstract/preventivatore-abstract.component';

@Component({
    selector: 'app-tim-hero',
    templateUrl: './tim-hero.component.html',
    styleUrls: ['./tim-hero.component.scss'],
    standalone: false
})
export class TimHeroComponent extends PreventivatoreAbstractComponent implements OnInit {

  ngOnInit() {
  }

}
