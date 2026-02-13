import { Component, OnInit } from '@angular/core';
import { PreventivatoreAbstractComponent } from '../preventivatore-abstract/preventivatore-abstract.component';

@Component({
    selector: 'app-more-info-two-buttons',
    templateUrl: './more-info-two-buttons.component.html',
    styleUrls: ['./more-info-two-buttons.component.scss'],
    standalone: false
})
export class MoreInfoTwoButtonsComponent extends PreventivatoreAbstractComponent implements OnInit {

  ngOnInit() {
  }

}
