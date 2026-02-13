import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-support-body',
    templateUrl: './support-body.component.html',
    styleUrls: ['./support-body.component.scss'],
    standalone: false
})
export class SupportBodyComponent implements OnInit {

  @Input() data;

  constructor() { }

  ngOnInit() {
  }

}
