import { Component, OnInit } from '@angular/core';
import { PreventivatoreAbstractComponent } from '../preventivatore-abstract/preventivatore-abstract.component';

@Component({
    selector: 'app-what-to-know-dropdown',
    templateUrl: './what-to-know-dropdown.component.html',
    styleUrls: ['./what-to-know-dropdown.component.scss'],
    standalone: false
})
export class WhatToKnowDropdownComponent extends PreventivatoreAbstractComponent implements OnInit {

  ngOnInit() {
  }

  toggleCollapse(accordion) {
    accordion.collapsed = !accordion.collapsed
  }

}
