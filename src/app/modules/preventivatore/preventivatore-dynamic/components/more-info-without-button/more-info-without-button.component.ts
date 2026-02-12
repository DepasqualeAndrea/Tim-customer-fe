import { Component, OnInit } from '@angular/core';
import { PreventivatoreAbstractComponent } from '../preventivatore-abstract/preventivatore-abstract.component';

@Component({
  selector: 'app-more-info-without-button',
  templateUrl: './more-info-without-button.component.html',
  styleUrls: ['./more-info-without-button.component.scss']
})
export class MoreInfoWithoutButtonComponent extends PreventivatoreAbstractComponent implements OnInit {

  ngOnInit() {
  }

}
