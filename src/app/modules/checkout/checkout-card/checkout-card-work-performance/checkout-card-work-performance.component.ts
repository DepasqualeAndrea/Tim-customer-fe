import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'app-checkout-card-work-performance',
    templateUrl: './checkout-card-work-performance.component.html',
    styleUrls: ['./checkout-card-work-performance.component.scss'],
    standalone: false
})
export class CheckoutCardWorkPerformanceComponent implements OnInit, OnChanges {


  @Input() workPerformance: string;

  @Input() workPerformances: string[];

  form: UntypedFormGroup;

  constructor(private formBuilder: UntypedFormBuilder) {
  }

  ngOnInit() {
    this.form = this.formBuilder.group(this.fromModelToView(this.workPerformance));
    this.form.controls.selectedWorkPerformance.setValidators(Validators.required);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.transport && !changes.transport.firstChange) {
      this.form.patchValue(this.fromModelToView(this.workPerformance));
    }
  }

  fromModelToView(transport): { [key: string]: string } {
    return {
      selectedWorkPerformance: transport
    };
  }

  computeModel(): string {
    return this.fromViewToModel(this.form);
  }


  private fromViewToModel(form: UntypedFormGroup): string {
    return form.controls.selectedWorkPerformance.value;
  }

}
