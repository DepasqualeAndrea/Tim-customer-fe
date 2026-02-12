import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PolicyDetailModal } from 'app/modules/private-area/components/policy-detail/model/policy-detail-modal.model';
import { ContentItem } from 'kentico-cloud-delivery';

@Component({
  selector: 'app-screen-protection-ask-withdrawal-modal',
  templateUrl: './screen-protection-ask-withdrawal-modal.component.html',
  styleUrls: ['./screen-protection-ask-withdrawal-modal.component.scss']
})
export class ScreenProtectionAskWithdrawalModalComponent implements OnInit {

  form: FormGroup;
  regexImei = '^\\d{15}(,\\d{15})*$';
  regexIbanBancario = '^IT\\d{2}[A-Z]{1}\\d{10}[A-Z0-9]{12}$';
  @Input() content: ContentItem;

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
 ) {}

  ngOnInit() {
    this.initFormInitial();
  }
  initFormInitial() {
    this.form = this.formBuilder.group({
      numberCoupon: ['', Validators.required],
      imei: ['', [ Validators.required, Validators.minLength(15), Validators.pattern(this.regexImei)]],
      ibanBancario: ['', [Validators.required, Validators.pattern(this.regexIbanBancario)]]
    });
  }
  getErrorFieldClass(formControlName: string): string {
    if (this.getFieldInvalidError(formControlName)) {
      if (this.getFieldError(formControlName, 'required') ||
        this.getFieldError(formControlName, 'pattern') ||
        this.getFieldError(formControlName, 'maxlength')) {
        return 'error-field';
      }
    }
  }

  getFieldInvalidError(formControlName: string): boolean {
    return this.form.get(formControlName).invalid &&
      (this.form.get(formControlName).touched || this.form.get(formControlName).dirty);
  }
  getFieldError(formControlName: string, errorType: string): boolean {
    return this.form.get(formControlName).errors && this.form.get(formControlName).errors[errorType];
  }

  closeModal(){
    const response: PolicyDetailModal = {
      promotion_code: this.form.get("numberCoupon").value,
      covercare_imei: this.form.get("imei").value,
      iban: this.form.get("ibanBancario").value
    }
    this.activeModal.close(response);
  }

}
