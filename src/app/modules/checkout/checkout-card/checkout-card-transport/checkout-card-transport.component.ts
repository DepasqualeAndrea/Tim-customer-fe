import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'app-checkout-card-transport',
    templateUrl: './checkout-card-transport.component.html',
    styleUrls: ['./checkout-card-transport.component.scss'],
    standalone: false
})
export class CheckoutCardTransportComponent implements OnInit, OnChanges {

  @Input() transport: string;

  @Input() transportTypes: string[];

  form: UntypedFormGroup;

  constructor(private formBuilder: UntypedFormBuilder) {
  }

  ngOnInit() {
    this.form = this.formBuilder.group(this.fromModelToView(this.transport));
    this.form.controls.selectedTransportType.setValidators(Validators.required);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.transport && !changes.transport.firstChange) {
      this.form.patchValue(this.fromModelToView(this.transport));
    }
  }

  fromModelToView(transport): { [key: string]: string } {
    return {
      selectedTransportType: transport
    };
  }

  computeModel(): string {
    return this.fromViewToModel(this.form);
  }


  private fromViewToModel(form: UntypedFormGroup): string {
    return form.controls.selectedTransportType.value;
  }
}
