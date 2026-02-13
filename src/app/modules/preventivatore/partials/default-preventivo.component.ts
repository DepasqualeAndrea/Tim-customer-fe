import { Component, OnInit } from '@angular/core';

import { PreventivatoreComponent } from '../preventivatore/preventivatore.component';

@Component({
    selector: 'app-default-preventivo',
    templateUrl: './default-preventivo.component.html',
    styleUrls: ['../preventivatoreY.component.scss'],
    standalone: false
})
export class DefaultPreventivoComponent extends PreventivatoreComponent implements OnInit {

  // constructor(){
  //   super();
  // }

  ngOnInit() { }
}
