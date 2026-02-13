import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'app-what-to-know-ct',
    templateUrl: './what-to-know-ct.component.html',
    styleUrls: ['../preventivatoreCT.component.scss'],
    standalone: false
})
export class WhatToKnowCtComponent implements OnInit {

  @Input() productInformation;

  constructor() {
  }

  ngOnInit() {
  }

}
