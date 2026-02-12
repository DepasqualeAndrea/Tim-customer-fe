import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { InsurancesService } from '@services';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { TimeHelper } from 'app/shared/helpers/time.helper';
import { ToastrService } from 'ngx-toastr';
import { CertificateCorrectionPayload } from '../genertel-certificate-requests.model';

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
  selector: 'app-genertel-certificate-correction',
  templateUrl: './genertel-certificate-correction.component.html',
  styleUrls: ['./genertel-certificate-correction.component.scss'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class GenertelCertificateCorrectionComponent implements OnInit {
  content: any;

  constructor(
    private formBuilder: FormBuilder,
    private insuranceService: InsurancesService,
    private toastService: ToastrService,
    private kenticoTranslateService: KenticoTranslateService,
    private dateAdapter: DateAdapter<any>
  ) { }

  form: FormGroup;

  ngOnInit() {
    this.form = this.createForm();
    this.getContent();
    this.dateAdapter.setLocale('it');
  }

  private createForm(): FormGroup {
    return this.formBuilder.group({
      taxcode: [null,  [Validators.required, Validators.pattern('^[a-zA-Z]{6}[0-9]{2}[abcdehlmprstABCDEHLMPRST]{1}[0-9]{2}([a-zA-Z]{1}[0-9]{3})[a-zA-Z]{1}$')]],
      policy_number: [null, Validators.nullValidator],
      email: [null, [ Validators.required, Validators.pattern('^(?=.{1,100}$)([a-zA-Z0-9.!#$%&*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?))*$')]],
      phone: [null,  Validators.compose([Validators.required, Validators.pattern('^[(+).0-9\]{7,15}$')])],
      date: [null, Validators.required],
      message: [null, Validators.required],
    });
  }

  public correction() {
    const payload = this.createContractCorrectionPayload();
    this.insuranceService.genertelContractCorrection(payload).subscribe( data => {
      this.toastService.success(data.message);
      this.form.reset();
    }, error => {
      this.toastService.error(error);
    });
  }

  private createContractCorrectionPayload(): CertificateCorrectionPayload {
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
