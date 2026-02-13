import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'app-yolo-numbers',
    templateUrl: './yolo-numbers.component.html',
    styleUrls: ['./yolo-numbers.component.scss'],
    standalone: false
})
export class YoloNumbersComponent implements OnInit {

  cards: Array<{ image: string, title: string, description: string }> = [];

  @Input('numbers') numbers: { title: string, cards: Array<{ image: string, title: string, description: string }> };

  constructor() {
  }

  ngOnInit() {
  }

}
