import {Component, OnInit} from '@angular/core';
import {PreventivatoreAbstractComponent} from '../preventivatore-abstract/preventivatore-abstract.component';

@Component({
    selector: 'app-for-who-with-border',
    templateUrl: './for-who-with-border.component.html',
    styleUrls: ['./for-who-with-border.component.scss'],
    standalone: false
})
export class ForWhoWithBorderComponent extends PreventivatoreAbstractComponent implements OnInit {

  ngOnInit() {
  }

}
