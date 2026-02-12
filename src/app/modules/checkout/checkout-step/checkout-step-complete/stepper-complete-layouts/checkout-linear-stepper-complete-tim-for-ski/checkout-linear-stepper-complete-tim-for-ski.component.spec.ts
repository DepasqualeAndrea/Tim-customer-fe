import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutLinearStepperCompleteTimForSkiComponent } from './checkout-linear-stepper-complete-tim-for-ski.component';

describe('CheckoutLinearStepperCompleteTimForSkiComponent', () => {
  let component: CheckoutLinearStepperCompleteTimForSkiComponent;
  let fixture: ComponentFixture<CheckoutLinearStepperCompleteTimForSkiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckoutLinearStepperCompleteTimForSkiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutLinearStepperCompleteTimForSkiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
