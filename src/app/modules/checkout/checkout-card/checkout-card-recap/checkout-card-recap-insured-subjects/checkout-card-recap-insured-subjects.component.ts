import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { User } from '@model';
import { AuthService, UserService } from '@services';
import { CheckoutInsuredSubject } from '../../../checkout-step/checkout-step-insurance-info/checkout-step-insurance-info.model';
import { NypUserService } from '@NYP/ngx-multitenant-core';

@Component({
    selector: 'app-checkout-card-recap-insured-subjects',
    templateUrl: './checkout-card-recap-insured-subjects.component.html',
    styleUrls: ['./checkout-card-recap-insured-subjects.component.scss'],
    standalone: false
})
export class CheckoutCardRecapInsuredSubjectsComponent implements OnInit, OnChanges {

  @Input() insuredSubjects: CheckoutInsuredSubject[];
  @Input() boxCollapse: boolean;
  @Input() title: string = null;

  insuredBoxCollapsed: boolean;
  noCollapseProduct: any;
  user: User;

  constructor(
    private authService: AuthService,
    protected nypUserService: NypUserService
  ) {
  }

  ngOnInit() {
    this.getUser();
  }

  ngOnChanges() {
    this.removeMockUser();
  }

  private getUser(): void {
    const user = this.authService.loggedUser;
    if (!!user.id) {
      this.nypUserService.getUserDetails(user.id).subscribe(user => {
        this.user = user;
        if (this.user.sso_address) {
          if (this.user.is_same_address) {
            this.insuredSubjects = this.insuredSubjects.filter(function (obj) {
              return obj.firstName !== user.sso_address.firstname;
            });
          }
          this.insuredSubjects.filter(function (obj) {
            if (obj.firstName === user.sso_address.firstname) {
              obj.firstName = user.address.firstname
              obj.lastName = user.address.lastname;
            };
          });
        }
      });
    }
  }

  private removeMockUser(): void {
    const user = this.authService.loggedUser;
    if (!!user.id && this.insuredSubjects.length > 0) {
      for (const subject of this.insuredSubjects) {
        if (subject.firstName === 'YoloSportMockFirstName' && subject.lastName === 'YoloSportMockLastName') {
          this.insuredSubjects.pop()
          this.insuredSubjects.push({
            id: this.authService.loggedUser.id,
            familyRelationship: "other",
            firstName: this.authService.loggedUser.firstname,
            lastName: this.authService.loggedUser.lastname,
            birthDate: new Date(this.authService.loggedUser.birth_date)
          })
        }
      }
    }
  }

}
