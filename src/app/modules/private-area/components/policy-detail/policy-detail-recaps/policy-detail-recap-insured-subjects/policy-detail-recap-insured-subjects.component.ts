import {Component, OnInit} from '@angular/core';
import {PolicyDetailRecapDynamicComponent} from '../policy-detail-recap-dynamic.component';
import {Policy} from '../../../../private-area.model';
import * as moment from 'moment';
import {User} from '@model';
import {AuthService} from '@services';

@Component({
  selector: 'app-policy-detail-recap-insured-subjects',
  templateUrl: './policy-detail-recap-insured-subjects.component.html',
  styleUrls: ['./policy-detail-recap-insured-subjects.component.scss']
})
export class PolicyDetailRecapInsuredSubjectsComponent extends PolicyDetailRecapDynamicComponent implements OnInit {

  insuredSubjects: Array<{
    firstName: string;
    lastName: string;
    birthDate: Date;
  }>;

  constructor(private auth: AuthService) {
    super();
  }

  ngOnInit() {
    this.insuredSubjects = this.convertInsuredSubjects(this.policy, this.auth.loggedUser);
  }

  convertInsuredSubjects(policy: Policy, user: User) {
    const is = new Array<{ firstName: string; lastName: string; birthDate: Date; }>();
    if (policy.insured_is_contractor) {
      is.push({
        firstName: user.address.firstname,
        lastName: user.address.lastname,
        birthDate: moment(user.address.birth_date, 'YYYY-MM-DD').toDate()
      });
    }
    if (policy.insuredEntities && policy.insuredEntities.insurance_holders) {
      policy.insuredEntities.insurance_holders.sort(this.compareInsuranceHoldersID);
      is.push(...policy.insuredEntities.insurance_holders.map(ih => ({
        firstName: ih.first_name || ih.firstname,
        lastName: ih.last_name || ih.lastname,
        birthDate: moment(ih.birth_date, 'YYYY-MM-DD').toDate()
      })));
    }
    return is;
  }

  // Function to compare two objects by comparing their `id` property.
  compareInsuranceHoldersID = (a, b) => (a.id - b.id);
}
