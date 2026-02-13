import {Component, OnInit} from '@angular/core';
import {PreventivatoreAbstractComponent} from '../preventivatore-abstract/preventivatore-abstract.component';

@Component({
    selector: 'app-for-who-also-mobile',
    templateUrl: './for-who-also-mobile.component.html',
    styleUrls: ['./for-who-also-mobile.component.scss'],
    standalone: false
})
export class ForWhoAlsoMobileComponent extends PreventivatoreAbstractComponent implements OnInit {

  ngOnInit() {
  }

}
