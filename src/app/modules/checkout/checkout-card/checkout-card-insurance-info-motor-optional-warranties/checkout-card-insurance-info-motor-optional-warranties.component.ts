import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CheckoutService, DataService } from '@services';
import { KenticoTranslateService } from '../../../kentico/data-layer/kentico-translate.service';
import { take, map } from 'rxjs/operators';
import { CheckoutStepInsuranceInfoComponent } from '../../checkout-step/checkout-step-insurance-info/checkout-step-insurance-info.component';
import { ContainerComponent } from 'app/modules/tenants/component-loader/containers/container.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ResponseOrder } from '@model';

@Component({
  selector: 'app-checkout-card-insurance-info-motor-optional-warranties',
  templateUrl: './checkout-card-insurance-info-motor-optional-warranties.component.html',
  styleUrls: ['./checkout-card-insurance-info-motor-optional-warranties.component.scss']
})
export class CheckoutCardInsuranceInfoMotorOptionalWarrantiesComponent implements OnInit {

  @Input() addons;
  @Input() formValid: boolean;
  @Output() selectedAddonsEmit = new EventEmitter<any>();
  @Output() hideOptionalWarranty = new EventEmitter<any>();
  @Output() ownerStep = new EventEmitter<any>();
  @Output() showProposalWarrantyEmit = new EventEmitter<any>();
  @Output() showInfoHomeEmit = new EventEmitter<any>();


  kenticoBody: any;
  priceAssAuto: any;
  arrayPackage: any;
  packageChoise: any;
  arrayInfCond: any;
  sumInfCondChoose: any;
  resettableAddons: any;
  responseOrder: ResponseOrder;


  constructor(public checkoutService: CheckoutService,
    public kenticoTranslateService: KenticoTranslateService,
    public infoComponent: CheckoutStepInsuranceInfoComponent,
    public dataService: DataService,
    public modalService: NgbModal) {
  }

  ngOnInit() {
    this.responseOrder = this.dataService.getResponseOrder();
    this.resettableAddons = this.addons.filter(addon => addon.selezionata);
    this.kenticoTranslateService.getItem('checkout_motor_genertel').pipe(take(1)).subscribe(item => {
      this.kenticoBody = item;
    });
    const selectedAddons = this.addons.filter(addon => addon.selezionata);
    this.checkoutService.setAddonsStepInsuranceInfo(selectedAddons);
    this.uploadAssAuto();
    this.uploadInfCond();
  }

  isOwner() {
    if (!this.responseOrder.line_items[0].contractor_is_owner) {
      this.ownerStep.emit(true);
      this.showInfoHome();
    } else {
      this.infoComponent.handleNextStep();
    }
  }

  showProposalWarranties() {
    this.showProposalWarrantyEmit.emit();
  }

  showInfoHome() {
    const isCustomized =  localStorage.getItem('Customized');
    this.showInfoHomeEmit.emit(isCustomized);
  }

  resetSelectedAddon() {
      this.checkoutService.setAddonsStepInsuranceInfo(this.resettableAddons.selezionata);
      this.selectedAddonsEmit.emit(this.resettableAddons);
  }

  openModal(allowedAddons: any, notAllowedAddons: any, selectedpackage?: any) {
    if ((allowedAddons && allowedAddons.length > 1) || (notAllowedAddons && notAllowedAddons.length > 1)) {
      const modalRef = this.modalService.open(ContainerComponent, { size: 'lg', backdropClass: 'backdrop-class ' + this.dataService.tenantInfo.main.layout, windowClass: 'modal-window' });
      modalRef.componentInstance.type = 'ModalAutoOptionalWarranties';
      modalRef.componentInstance.componentInputData = { 'allowedAddons': allowedAddons, 'notAllowedAddons': notAllowedAddons, 'kenticoBody': this.kenticoBody };
      modalRef.result.then(result => {
        this.listSelectedAddons(selectedpackage || null, allowedAddons, notAllowedAddons);
      });
    } else {
      this.listSelectedAddons(selectedpackage || null, allowedAddons, notAllowedAddons);
    }
  }

  openDetail(addon) {
    const modalRef = this.modalService.open(ContainerComponent, { size: 'lg', backdropClass: 'backdrop-class ' + this.dataService.tenantInfo.main.layout, windowClass: 'modal-window' });
    modalRef.componentInstance.type = 'ModalDetailsWarrantiesComponent';
    modalRef.componentInstance.componentInputData = { 'addon': addon, 'kenticoBody': this.kenticoBody };
    modalRef.result.then(result => {
      this.addCancelWarranty(addon);
    });
  }

  toggleAddonLimit(selectedMaximal, index) {
    if (this.addons[index].code.toLowerCase() === 'infcond') {
      this.sumInfCondChoose = selectedMaximal;
      this.addons[index].sumInsuredChoose = selectedMaximal;
      this.addons[index].importoMassimaleAssicurato = selectedMaximal.ceiling;
    } else {
      this.addons[index].importoMassimaleAssicurato = selectedMaximal;
    }
    if (this.addons[index].selezionata) {
      this.listSelectedAddons();
    }
  }

  togglePackage(selectedpackage, indexAddon) {
    this.priceAssAuto = selectedpackage.premioTotaleScontatoGaranzia;
    this.addons[indexAddon].selectedPackage = selectedpackage;
    this.packageChoise = selectedpackage;
    if (this.addons[indexAddon].selezionata) {
      this.addCancelWarranty(this.addons[indexAddon], selectedpackage, true);
    }
  }

  toggleAddonComb(selectedComb, index) {
    this.addons[index].defaultCombWarr = selectedComb;
    if (this.addons[index].selezionata) {
      this.addCancelWarranty(this.addons[index], null, false, true);
    }
  }

  uploadAssAuto() {
    this.arrayPackage = this.addons.find(addon => addon.code.toLowerCase().includes('assauto'));
    this.packageChoise = this.arrayPackage.listpackage.find(addon => addon.code.toLowerCase() === this.arrayPackage.code.toLowerCase());
    this.priceAssAuto = this.packageChoise.premioTotaleScontatoGaranzia;
  }

  uploadInfCond() {
    this.sumInfCondChoose = this.addons.find(addon => addon.code.toLowerCase() === 'infcond').listSumInsured
      .find(choise => choise.ceiling === 50000);
  }

  listSelectedAddons(packageChoise?: any, allowedAddons?: any, notAllowedAddons?: any) {
    if (allowedAddons) {
      this.addons.map(addon => {
        allowedAddons.forEach(allAddon => {
          if (allAddon.code === addon.code) {
            addon.selezionata = true;
          }
        });
      });
    }
    if (notAllowedAddons) {
      this.addons.map(addon => {
        notAllowedAddons.forEach(notAllAddon => {
          if (notAllAddon.code === addon.code) {
            addon.selezionata = false;
          }
        });
      });
    }
    const selectedAddons = this.addons.filter(addon => addon.selezionata);
    if (packageChoise) {
      const assStra = selectedAddons.find(addon => addon.code.toLowerCase().includes('assauto'));
      this.removeItemOnce(selectedAddons, assStra);
      selectedAddons.push(packageChoise);
    }
    this.checkoutService.setAddonsStepInsuranceInfo(selectedAddons);
    this.selectedAddonsEmit.emit(selectedAddons);
    if (selectedAddons) {
      localStorage.setItem('Customized', 'true');
      localStorage.setItem('selectedAddons', JSON.stringify(selectedAddons));
      const addons = localStorage.getItem('selectedAddons');
    }
  }

  removeItemOnce(arr, value) {
    const index = arr.indexOf(value);
    if (index > -1) {
      arr.splice(index, 1);
    }
    return arr;
  }

  hideWarranties() {
    this.hideOptionalWarranty.emit();
  }

  submit() {
    const isCustomized =  localStorage.getItem('Customized');
    this.showInfoHomeEmit.emit(isCustomized);
    this.isOwner();
  }

  addCancelWarranty(addon: any, selectedpackage?: any, changePackage?: boolean, selectedComb?: boolean) {
    const allowedAddons = [];
    const notAllowedAddons = [];
    if (addon.code.toLowerCase() === 'kasko') {
      if (!addon.selezionata) {
        allowedAddons.push(addon);
        this.addons.forEach(add => {
          if (add.code.toLowerCase() === 'minikasko' && !add.selezionata) {
            allowedAddons.push(add);
          }
        });
      } else {
        notAllowedAddons.push(addon);
      }
    } else if (addon.code.toLowerCase() === 'nonassic') {
      if (!addon.selezionata) {
        allowedAddons.push(addon);
        this.addons.forEach(add => {
          if (add.code.toLowerCase().includes('assauto') && !add.selezionata) {
            allowedAddons.push(add.selectedPackage || add);
          }
          if (add.code.toLowerCase() === 'tutauto' && !add.selezionata) {
            allowedAddons.push(add);
          }
        });
      } else {
        notAllowedAddons.push(addon);
      }
    } else if (addon.code.toLowerCase() === 'anselvatici') {
      if (!addon.selezionata) {
        allowedAddons.push(addon);
        this.addons.forEach(add => {
          if (add.code.toLowerCase().includes('assauto') && !add.selezionata) {
            allowedAddons.push(add.selectedPackage || add);
          }
          if (add.code.toLowerCase() === 'tutauto' && !add.selezionata) {
            allowedAddons.push(add);
          }
        });
      } else {
        notAllowedAddons.push(addon);
      }
    } else if (addon.code.toLowerCase() === 'cristalli') {
      if (!addon.selezionata) {
        allowedAddons.push(addon);
        this.addons.forEach(add => {
          if (add.code.toLowerCase().includes('assauto') && !add.selezionata) {
            allowedAddons.push(add.selectedPackage || add);
          }
        });
      } else {
        notAllowedAddons.push(addon);
      }
    } else if (addon.code.toLowerCase() === 'vandalnew') {
      if (!addon.selezionata || (addon.selezionata && selectedComb)) {
        allowedAddons.push(addon);
        this.addons.forEach(add => {
          addon.defaultCombWarr.codes.forEach(code => {
            if ((add.code.toLowerCase() === code.toLowerCase()) && !add.selezionata) {
              allowedAddons.push(add);
            }
          });
        });
      } else {
        notAllowedAddons.push(addon);
      }
    } else if (addon.code.toLowerCase() === 'atmosfnew') {
      if (!addon.selezionata || (addon.selezionata && selectedComb)) {
        allowedAddons.push(addon);
        this.addons.forEach(add => {
          addon.defaultCombWarr.codes.forEach(code => {
            if ((add.code.toLowerCase() === code.toLowerCase()) && !add.selezionata) {
              allowedAddons.push(add);
            }
          });
        });
      } else {
        notAllowedAddons.push(addon);
        this.addons.forEach(add => {
          if (add.code.toLowerCase() === 'vandalnew' && add.selezionata) {
            notAllowedAddons.push(add);
          }
        });
      }
    } else if (addon.code.toLowerCase() === 'minikasko') {
      if (addon.selezionata) {
        notAllowedAddons.push(addon);
        const addonIncFurto = this.addons.find(addToFind => addToFind.code.toLowerCase() === 'incfurto');
        const addonatmosfnew = this.addons.find(addToFind => addToFind.code.toLowerCase() === 'atmosfnew');
        this.addons.forEach(add => {
          if ((add.code.toLowerCase() === 'kasko' || (add.code.toLowerCase() === 'atmosfnew' && !addonIncFurto.selezionata)
            || (add.code.toLowerCase() === 'vandalnew' && (!addonatmosfnew.selezionata || !addonIncFurto.selezionata)))
            && add.selezionata) {
            notAllowedAddons.push(add);
          }
        });
      } else {
        allowedAddons.push(addon);
      }
    } else if (addon.code.toLowerCase().includes('assauto')) {
      if (addon.selezionata && !changePackage) {
        notAllowedAddons.push(addon);
        this.addons.forEach(add => {
          if ((add.code.toLowerCase() === 'anselvatici' || add.code.toLowerCase() === 'nonassic' || add.code.toLowerCase() === 'cristalli')
            && add.selezionata) {
            notAllowedAddons.push(add);
          }
          if (add.code.toLowerCase() === 'minikasko' && add.selezionata) {
            notAllowedAddons.push(add);
            this.addons.forEach(addM => {
              if (add.code.toLowerCase() === 'kasko' && addM.selezionata) {
                notAllowedAddons.push(addM);
              }
            });
          }
        });
      } else {
        allowedAddons.push(addon.selectedPackage || addon);
      }
    } else if (addon.code.toLowerCase() === 'incfurto') {
      if (addon.selezionata) {
        const addonMinikasko = this.addons.find(addToFind => addToFind.code.toLowerCase() === 'minikasko');
        const addonatmosfnew = this.addons.find(addToFind => addToFind.code.toLowerCase() === 'atmosfnew');
        notAllowedAddons.push(addon);
        this.addons.forEach(add => {
          if ((add.code.toLowerCase() === 'atmosfnew' && !addonMinikasko.selezionata) || (add.code.toLowerCase() === 'vandalnew' && (!addonatmosfnew.selezionata || !addonMinikasko.selezionata))
            && add.selezionata) {
            notAllowedAddons.push(add);
          }
        });
      } else {
        allowedAddons.push(addon);
      }
    } else if (addon.code.toLowerCase() === 'tutauto') {
      if (addon.selezionata) {
        notAllowedAddons.push(addon);
        this.addons.forEach(add => {
          if (add.code.toLowerCase() === 'nonassic' && add.selezionata) {
            notAllowedAddons.push(add);
          }
          if (add.code.toLowerCase() === 'minikasko' && add.selezionata) {
            notAllowedAddons.push(add);
            this.addons.forEach(addM => {
              if (addM.code.toLowerCase() === 'kasko' && addM.selezionata) {
                notAllowedAddons.push(addM);
              }
            });
          }
        });
      } else {
        allowedAddons.push(addon);
      }
    } else {
      if (addon.selezionata) {
        notAllowedAddons.push(addon);
      } else {
        allowedAddons.push(addon);
      }
    }
    this.openModal(allowedAddons.length > 0 ? allowedAddons : null, notAllowedAddons.length > 0 ? notAllowedAddons : null, selectedpackage || addon.selectedPackage || null);
  }
}
