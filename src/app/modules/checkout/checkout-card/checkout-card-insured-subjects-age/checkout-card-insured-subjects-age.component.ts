import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { AbstractControl, UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { OrderAttributes } from '@model';
import { NgbCalendar, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { DataService } from '@services';
import { TimeHelper } from 'app/shared/helpers/time.helper';
import moment from 'moment';
import { CheckoutInsuredSubject } from '../../checkout-step/checkout-step-insurance-info/checkout-step-insurance-info.model';

@Component({
    selector: 'app-checkout-card-insured-subjects-age',
    templateUrl: './checkout-card-insured-subjects-age.component.html',
    styleUrls: ['./checkout-card-insured-subjects-age.component.scss'],
    standalone: false
})
export class CheckoutCardInsuredSubjectsAgeComponent implements OnInit {

  @Input()
  subjectsByAge: OrderAttributes;

  @Input()
  insuredSubjects: CheckoutInsuredSubject[];

  @Input()
  insuredIsContractor: boolean;

  @Input()
  minAge: number;

  @Input()
  minAgeBirthDate: string;

  @Input()
  maxAgeBirthDate: string;

  @Input()
  minBirth: string = moment().subtract(64, 'year').format('DD/MM/YYYY');

  form: UntypedFormGroup;
  minBirthDate: NgbDateStruct;
  maxBirthDate: NgbDateStruct;
  othersInsuranceSubject: boolean;
  insureContractorRadioSelected: boolean = false;

  constructor(
    private formBuilder: UntypedFormBuilder,
    public dataService: DataService,
    public calendar: NgbCalendar
  ) {}

  ngOnInit() {
    this.setDatepickerDates();
    this.buildForm();

    if(this.insuredIsContractor){
      this.form.markAsTouched();
    }
  }

  private buildForm(): void {
    this.form = this.formBuilder.group({
      contractorIsInsured: new UntypedFormControl(this.insuredIsContractor),
      insuredSubjects: this.formBuilder.array(this.createSubjects(
        this.subjectsByAge,
        this.insuredIsContractor,
        this.insuredSubjects
      ))
    });
    this.form.controls.contractorIsInsured.valueChanges.subscribe(isInsured => {
      this.handleContractorIsInsuredChange(isInsured)
    })
  }

  private setDatepickerDates(): void {
    this.maxBirthDate = this.minAgeBirthDate ? {
      day: +moment(this.minAgeBirthDate, 'DD/MM/YYYY').format('DD'),
      month: +moment(this.minAgeBirthDate, 'DD/MM/YYYY').format('MM'),
      year: +moment(this.minAgeBirthDate, 'DD/MM/YYYY').format('YYYY'),
    } : this.calendar.getToday();
    this.minBirthDate = {
      day: +moment(this.maxAgeBirthDate ? this.maxAgeBirthDate : this.minBirth, 'DD/MM/YYYY').format('DD'),
      month: +moment(this.maxAgeBirthDate ? this.maxAgeBirthDate : this.minBirth, 'DD/MM/YYYY').format('MM'),
      year: +moment(this.maxAgeBirthDate ? this.maxAgeBirthDate : this.minBirth, 'DD/MM/YYYY').format('YYYY'),
    };
  }

  public getNumberOfSubjects(): number {
      return Object.values(this.subjectsByAge).reduce((acc, curr) => {
        return acc += curr;
      }, 0)
  }

  public getFormSubjects(): UntypedFormArray {
    return this.form.controls.insuredSubjects as UntypedFormArray;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes.insuredIsContractor && !changes.insuredIsContractor.firstChange) ||
      (changes.subjectsByAge && !changes.subjectsByAge.firstChange) ||
      (changes.insuredSubjects && !changes.insuredSubjects.firstChange)) {
      this.form.patchValue({ insuredIsContractor: this.insuredIsContractor });
      const insuredSubjects: UntypedFormArray = <UntypedFormArray>this.form.controls.insuredSubjects;
      const ctrls: AbstractControl[] = this.createSubjects(
        this.subjectsByAge,
        this.insuredIsContractor,
        this.insuredSubjects
      );
      this.cleanFormArray(insuredSubjects);
      ctrls.forEach(ctrl => insuredSubjects.push(ctrl));
    }
  }

  public computeModel(): CheckoutInsuredSubject[] {
    return this.fromViewToModel(this.form);
  }

  public contractorIsInsured(): boolean {
    return this.form.controls.contractorIsInsured.value;
  }

  private createSubjects(subjectsByAge: OrderAttributes,
    insuredIsContractor: boolean,
    insuredSubjects: CheckoutInsuredSubject[]): AbstractControl[] {
    const numberOfSubjects = this.getNumberOfSubjects();
    const insuredSubjectsNumber = insuredIsContractor ? numberOfSubjects - 1 : numberOfSubjects;
    if (insuredSubjects) {
      insuredSubjects = insuredSubjects.filter(subj => !subj.isContractor);
    }
    return new Array(insuredSubjectsNumber).fill(null).map((currentVal, index) => {
      return this.createInsuranceSubjectForm(insuredSubjects && insuredSubjects[index]);
    });
  }

  private fromViewToModel(form: UntypedFormGroup): CheckoutInsuredSubject[] {
    const subjects: UntypedFormArray = <UntypedFormArray>form.controls.insuredSubjects;
    const transformed: CheckoutInsuredSubject[] = [];
    for (let i = 0; i < subjects.length; i++) {
      transformed.push(this.fromFormGroupToInsuredSubject(<UntypedFormGroup>subjects.at(i)));
    }
    return transformed;
  }

  private fromFormGroupToInsuredSubject(group: UntypedFormGroup): CheckoutInsuredSubject {
    const subject = {
      familyRelationship: group.controls.familyRelationship.value,
      id: group.controls.id.value,
      firstName: group.controls.firstName.value,
      lastName: group.controls.lastName.value,
      birthDate: TimeHelper.fromNgbDateToDate(group.controls.birthDate.value)
    };
    return subject;
  }

  private cleanFormArray(formArray: UntypedFormArray): void {
    while (formArray.length !== 0) {
      formArray.removeAt(0);
    }
  }

  private createInsuranceSubjectForm(insuranceSubject: CheckoutInsuredSubject) {
    const form = new UntypedFormGroup({
      id: new UntypedFormControl(insuranceSubject && insuranceSubject.id || null),
      firstName: new UntypedFormControl(insuranceSubject && insuranceSubject.firstName || undefined, [Validators.required, Validators.pattern('([a-zA-Zìèéòàù\']+\ *)+')]),
      lastName: new UntypedFormControl(insuranceSubject && insuranceSubject.lastName || undefined, [Validators.required, Validators.pattern('([a-zA-Zìèéòàù\']+\ *)+')]),
      familyRelationship: new UntypedFormControl(insuranceSubject && insuranceSubject.familyRelationship),
      birthDate: new UntypedFormControl(insuranceSubject && insuranceSubject.birthDate)
    });
    return form;
  }

  public handleContractorIsInsuredChange(isInsured: boolean): void {
    const array: UntypedFormArray = <UntypedFormArray>this.form.controls.insuredSubjects;
    if (!!isInsured) {
        this.othersInsuranceSubject = true;
        array.removeAt(array.length - 1);
    } 
    if(!isInsured && this.form.touched) {
      this.othersInsuranceSubject = false;
      array.push(this.createInsuranceSubjectForm(null));
    }
  }

  checkInsuredSubject(): boolean
  {
    return (this.form.value.contractorIsInsured === false || (this.getFormSubjects().controls.length >= 1 && this.insureContractorRadioSelected));
  }

  insureContractorRadio(){
    this.insureContractorRadioSelected = true;
  }

}
