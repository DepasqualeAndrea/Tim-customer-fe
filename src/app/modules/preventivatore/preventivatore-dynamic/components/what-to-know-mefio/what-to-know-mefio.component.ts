import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DataService } from '@services';
import { PreventivatoreAbstractComponent } from '../preventivatore-abstract/preventivatore-abstract.component';

@Component({
    selector: 'app-what-to-know-mefio',
    templateUrl: './what-to-know-mefio.component.html',
    styleUrls: ['./what-to-know-mefio.component.scss'],
    standalone: false
})
export class WhatToKnowMefioComponent extends PreventivatoreAbstractComponent implements OnInit {

  constructor(public dataService: DataService, ref: ChangeDetectorRef) {
    super(ref);
  }


  ngOnInit() {
  }

}
