import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-support-faq',
    templateUrl: './support-faq.component.html',
    styleUrls: ['./support-faq.component.scss'],
    standalone: false
})
export class SupportFaqComponent implements OnInit {

  @Input() data;

  constructor() { }

  ngOnInit() {
  }

}
