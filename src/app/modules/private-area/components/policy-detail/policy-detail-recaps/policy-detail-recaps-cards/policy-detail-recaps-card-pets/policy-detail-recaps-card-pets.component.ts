import {Component, Input, OnInit} from '@angular/core';
import {Policy} from '../../../../../private-area.model';

@Component({
  selector: 'app-policy-detail-recaps-card-pets',
  templateUrl: './policy-detail-recaps-card-pets.component.html',
  styleUrls: ['./policy-detail-recaps-card-pets.component.scss']
})
export class PolicyDetailRecapsCardPetsComponent implements OnInit {

  @Input() policy: Policy;

  constructor() { }

  ngOnInit() {
  }

}
