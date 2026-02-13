import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PreventivatoreComponent } from '../preventivatore/preventivatore.component';

@Component({
    selector: 'app-included',
    templateUrl: './included.component.html',
    styleUrls: ['./included.component.scss'],
    standalone: false
})
export class IncludedComponent extends PreventivatoreComponent implements OnInit {

  ngOnInit() {
    console.log('included');
  }

}
