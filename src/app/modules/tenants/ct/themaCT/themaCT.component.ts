import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-header-thema-ct',
  templateUrl: './themaCT.component.html',
  styleUrls: ['./themaCT.component.scss'],
})
export class HeaderThemaCTComponent implements OnInit {

  @Input() product;
  constructor() {}

  ngOnInit() {
  }
}
