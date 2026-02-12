import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { DataService, UserService } from '@services';
import _ from 'lodash';
import { CompletedStepEdit } from '../completed-step-edit';

@Component({
  selector: 'app-checkout-card-insurance-info-recap',
  templateUrl: './checkout-card-insurance-info-recap.component.html',
  styleUrls: ['./checkout-card-insurance-info-recap.component.scss'],
})
export class CheckoutCardInsuranceInfoRecapComponent extends CompletedStepEdit implements OnInit {
  @Input() data;

  @Input() product;

  @Input() isCompleted = true;

  days: any;
  constructor(
    public dataService: DataService,
    ref: ChangeDetectorRef,
  ) {
    super(ref);
  }

  ngOnInit() {
    console.log('product:',this.product)
    this.product = this.dataService.getResponseProduct().product_code;
    this.savePets();
    console.log('data Service: ',this.dataService)
    console.log('data: ',this.data)
    
  }

  savePets() {
    try {
      localStorage.setItem('pets', JSON.stringify(this.data.insuredSubjects[0].pet[0]))
      window.dispatchEvent(new CustomEvent('storedPets'));
    } catch {
      localStorage.removeItem('pets');
      window.dispatchEvent(new CustomEvent('storedPets'));
    }
  }
  getDuration(){
    this.days= this.dataService.daysOfCoverage;
    if(this.days !== null){
      if(this.days === 1){
        this.days = this.days + ' giorno'
       }else {
         this.days = this.days + ' giorni'
       }
       return this.days
    } else {
      return 'Stagionale';
    }

  }
}

