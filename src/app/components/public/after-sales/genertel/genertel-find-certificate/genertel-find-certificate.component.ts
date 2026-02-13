import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { InsurancesService } from '@services';
import { TimeHelper } from 'app/shared/helpers/time.helper';
import { ToastrService } from 'ngx-toastr';
import { CertificateFindPayload } from '../genertel-certificate-requests.model';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';

export const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'MMM YYYY',
    monthYearA11yLabel: 'MMM YYYY',
  },
};

@Component({
    selector: 'app-genertel-find-certificate',
    templateUrl: './genertel-find-certificate.component.html',
    styleUrls: ['./genertel-find-certificate.component.scss'],
    providers: [
        { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    ],
    standalone: false
})
export class GenertelFindCertificateComponent implements OnInit {
  content: any;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private insuranceService: InsurancesService,
    private toastService: ToastrService,
    private kenticoTranslateService: KenticoTranslateService,
    private dateAdapter: DateAdapter<any>
  ) { }

  form: UntypedFormGroup;

  ngOnInit() {
    this.form = this.createForm();
    this.getContent();
    this.dateAdapter.setLocale('it');
  }

  private createForm(): UntypedFormGroup {
    return this.formBuilder.group({
      taxcode: [null,  [Validators.required, Validators.pattern('^[a-zA-Z]{6}[0-9]{2}[abcdehlmprstABCDEHLMPRST]{1}[0-9]{2}([a-zA-Z]{1}[0-9]{3})[a-zA-Z]{1}$')]],
      email: [null, [ Validators.required, Validators.pattern('^(?=.{1,100}$)([a-zA-Z0-9.!#$%&*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?))*$')]],
      phone: [null,  Validators.compose([Validators.required, Validators.pattern('^[(+).0-9\]{7,15}$')])],
      date: [null, Validators.required]
    });
  }

  public findCertificate() {
    const payload = this.createContractFindPayload();
    this.insuranceService.genertelContractFind(payload).subscribe(data => {
      if (data.status === 'OK') {
        this.toastService.success(data.message);
        this.form.reset();
      } else {
        this.toastService.error(data.message);
      }
    });
  }

  private createContractFindPayload(): CertificateFindPayload {
    const payload = {
      ...this.form.value
    };
    payload.date = TimeHelper.formatNgbDate(payload.date);
    return payload;
  }

  public isFormValid(): boolean {
    return this.form.valid;
  }
  getContent(){
    this.kenticoTranslateService.getItem<any>('certificate_sci').subscribe((item) => this.content = item);
  }
}
