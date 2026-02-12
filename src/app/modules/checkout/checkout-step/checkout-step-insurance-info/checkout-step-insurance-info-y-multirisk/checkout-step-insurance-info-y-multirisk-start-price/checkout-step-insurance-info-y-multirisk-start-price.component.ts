import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-checkout-step-insurance-info-y-multirisk-start-price',
  templateUrl: './checkout-step-insurance-info-y-multirisk-start-price.component.html',
  styleUrls: ['./checkout-step-insurance-info-y-multirisk-start-price.component.scss']
})
export class CheckoutStepInsuranceInfoYMultiriskStartPriceComponent implements OnInit {

  @Output() previousStep = new EventEmitter<string>();
  @Output() operation = new EventEmitter<string>();
  @Input() basicProposalPrice: number;

  constructor() {
  }

  ngOnInit(): void {
  }

  backSubStep() {
    this.previousStep.emit('prev');
  }

  nextSubStep() {
    this.operation.emit('next');
  }

}
