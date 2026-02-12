import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { PreventivatoreAbstractComponent } from '../preventivatore-abstract/preventivatore-abstract.component';
import { DataService } from '@services';

@Component({
  selector: 'app-what-to-know-telemedicina',
  templateUrl: './what-to-know-telemedicina.component.html',
  styleUrls: ['./what-to-know-telemedicina.component.scss']
})
export class WhatToKnowTelemedicinaComponent extends PreventivatoreAbstractComponent implements OnInit {

  constructor(public dataService: DataService, ref: ChangeDetectorRef) {
    super(ref);
  }


  ngOnInit() {
  }

}
