import {Component, Input, OnInit} from '@angular/core';
import { DataService } from '@services';

@Component({
    selector: 'app-how-works-prev',
    templateUrl: './how-works-prev.component.html',
    styleUrls: ['./how-works-prev.component.scss'],
    standalone: false
})
export class HowWorksPrevComponent implements OnInit {

  @Input() productInformation;

  constructor(
    public dataService: DataService
  ) {}

  ngOnInit() {
  }

}
