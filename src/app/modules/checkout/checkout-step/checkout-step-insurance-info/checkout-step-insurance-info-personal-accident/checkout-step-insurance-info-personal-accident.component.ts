import { CheckoutFamilyRelationship } from './../checkout-step-insurance-info.model';
import { Component, OnInit } from '@angular/core';
import { CheckoutStepInsuranceInfoDynamicComponent } from '../checkout-step-insurance-info-dynamic-component';
import { CheckoutStepInsuranceInfoProduct, CheckoutInsuredSubject } from '../checkout-step-insurance-info.model';
import { Observable, of } from 'rxjs';
import { UntypedFormGroup, UntypedFormBuilder, UntypedFormControl, UntypedFormArray, Validators, AbstractControl } from '@angular/forms';

@Component({
    selector: 'app-checkout-step-insurance-info-personal-accident',
    templateUrl: './checkout-step-insurance-info-personal-accident.component.html',
    styleUrls: ['./checkout-step-insurance-info-personal-accident.component.scss'],
    standalone: false
})
export class CheckoutStepInsuranceInfoPersonalAccidentComponent extends CheckoutStepInsuranceInfoDynamicComponent implements OnInit {

  form: UntypedFormGroup;

  constructor(
    private formBuilder: UntypedFormBuilder
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
    const fg: UntypedFormGroup = new UntypedFormGroup({
      id: new UntypedFormControl(insuranceSubject && insuranceSubject.id || null),
      firstName: new UntypedFormControl(insuranceSubject && insuranceSubject.firstName || undefined, [Validators.required, Validators.pattern('([a-zA-Z]+\ *)+')]),
      lastName: new UntypedFormControl(insuranceSubject && insuranceSubject.lastName || undefined, [Validators.required, Validators.pattern('([a-zA-Z]+\ *)+')]),
      familyRelationship: new UntypedFormControl('other' as CheckoutFamilyRelationship),
    });
    return fg;
  }

  getFormSubjects(): UntypedFormArray {
    return this.form.controls.insuredSubjects as UntypedFormArray;
  }

  isFormValid(): boolean {
    return this.form.valid;
  }
  computeProduct(): CheckoutStepInsuranceInfoProduct {
    const insuredIsContractor = true;
    const insuredSubjects: CheckoutInsuredSubject[] = this.product.quantity === 1 ? [] : this.computeModel(this.form);
    return Object.assign({}, this.product, { insuredIsContractor, insuredSubjects });
  }

  fromViewToModel(form: UntypedFormGroup): CheckoutInsuredSubject {
    const subject = {
      firstName: form.controls.firstName.value,
      lastName: form.controls.lastName.value,
      familyRelationship: 'other' as CheckoutFamilyRelationship,
      id: form.controls.id.value
    };
    return subject;
  }

  computeModel(form: UntypedFormGroup): CheckoutInsuredSubject[] {
    const subjects: UntypedFormArray = <UntypedFormArray>form.controls.insuredSubjects;
    const transformed: CheckoutInsuredSubject[] = [];
    for (let i = 0; i < subjects.length; i++) {
      transformed.push(this.fromViewToModel(<UntypedFormGroup>subjects.at(i)));
    }
    return transformed;
  }

  onBeforeNextStep(): Observable<any> {
    return of(null);
  }

}
