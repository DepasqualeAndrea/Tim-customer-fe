import {Component, OnInit} from '@angular/core';
import {DataService} from '@services';

@Component({
    selector: 'app-cookies',
    templateUrl: './cookies.component.html',
    styleUrls: ['./cookies.component.scss'],
    standalone: false
})
export class CookiesComponent implements OnInit {

  constructor(
    public dataService: DataService
  ) {
  }

  ngOnInit() {
  }

}
