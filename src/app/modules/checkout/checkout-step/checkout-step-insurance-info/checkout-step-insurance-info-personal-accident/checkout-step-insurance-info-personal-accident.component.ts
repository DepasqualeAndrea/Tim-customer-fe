import { CheckoutFamilyRelationship } from './../checkout-step-insurance-info.model';
import { Component, OnInit } from '@angular/core';
import { CheckoutStepInsuranceInfoDynamicComponent } from '../checkout-step-insurance-info-dynamic-component';
import { CheckoutStepInsuranceInfoProduct, CheckoutInsuredSubject } from '../checkout-step-insurance-info.model';
import { Observable, of } from 'rxjs';
import { FormGroup, FormBuilder, FormControl, FormArray, Validators, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-checkout-step-insurance-info-personal-accident',
  templateUrl: './checkout-step-insurance-info-personal-accident.component.html',
  styleUrls: ['./checkout-step-insurance-info-personal-accident.component.scss']
})
export class CheckoutStepInsuranceInfoPersonalAccidentComponent extends CheckoutStepInsuranceInfoDynamicComponent implements OnInit {

  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder
  ) {
    super();
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      insuredSubjects: this.formBuilder.array(this.createSubjects(this.product.quantity, this.product.insuredSubjects))
    });
  }

  createSubjects(numberOfSubjects: number, insuredSubjects: CheckoutInsuredSubject[]): AbstractControl[] {
    insuredSubjects = insuredSubjects.filter(subj => !subj.isContractor);
    return new Array(numberOfSubjects - 1).fill(null).map((_, index) => {
      return this.createInsuranceSubjectItem(
        insuredSubjects && insuredSubjects[index]
      );
    });
  }

  private createInsuranceSubjectItem(insuranceSubject: CheckoutInsuredSubject) {
    const fg: FormGroup = new FormGroup({
      id: new FormControl(insuranceSubject && insuranceSubject.id || null),
      firstName: new FormControl(insuranceSubject && insuranceSubject.firstName || undefined, [Validators.required, Validators.pattern('([a-zA-Z]+\ *)+')]),
      lastName: new FormControl(insuranceSubject && insuranceSubject.lastName || undefined, [Validators.required, Validators.pattern('([a-zA-Z]+\ *)+')]),
      familyRelationship: new FormControl('other' as CheckoutFamilyRelationship),
    });
    return fg;
  }

  getFormSubjects(): FormArray {
    return this.form.controls.insuredSubjects as FormArray;
  }

  isFormValid(): boolean {
    return this.form.valid;
  }
  computeProduct(): CheckoutStepInsuranceInfoProduct {
    const insuredIsContractor = true;
    const insuredSubjects: CheckoutInsuredSubject[] = this.product.quantity === 1 ? [] : this.computeModel(this.form);
    return Object.assign({}, this.product, { insuredIsContractor, insuredSubjects });
  }

  fromViewToModel(form: FormGroup): CheckoutInsuredSubject {
    const subject = {
      firstName: form.controls.firstName.value,
      lastName: form.controls.lastName.value,
      familyRelationship: 'other' as CheckoutFamilyRelationship,
      id: form.controls.id.value
    };
    return subject;
  }

  computeModel(form: FormGroup): CheckoutInsuredSubject[] {
    const subjects: FormArray = <FormArray>form.controls.insuredSubjects;
    const transformed: CheckoutInsuredSubject[] = [];
    for (let i = 0; i < subjects.length; i++) {
      transformed.push(this.fromViewToModel(<FormGroup>subjects.at(i)));
    }
    return transformed;
  }

  onBeforeNextStep(): Observable<any> {
    return of(null);
  }

}
