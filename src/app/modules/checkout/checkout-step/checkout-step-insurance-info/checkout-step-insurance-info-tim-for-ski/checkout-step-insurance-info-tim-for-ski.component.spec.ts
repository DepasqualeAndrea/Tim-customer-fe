import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutStepInsuranceInfoTimForSkiComponent } from './checkout-step-insurance-info-tim-for-ski.component';

describe('CheckoutStepInsuranceInfoTimForSkiComponent', () => {
  let component: CheckoutStepInsuranceInfoTimForSkiComponent;
  let fixture: ComponentFixture<CheckoutStepInsuranceInfoTimForSkiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckoutStepInsuranceInfoTimForSkiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutStepInsuranceInfoTimForSkiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
