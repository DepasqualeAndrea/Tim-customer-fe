import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, UntypedFormControl } from '@angular/forms';
import { NgbCalendar, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { UserService, CheckoutService } from '@services';
import { take, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-quotator-isp-pet',
    templateUrl: './quotator-isp-pet.component.html',
    styleUrls: ['../preventivatoreY.component.scss'],
    standalone: false
})
export class QuotatorIspPet implements OnInit {

  @Input() product;
   

  constructor(
    public formBuilder: UntypedFormBuilder,
    public calendar: NgbCalendar,
    private userService: UserService,
    private router: Router,
    private checkoutService: CheckoutService,
    private toastService: ToastrService
  ){ }


  petForm: UntypedFormGroup;
  addons = [
    {name: 'Cane', image: '/assets/images/isp/dog-icon.png', selected: false, value: 'dog'}, 
    {name: 'Gatto', image: '/assets/images/isp/cat-icon.png', selected: false, value: 'cat'}
  ];
  
  maxBirthDate = {
    year: +moment().format('YYYY'),
    month: +moment().format('MM'),
    day: +moment().format('DD')
  }
  showTaxCodeError = false;
  
  ngOnInit() {
    this.petForm = this.formBuilder.group({
      firstName: new UntypedFormControl(null, [Validators.required, Validators.pattern('[a-zA-Z\ ]*')]),
      lastName: new UntypedFormControl(null, [Validators.required, Validators.pattern('[a-zA-Z\ ]*')]),
      taxCode: new UntypedFormControl(null, [Validators.required, Validators.pattern('^[a-zA-Z]{6}[0-9]{2}[abcdehlmprstABCDEHLMPRST]{1}[0-9]{2}([a-zA-Z]{1}[0-9]{3})[a-zA-Z]{1}$')]),
      email: new UntypedFormControl(null, [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')]),
      animalType: new UntypedFormControl(null, Validators.required),
      microchip: new UntypedFormControl(null, [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(15)]),
      birthDate: [null, Validators.required ],
    })
  }

  toggleSelectionAddons(addon) {
    this.addons.map( a => a.name === addon.name ? a.selected = true : a.selected = false);
    this.petForm.patchValue({animalType: addon.value})
  } 

  active() {
    let formatedBirthDate = ''
    if (this.petForm.controls.birthDate.value) {        
      const year = moment().year(this.petForm.controls.birthDate.value.year).format('YYYY');
      const month = moment().month(this.petForm.controls.birthDate.value.month).subtract(1, 'months').format('MM');
      const day = moment().date(this.petForm.controls.birthDate.value.day).format('DD');
      formatedBirthDate = year + '-' + month + '-' + day;
    }
    if (this.petForm.valid) {
      const retailOrder = this.createRetailOrder(this.petForm.controls, 
      formatedBirthDate);
      this.checkoutService.retailOrder(retailOrder)
      .pipe(take(1))
      .subscribe(res => {
       return this.router.navigate(['policy-activated']);
      }, (err => {
        if (err.status === 404) {
          this.showTaxCodeError = true;
        } else { 
          this.showTaxCodeError = false; 
          this.toastService.error(err.error.exception);
        }
      }));
    }
  }

  createRetailOrder(formInfo, formatedBirthDate){
    return {
        payload_id: formInfo.taxCode.value,
        order_attributes: {
          line_items_attributes: {
            0: {
              variant_id: this.product.master_variant
            }
          }
        },
        pet_attributes: {
          kind: formInfo.animalType.value,
          birth_date: formatedBirthDate,
          microchip_code: formInfo.microchip.value
        },
        user_attributes: {
          firstname: formInfo.firstName.value,
  	      lastname: formInfo.lastName.value,
  	      email: formInfo.email.value,
        }
      }
    }
  }
