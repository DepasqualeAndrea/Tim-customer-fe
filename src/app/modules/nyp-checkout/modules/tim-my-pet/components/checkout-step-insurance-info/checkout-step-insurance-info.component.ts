import { NypUserService } from '@NYP/ngx-multitenant-core';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { City, State } from '@model';
import { AuthService, DataService } from '@services';
import { CheckoutStates, IOrderResponse, MyPetInsuredItems, Packet, RecursivePartial } from 'app/modules/nyp-checkout/models/api.model';
import { NypDataService } from 'app/modules/nyp-checkout/services/nyp-data.service';
import { Observable, concat, zip } from 'rxjs';
import { filter, take, toArray } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TIM_MY_PET_KENTICO_NAME, TIM_MY_PET_PRODUCT_NAME } from 'app/modules/nyp-checkout/nyp-checkout.module';
import { NypApiService } from 'app/modules/nyp-checkout/services/api.service';
import { KenticoPipe } from 'app/shared/pipe/kentico.pipe';
import { IModalTransaltion, InsuranceInfoDetailsModalComponent } from '../../modal/insurance-info-details-modal/insurance-info-details-modal.component';
import { TimMyPetApiService } from '../../services/api.service';
import { PacketsName, PacketsNameEnum, TimMyPetCheckoutService } from '../../services/checkout.service';
import { digitalData } from 'app/core/services/adobe_analytics/adobe-analytics-data.model';
import {AdobeAnalyticsDatalayerService} from '../../../../../../core/services/adobe_analytics/adobe-init-datalayer.service';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';

export const smartWarranties = [
  { code: 3, label: "customers_tim_pet.insurance_info_smart_w_assistance_t", checked: true, price: undefined },
];

export const smartPlusWarranties = [
  { code: 3, label: "customers_tim_pet.insurance_info_smart_w_assistance_t", checked: true, price: undefined },
  { code: 14, label: "customers_tim_pet.insurance_info_smartplus_w_veterinary_t", checked: true, price: undefined },
];

export const deluxeWarranties = [
  { code: 3, label: "customers_tim_pet.insurance_info_smart_w_assistance_t", checked: true, price: undefined },
  { code: 14, label: "customers_tim_pet.insurance_info_smart_plus_w_veterinary_t", checked: true, price: undefined },
  { code: 1, label: "customers_tim_pet.insurance_info_deluxe_w_civil_t", checked: true, price: undefined },
  { code: 2, label: "customers_tim_pet.insurance_info_deluxe_w_legal_prot_t", checked: true, price: undefined }
];

@Component({
    selector: 'app-checkout-step-insurance-info',
    templateUrl: './checkout-step-insurance-info.component.html',
    styleUrls: ['./checkout-step-insurance-info.component.scss', '../../../../styles/checkout-forms.scss', '../../../../styles/size.scss', '../../../../styles/colors.scss', '../../../../styles/text.scss', '../../../../styles/common.scss'],
    standalone: false
})
export class CheckoutStepInsuranceInfoComponent implements OnInit {
  public readonly pageStates: CheckoutStates[] = ['insurance-info'];
  public readonly titleStates: CheckoutStates[] = ['login-register', 'address', 'insurance-info'];
  public readonly summaryStates: CheckoutStates[] = ['insurance-info', 'address', 'survey', 'consensuses'];
  @Input('state') public state: CheckoutStates;
  @ViewChild('innerhide') public HIDE;
  @Input('isMobileView') public isMobileView: boolean = false;

  selectedTabPacket: PacketsNameEnum.Smart | PacketsNameEnum.SmartPlus | PacketsNameEnum.Deluxe = PacketsNameEnum.Smart;

  private smartWarranties: { code: number, label: string, checked: boolean, price: number }[] = [];
  private smartPlusWarranties: { code: number, label: string, checked: boolean, price: number }[] = [];
  private deluxeWarranties: { code: number, label: string, checked: boolean, price: number }[] = [];

  public readonly KenticoPrefix = 'insurance_info';
  form: UntypedFormGroup;
  states: State[];
  cities: City[];
  petKindData: string;
  packetSelected: string;
  selectedPacket: any;
  product: any;
  content: any;
  selectedPacketName: PacketsName | null = null;
  constructor(
    public nypUserService: NypUserService,
    public dataService: DataService,
    private modalService: NgbModal,
    private kenticoPipe: KenticoPipe,
    public checkoutService: TimMyPetCheckoutService,
    private apiService: TimMyPetApiService,
    private nypApiService: NypApiService,
    private authService: AuthService,
    public nypDataService: NypDataService,
    private adobeAnalyticsDataLayerService: AdobeAnalyticsDatalayerService,
    private kenticoTranslateService: KenticoTranslateService,
  ) { }

  ngOnInit(): void {
    this.smartWarranties = smartWarranties;
    this.smartPlusWarranties = smartPlusWarranties;
    this.deluxeWarranties = deluxeWarranties;

    const state$ = this.nypDataService.CurrentState$.pipe(filter(state => this.pageStates.includes(state)), take(1));
    // this.kenticoTranslateService.getItem<any>('customers_tim_pet').pipe(take(1)).subscribe(item => {
    //   const productName = item?.system?.name;
    //   const stepName = item?.proposal_choice_label?.value;
    //   let digitalData: digitalData = window["digitalData"];
    //   digitalData.page.category.primaryCategory = productName;
    //   digitalData.page.pageInfo.pageName = stepName;
    //   this.adobeAnalyticsDataLayerService.pushAdobeCustomTags(digitalData);
    // });
    zip(
      state$,
    ).subscribe(() => {
      this.checkoutService.ChosenPackets$.next({
        packet: '',
        warranties: [],
        price: 0,
        packetCombo: '',
      });

      this.checkoutService.ChosenPackets$.subscribe(r => {
        // console.log(TIM_MY_PET_PRODUCT_NAME, 'PACCHETTI SCELTI\n', r);
        if(r.packet){
          let digitalData: digitalData = window['digitalData'];
          digitalData.cart.item[0].price = r.price;
          digitalData.cart.price.cartTotal = r.price;
          digitalData.cart.form.button_name = `${this.nypDataService.CurrentState$.value}_${r?.packet ? 'Seleziona' : 'Rimuovi'} ${r?.packet?.toLowerCase()}`;
          this.adobeAnalyticsDataLayerService.adobeTrackClick();
        }
      });
    });

    this.checkoutService.SelectedPackets['mutualExclusive'] = null;
  }

  onPetKindData(value: string) {
    this.petKindData = value;
  }

  continue(form: UntypedFormGroup) {
    this.form = form;

    if (this.selectedPacket) {
      this.submit(this.selectedPacket);
    } else {
      console.error('Nessun pacchetto selezionato');
    }
  }

  operationManager(operation: string) {
    console.log('Operation:', operation);
  }

  setInsuredForms(form: UntypedFormGroup) {
    this.form = form;
    let digitalData: digitalData = window['digitalData'];
    digitalData.cart.form.button_name = `${this.nypDataService.CurrentState$.value}_${form?.value?.kind ? 'Seleziona' : 'Rimuovi'} ${form?.value?.kind?.toLowerCase()}`;
    this.adobeAnalyticsDataLayerService.adobeTrackClick();
  }

  choosePacket(packetName: PacketsName) {
    const isDeselecting = this.selectedPacketName === packetName;
    this.selectedPacketName = isDeselecting ? null : packetName;
    this.selectedPacket = isDeselecting ? null : this.nypDataService.CurrentProduct$.value.packets?.find(p => p.name === packetName);

    const selectedPacketInfo = this.getSelectedPacketInfo(packetName);

    this.checkoutService.ChosenPackets$.next({
      packet: isDeselecting ? '' : packetName,
      warranties: isDeselecting ? [] : selectedPacketInfo.warranties,
      price: isDeselecting ? 0 : selectedPacketInfo.price,
      packetCombo: '',
    });

    if (packetName === 'SmartPlus') {
      this.packetSelected = isDeselecting ? null : 'Smart+';
    } else {
      this.packetSelected = isDeselecting ? null : packetName;
    }
  }

  isAnyPackageSelected(): boolean {
    return this.selectedPacketName !== null;
  }

  proceedToNext(): void {
    if (!this.isAnyPackageSelected()) {
      console.error('Nessun pacchetto selezionato');
      return;
    }

    if (this.selectedPacketName) {
      const packetName = this.selectedPacketName;
      this.selectedPacket = this.nypDataService.CurrentProduct$.value.packets?.find(p => p.name === packetName);

      if (!this.selectedPacket) {
        console.error('Pacchetto selezionato non trovato:', packetName);
        return;
      }

      let digitalData: digitalData = window['digitalData'];
      digitalData.cart.form.button_name = this.nypDataService.CurrentState$.value + '_' + document.getElementById('continue').textContent.toLowerCase().replace(/\s/g, '') + '-' + packetName.toLowerCase();
      // digitalData.page.pageInfo.pageName = this.nypDataService.CurrentState$.value;
      // this.adobeAnalyticsDataLayerService.pushAdobeCustomTags(digitalData);
      this.adobeAnalyticsDataLayerService.adobeTrackClick();
      this.checkoutService.InsuranceInfoState$.next('choicePet');
    }

  }

  private getSelectedPacketInfo(packetName: PacketsName) {
    switch (packetName) {
      case PacketsNameEnum.Smart:
        return {
          warranties: this.smartWarranties.filter(warranty => warranty.checked),
          price: this.checkoutService.SelectedPackets.smartPrice,
        };

      case PacketsNameEnum.SmartPlus:
        return {
          warranties: this.smartPlusWarranties.filter(warranty => warranty.checked),
          price: this.checkoutService.SelectedPackets.smartPlusPrice,
        };

      case PacketsNameEnum.Deluxe:
        return {
          warranties: this.deluxeWarranties.filter(warranty => warranty.checked),
          price: this.checkoutService.SelectedPackets.deluxePrice,
        };

      default:
        return {
          warranties: [],
          price: 0,
        };
    }
  }

  openWarrantiesInfoModal(packetName: PacketsName, packetTitleSlug: string, productTitle: string) {
    const trimPacketName = packetName.toLowerCase().split(' ')[0];
    let digitalData: digitalData = window['digitalData'];
    digitalData.page.pageInfo.pageName = 'apri-scopridettagli-' + trimPacketName;
    this.adobeAnalyticsDataLayerService.pushAdobeCustomTags(digitalData);
    const product = this.nypDataService.CurrentProduct$.value;
    const packet = product?.packets?.find(packet => packet.name == packetName);

    const modalRef = this.modalService.open(InsuranceInfoDetailsModalComponent, {
      size: "lg",
      windowClass: "tim-modal-window",
    });

    const packetTranslationKeysSet = new Set<string>();
    console.log(Object.keys(NypDataService.Translations[TIM_MY_PET_KENTICO_NAME]))
    Object.keys(NypDataService.Translations[TIM_MY_PET_KENTICO_NAME])
      .forEach(sectionKey => {
        if (sectionKey.toLowerCase().includes(`${this.KenticoPrefix}_${trimPacketName}_w_`)) {
          if (sectionKey.toLowerCase().endsWith('_t') || sectionKey.toLowerCase().endsWith('_d'))
            packetTranslationKeysSet.add(`customers_tim_pet.${sectionKey.substring(0, sectionKey.length - 2)}`);
        }
      });
    modalRef.componentInstance.translation = {
      title: this.kenticoPipe.transform(packetTitleSlug),
      subtitle: productTitle,
      price: packet?.packetPremium || Number.NaN,
      warranties: Array.from(packetTranslationKeysSet).map(packet => ({
        title: `${packet}_t`,
        description: `${packet}_d`,
      })),
    } as IModalTransaltion;
  }

  getImageSource(warranty: any): any {
    return warranty.checked ? 'customers_tim_pet.insurance_info_check_icon_mp' : 'customers_tim_pet.insurance_info_x_icon_mp';
  }

  submit(packet: RecursivePartial<Packet>) {
    this.updateOrder({
      birth_date: this.form.controls.birthDate.value,
      kind: this.form.controls.kind.value,
      microchip_code: this.form.controls.microChip.value,
      name: this.form.controls.petName.value,
    }, packet).subscribe(() => {
      const isLoggedUser = this.authService.loggedUser?.id;
      let digitalData: digitalData = window['digitalData'];
      digitalData.cart.form.button_name = this.nypDataService.CurrentState$.value + '_' + document.getElementById('continue').textContent.toLowerCase().replace(/\s/g, '') + packet?.name?.toLowerCase() || packet?.sku?.toLowerCase();
      this.adobeAnalyticsDataLayerService.adobeTrackClick();
      this.nypDataService.CurrentState$.next('login-register');
      console.log('submit-isLoggedUser',isLoggedUser)
    });
  }

  private updateOrder(insuredItems: MyPetInsuredItems, packet: RecursivePartial<Packet>): Observable<(RecursivePartial<IOrderResponse<MyPetInsuredItems>> | void)[]> {
    const currentPacket = this.nypDataService.CurrentProduct$.value.packets?.find(p => p.id == packet.id);
    const currentWarranties = this.nypDataService.CurrentProduct$.value.packets
      ?.find(p => p.id == packet.id).warranties
      ?.filter(warranty => this.checkoutService.ChosenPackets$.value?.warranties?.some(w => w.code == warranty?.anagWarranty?.id))
      ?.map(warranty => Object.assign(warranty, { startDate: this.nypDataService.Order$.value?.orderItem[0]?.start_date, endDate: this.nypDataService.Order$.value?.orderItem[0]?.expiration_date }))
      ?.map(warranty => Object.assign(warranty, { translationCode: this.checkoutService.ChosenPackets$.value?.warranties?.find(w => w.code == warranty?.anagWarranty?.id).label }))
      ;

    return concat(
      this.apiService.putOrder({
        orderCode: this.nypDataService.Order$.value.orderCode,
        customerId: this.authService.loggedUser?.id,
        productId: this.nypDataService.CurrentProduct$.value?.id,
        packet: currentPacket,
        chosenWarranties: currentWarranties,
        price: this.checkoutService.ChosenPackets$.value.price,
        insuredItems: insuredItems,
        anagState: 'Draft',
      }),
      this.nypApiService.legacyRequest(this.nypDataService.Order$.value.orderCode, this.apiService.GET_EMISSIONBODY(this.nypDataService.Order$.value.orderCode, packet.id))
    ).pipe(toArray(), take(1));
  }
}
