import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-support-extra-info',
    templateUrl: './support-extra-info.component.html',
    styleUrls: ['./support-extra-info.component.scss'],
    standalone: false
})
export class SupportExtraInfoComponent implements OnInit {

  @Input() data;

  constructor() { }

  ngOnInit() {
  }

}
