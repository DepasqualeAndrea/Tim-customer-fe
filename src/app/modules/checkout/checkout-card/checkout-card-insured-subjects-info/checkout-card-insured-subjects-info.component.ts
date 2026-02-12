import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbCalendar, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { DataService } from '@services';
import moment from 'moment';
import {TimeHelper} from '../../../../shared/helpers/time.helper';

@Component({
  selector: 'app-checkout-card-insured-subjects-info',
  templateUrl: './checkout-card-insured-subjects-info.component.html',
  styleUrls: ['./checkout-card-insured-subjects-info.component.scss']
})
export class CheckoutCardInsuredSubjectsInfoComponent  implements OnInit, OnChanges {

  @Input() insuredSubjects: any;
  @Input() insuredIsContractor: boolean;
  @Input() minAge: number;
  @Input() numberOfSubjects: number;
  @Input() minAgeBirthDate: string;
  @Input() maxAgeBirthDate: string;
  @Input() minBirth: string = moment().subtract(64, 'year').format('DD/MM/YYYY');
  @Input() swapFieldsWarning = false;
  form: FormGroup;
  minBirthDate: NgbDateStruct;
  maxBirthDate: NgbDateStruct;
  othersInsuranceSubject: boolean;

  constructor(
    private formBuilder: FormBuilder,
    public dataService: DataService,
    public calendar: NgbCalendar,
  ) {
  }

  ngOnInit() {
    this.setDatepickerDates();
    this.buildForm();
    this.othersInsuranceSubject = true;
  }

  private buildForm(): void {
    if (this.insuredIsContractor == undefined) {
      this.insuredIsContractor = true;
    }
    this.form = this.formBuilder.group({
      contractorIsInsured: new FormControl(this.insuredIsContractor, Validators.nullValidator),
      insuredSubjects: this.formBuilder.array(this.createSubjects(
        this.numberOfSubjects,
        this.insuredIsContractor,
        this.insuredSubjects,
      ))
    });
    this.form.controls.contractorIsInsured.valueChanges.subscribe(isInsured => {
        this.handleContractorIsInsuredChange(isInsured);
    });
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

  public getFormSubjects(): FormArray {
    return this.form.controls.insuredSubjects as FormArray;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes.insuredIsContractor && !changes.insuredIsContractor.firstChange) ||
      (changes.numberOfSubjects && !changes.numberOfSubjects.firstChange) ||
      (changes.insuredSubjects && !changes.insuredSubjects.firstChange)) {
      this.form.patchValue({ insuredIsContractor: this.insuredIsContractor });
      const insuredSubjects: FormArray = <FormArray>this.form.controls.insuredSubjects;
      const ctrls: AbstractControl[] = this.createSubjects(
        this.numberOfSubjects,
        this.insuredIsContractor,
        this.insuredSubjects
      );
      this.cleanFormArray(insuredSubjects);
      ctrls.forEach(ctrl => insuredSubjects.push(ctrl));
    }
  }

  public computeModel(){
    return this.fromViewToModel(this.form);
  }

  public contractorIsInsured(): boolean {
    return this.form.controls.contractorIsInsured.value;
  }

  private createSubjects(numberOfSubjects: number, insuredIsContractor: boolean, insuredSubjects:any): AbstractControl[] {
    const n = insuredIsContractor ? numberOfSubjects - 1 : numberOfSubjects;
    if (insuredSubjects) {
      insuredSubjects = insuredSubjects.filter(subj => !subj.isContractor);
    }
    return new Array(n).fill(null).map((currentVal, index) => {
      return this.createInsuranceSubjectForm(insuredSubjects && insuredSubjects[index]);
    });
  }

  private fromViewToModel(form: FormGroup) {
    const subjects: FormArray = <FormArray>form.controls.insuredSubjects;
    const transformed: any[] = [];
    for (let i = 0; i < subjects.length; i++) {
      transformed.push(this.fromFormGroupToInsuredSubject(<FormGroup>subjects.at(i)));
    }
    return transformed;
  }

  private fromFormGroupToInsuredSubject(group: FormGroup): any {
    if(this.dataService.product.product_code === 'tim-for-ski-gold' || this.dataService.product.product_code === 'tim-for-ski-platinum' || this.dataService.product.product_code === 'tim-for-ski-silver'){
      const subject = {
        id: group.controls.id.value,
        firstName: group.controls.firstName.value,
        lastName: group.controls.lastName.value,
        birthDate: TimeHelper.fromNgbDateToDate(group.controls.birthDate.value)
      };
      return subject;
    }else{
      const subject = {
        familyRelationship: group.controls.familyRelationship.value,
        id: group.controls.id.value,
        firstName: group.controls.firstName.value,
        lastName: group.controls.lastName.value,
        birthDate: TimeHelper.fromNgbDateToDate(group.controls.birthDate.value)
      }
      return subject;
    }
  }

  private cleanFormArray(formArray: FormArray): void {
    while (formArray.length !== 0) {
      formArray.removeAt(0);
    }
  }

  private createInsuranceSubjectForm(insuranceSubject: any) {
   if(this.dataService.product.product_code === 'tim-for-ski-gold' || this.dataService.product.product_code === 'tim-for-ski-platinum' || this.dataService.product.product_code === 'tim-for-ski-silver'){
      const form = new FormGroup({
        id: new FormControl(insuranceSubject && insuranceSubject.id || null),
        firstName: new FormControl(insuranceSubject && insuranceSubject.firstName || undefined, [Validators.required, Validators.pattern('([a-zA-Zìèéòàù\']+\ *)+')]),
        lastName: new FormControl(insuranceSubject && insuranceSubject.lastName || undefined, [Validators.required, Validators.pattern('([a-zA-Zìèéòàù\']+\ *)+')]),
        birthDate: new FormControl(insuranceSubject && TimeHelper.fromDateToNgbDate(insuranceSubject.birthDate) || undefined, [Validators.required])
      });
      return form;
    } else {
      const form = new FormGroup({
        id: new FormControl(insuranceSubject && insuranceSubject.id || null),
        firstName: new FormControl(insuranceSubject && insuranceSubject.firstName || undefined, [Validators.required, Validators.pattern('([a-zA-Zìèéòàù\']+\ *)+')]),
        lastName: new FormControl(insuranceSubject && insuranceSubject.lastName || undefined, [Validators.required, Validators.pattern('([a-zA-Zìèéòàù\']+\ *)+')]),
        familyRelationship: new FormControl(insuranceSubject && insuranceSubject.familyRelationship || undefined, [Validators.required]),
        birthDate: new FormControl(insuranceSubject && TimeHelper.fromDateToNgbDate(insuranceSubject.birthDate) || undefined, [Validators.required])
      });
      return form;
    }
  }

  public handleContractorIsInsuredChange(isInsured: boolean): void {
    const array: FormArray = <FormArray>this.form.controls.insuredSubjects;
    if (!!isInsured) {
      this.othersInsuranceSubject = true;
      array.removeAt(array.length - 1);
    }
    if (!isInsured) {
      this.othersInsuranceSubject = false;
      if (array.length < this.numberOfSubjects) {
        array.push(this.createInsuranceSubjectForm(null));
      }
    }
  }

}
