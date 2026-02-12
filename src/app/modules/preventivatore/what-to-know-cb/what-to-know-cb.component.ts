import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'app-what-to-know-cb',
  templateUrl: './what-to-know-cb.component.html',
  styleUrls: ['../preventivatoreCB.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class WhatToKnowCbComponent implements OnInit {

  @Input() productInformation;

  constructor() {
  }

  ngOnInit() {
  }

}
