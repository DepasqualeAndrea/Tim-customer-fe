import {Component, OnInit} from '@angular/core';
import {DataService} from '@services';

@Component({
    selector: 'app-privacy',
    templateUrl: './privacy.component.html',
    styleUrls: ['./privacy.component.scss'],
    standalone: false
})
export class PrivacyComponent implements OnInit {

  constructor(
    public dataService: DataService
  ) {
  }

  ngOnInit() {
  }

}
