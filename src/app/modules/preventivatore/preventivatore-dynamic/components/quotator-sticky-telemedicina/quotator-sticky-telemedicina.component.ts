import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-quotator-sticky-telemedicina',
  templateUrl: './quotator-sticky-telemedicina.component.html',
  styleUrls: ['./quotator-sticky-telemedicina.component.scss']
})
export class QuotatorStickyTelemedicinaComponent implements OnInit {

  constructor() { }

  @Input() textForButton: string;
  @Input() productName: string = '';

  ngOnInit() {
  }

  scrollToTop() {
    window.scrollTo(0, 0);
  }
}
