import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Flags, PRIVACY_FLAG_KIND } from '@model';
import { NypUserService } from '@NYP/ngx-multitenant-core';
import { AuthService, DataService } from '@services';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { take } from 'rxjs/operators';

@Component({
    selector: 'app-consent-form',
    templateUrl: './consent-form.component.html',
    styleUrls: ['./consent-form.component.scss', '../../modules/nyp-checkout/styles/checkout-forms.scss'],
    standalone: false
})
export class ConsentFormComponent implements OnInit {

  @Input() userConsent: any;
  @Input() showPrivacy: boolean;
  @Input() showOnlyFalseFlags: boolean;
  @Input() clearValues: boolean;
  @Input() enableCheckoutComponentFeaturesRules: boolean;
  @Input() showPrivacyAgreeSubtitle: boolean;
  @Output() emitFormValidity = new EventEmitter<boolean>();
  @Output() choosenConsentForm = new EventEmitter<{ tag: string, value: boolean }[]>();

  consentTitle: string = 'Consenso al trattamento dei dati per finalità ulteriori all’esecuzione del contratto:';
  privacyFlags: Flags[] = [];
  consentForm: UntypedFormGroup = new UntypedFormGroup({});
  answers = [{ "name": "Si", "value": true }, { "name": "No", "value": false }];

  constructor(
    protected nypUserService: NypUserService,
    public dataService: DataService,
    private authService: AuthService,
    private route: Router
  ) { }

  ngOnInit() {
    console.log(this.route.url)
    this.consentForm.valueChanges.pipe(untilDestroyed(this))
      .subscribe(form => {
        this.emitFormValidity.emit(this.consentForm.valid);

        const choosenConsent = Object.entries(form).map(([k, v]: [string, boolean]) => ({ tag: k, value: v }));
        this.choosenConsentForm.emit(choosenConsent);
      });

    this.nypUserService.getFlags(PRIVACY_FLAG_KIND, 'kind', this.dataService.getTenantUserProperties())
      .pipe(take(1))
      .subscribe(response => {
        this.privacyFlags = response
          .filter(flag => flag.forYIN)
        const userConsent = this.authService.currentUser.user_acceptances
        this.privacyFlags.forEach(pf =>
          this.consentForm.addControl(pf.tag,
            new UntypedFormControl(
              { value: userConsent.find(uc => uc.tag == pf.tag)?.value, disabled: pf.tag === 'privacyConsent' && this.route.url.includes('private-area') },
              (pf.mandatory ? Validators.requiredTrue : null),
            ))

        );
      });
  }

  shouldBeChecked(formControlName: string, answer) {
    const formControl = this.consentForm.controls[formControlName];
    return formControl && formControl.value === answer.value;
  }

  ngOnDestroy() { }
}
