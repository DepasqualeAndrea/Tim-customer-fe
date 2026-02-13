import {Component, OnInit} from '@angular/core';
import {PreventivatoreAbstractComponent} from '../preventivatore-abstract/preventivatore-abstract.component';

@Component({
    selector: 'app-for-who',
    templateUrl: './for-who.component.html',
    styleUrls: ['./for-who.component.scss'],
    standalone: false
})
export class ForWhoComponent extends PreventivatoreAbstractComponent implements OnInit {

  ngOnInit() {
  }

}
