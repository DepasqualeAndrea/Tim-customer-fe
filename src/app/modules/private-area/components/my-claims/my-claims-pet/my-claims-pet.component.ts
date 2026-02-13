import { Component, Input, OnInit } from '@angular/core';
import * as moment from 'moment';

@Component({
    selector: 'app-my-claims-pet',
    templateUrl: './my-claims-pet.component.html',
    styleUrls: ['./my-claims-pet.component.scss'],
    standalone: false
})
export class MyClaimsPetComponent implements OnInit {

  @Input()data: any;

  constructor() { }

  ngOnInit() {
  }

  getDateCreatedClaim (date: string): string {
    return moment(date).format('DD/MM/YYYY');
  }

}
