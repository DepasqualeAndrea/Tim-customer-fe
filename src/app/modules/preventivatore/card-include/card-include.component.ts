import { Component, OnInit } from '@angular/core';
import { PreventivatoreComponent } from '../preventivatore/preventivatore.component';

@Component({
  selector: 'app-card-include',
  templateUrl: './card-include.component.html',
  styleUrls: ['./card-include.component.scss']
})
export class CardIncludeComponent extends PreventivatoreComponent implements OnInit {

  ngOnInit() {
  }

}
