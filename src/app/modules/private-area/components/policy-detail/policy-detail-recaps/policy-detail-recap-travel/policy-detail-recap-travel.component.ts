import {Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {PolicyDetailRecapDynamicComponent} from '../policy-detail-recap-dynamic.component';
import {AuthService} from '@services';
import {Policy} from '../../../../private-area.model';
import {User} from '@model';
import * as moment from 'moment';

@Component({
    selector: 'app-policy-detail-recap-travel',
    templateUrl: './policy-detail-recap-travel.component.html',
    styleUrls: ['./policy-detail-recap-travel.component.scss'],
    standalone: false
})
export class PolicyDetailRecapTravelComponent extends PolicyDetailRecapDynamicComponent implements OnInit, OnChanges {

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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.insuredSubjects && !changes.insuredSubjects.firstChange) {
      this.insuredSubjects = this.convertInsuredSubjects(this.policy, this.auth.loggedUser);
    }
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
      is.push(...policy.insuredEntities.insurance_holders.map(ih => ({
        firstName: ih.first_name,
        lastName: ih.last_name,
        birthDate: moment(ih.birth_date, 'YYYY-MM-DD').toDate()
      })));
    }
    return is;
  }

}
