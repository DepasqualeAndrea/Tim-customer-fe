import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyDetailModalClaimTimForSkiOthersModalityComponent } from './policy-detail-modal-claim-tim-for-ski-others-modality.component';

describe('PolicyDetailModalClaimTimForSkiOthersModalityComponent', () => {
  let component: PolicyDetailModalClaimTimForSkiOthersModalityComponent;
  let fixture: ComponentFixture<PolicyDetailModalClaimTimForSkiOthersModalityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PolicyDetailModalClaimTimForSkiOthersModalityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PolicyDetailModalClaimTimForSkiOthersModalityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
