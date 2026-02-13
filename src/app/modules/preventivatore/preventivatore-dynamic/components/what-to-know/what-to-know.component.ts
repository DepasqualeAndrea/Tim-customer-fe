import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DataService } from '@services';
import { PreventivatoreAbstractComponent } from '../preventivatore-abstract/preventivatore-abstract.component';

@Component({
    selector: 'app-what-to-know',
    templateUrl: './what-to-know.component.html',
    styleUrls: ['./what-to-know.component.scss'],
    standalone: false
})
export class WhatToKnowComponent extends PreventivatoreAbstractComponent implements OnInit {

  constructor(ref: ChangeDetectorRef, public dataService: DataService){
    super(ref)
  }

  ngOnInit() {
  }

  sendActionEvent(action: any) {
    this.actionEvent.next(action);
  }

}
