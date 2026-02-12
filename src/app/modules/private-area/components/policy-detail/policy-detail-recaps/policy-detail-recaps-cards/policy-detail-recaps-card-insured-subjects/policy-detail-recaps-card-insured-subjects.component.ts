import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-policy-detail-recaps-card-insured-subjects',
  templateUrl: './policy-detail-recaps-card-insured-subjects.component.html',
  styleUrls: ['./policy-detail-recaps-card-insured-subjects.component.scss']
})
export class PolicyDetailRecapsCardInsuredSubjectsComponent implements OnInit {

  @Input() insuredSubjects: Array<{
    firstName: string;
    lastName: string;
    birthDate: Date;
  }>;

  constructor() {
  }

  ngOnInit() {
  }

}
