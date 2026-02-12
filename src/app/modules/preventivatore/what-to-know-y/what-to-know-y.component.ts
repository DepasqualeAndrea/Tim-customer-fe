import {Component, Input, OnInit} from '@angular/core';
import { DataService } from '@services';

@Component({
  selector: 'app-what-to-know-y',
  templateUrl: './what-to-know-y.component.html',
  styleUrls: ['./what-to-know-y.component.scss']
})
export class WhatToKnowYComponent implements OnInit {

  @Input() productInformation;
  @Input() products;

  constructor(
    public dataService: DataService
  ) {}

  ngOnInit() {
  }

}
