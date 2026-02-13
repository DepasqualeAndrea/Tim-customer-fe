import { NypUserService } from '@NYP/ngx-multitenant-core';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { City, State } from '@model';
import { AuthService, DataService } from '@services';
import { CheckoutStates, CyberCustomerInsuredItems, IOrderResponse, MyPetInsuredItems, Packet, RecursivePartial } from 'app/modules/nyp-checkout/models/api.model';
import { NypDataService } from 'app/modules/nyp-checkout/services/nyp-data.service';
import { Observable, concat, zip } from 'rxjs';
import { filter, take, toArray } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NypApiService } from 'app/modules/nyp-checkout/services/api.service';
import { IModalTransaltion, InsuranceInfoDetailsModalComponent } from '../../../net-cyber-consumer/modal/insurance-info-details-modal/insurance-info-details-modal.component';
import { TimCyberConsumerApiService } from '../../../net-cyber-consumer/services/api.service';
import { PacketsName, TimCyberConsumerCheckoutService } from '../../../net-cyber-consumer/services/checkout.service';
import { digitalData } from 'app/core/services/adobe_analytics/adobe-analytics-data.model';
import {AdobeAnalyticsDatalayerService} from '../../../../../../core/services/adobe_analytics/adobe-init-datalayer.service';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';

export interface PacketModel {
  code: string,
  price?: number | string | undefined;
  checked?: boolean;
  modal_title?: string;
  warranties: [{
    code?: number | string;
    label?:string, 
    ceilingLabel?: string,
    checked?: boolean;
    extraLabel?: string;
    modal_title?: string;
    modal_subtitle?: string;
  }]
}

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

  form: UntypedFormGroup;
  states: State[];
  cities: City[];
  packetSelected: string;
  selectedPacket: any;
  product: any;
  content: any;
  selectedPacketName: PacketsName | null = null;
  kenticoPacketlist: any[] =[];


  constructor(
    public nypUserService: NypUserService,
    public dataService: DataService,
    private modalService: NgbModal,
    public checkoutService: TimCyberConsumerCheckoutService,
    private apiService: TimCyberConsumerApiService,
    private nypApiService: NypApiService,
    private authService: AuthService,
    public nypDataService: NypDataService,
    private adobeAnalyticsDataLayerService: AdobeAnalyticsDatalayerService,
    private kenticoTranslateService: KenticoTranslateService,
  ) { }

  ngOnInit(): void {
    const state$ = this.nypDataService.CurrentState$.pipe(filter(state => this.pageStates.includes(state)), take(1));
    zip(state$).subscribe(() => {
      this.checkoutService.ChosenPackets$.next({
        packet: '',
        warranties: [],
        price: 0,
        packetCombo: '',
      });

      this.checkoutService.ChosenPackets$.subscribe(r => {
        if(r.packet){
          let digitalData: digitalData = window['digitalData'];
          digitalData.cart.item[0].price = r.price;
          digitalData.cart.price.cartTotal = r.price;
          digitalData.cart.form.button_name = `${this.nypDataService.CurrentState$.value}_${r?.packet ? 'Seleziona' : 'Rimuovi'} ${r?.packet?.toLowerCase()}`;
          this.adobeAnalyticsDataLayerService.adobeTrackClick();
        }
      });
    });
    this.product = this.nypDataService.CurrentProduct$.value;
    this.kenticoTranslateService.getItem<any>('checkout_cyber_consumer').pipe(take(1)).subscribe((res)=>{
      this.content = res;
      if(this.product){
        this.setPackets();
      }
    });
  }

  setPackets() {
    this.kenticoPacketlist = [];
    if (!this.content?.packets) return;

    Object.keys(this.content.packets).forEach((contentKey) => {
      if (!contentKey.includes('net_cyber_consumer')) return;

      const kenticoPacket = this.content.packets[contentKey];
      if (!kenticoPacket) return;

      const rawKenticoWarr = kenticoPacket?.warranties ?? {};
      const kenticoEntries: Array<{ key: string; item: any }> = Array.isArray(rawKenticoWarr)
        ? rawKenticoWarr.map((it: any, i: number) => ({ key: String(i), item: it }))
        : Object.keys(rawKenticoWarr || {}).map(k => ({ key: k, item: rawKenticoWarr[k] }));

      const warrantyList: Array<{ code: any; label: string; ceilingLabel: string; checked: boolean; extraLabel?:string; modal_title: string; modal_subtitle: string; }> = [];
      if (kenticoEntries?.length) {
        kenticoEntries.forEach(el => {
          const rawInfo = el.item?.info_text?.value ?? el.item?.info_text ?? '';
          const isEmptyHtml = typeof rawInfo === 'string' && /^<p>(?:\s*<br\s*\/?>)?\s*<\/p>$/i.test(rawInfo.trim());
          const ceilingLabel = (!isEmptyHtml && rawInfo) ? String(rawInfo) : '';
          if (el.key.includes('_silver') || el.key.includes('_gold') || el.key.includes('_platinum')) {
            warrantyList.push({
              code: el.item?.code?.value,
              label: el.item?.label?.value,
              ceilingLabel: ceilingLabel,
              checked: true,
              extraLabel: el.item.has_additional_label.value[0].name === "true" ? this.content.extra_label.value : null,
              modal_title: el.item?.modal_title?.value,
              modal_subtitle: el.item?.modal_subtitle?.value
            });
          }
        });
      }

      const packetCode = kenticoPacket?.name?.value;
      let price;
      Object.keys(this.checkoutService.SelectedPackets).forEach((packetKey) => {
        if (packetKey.toLowerCase().toLowerCase().includes( packetCode.toLowerCase())) {
          price = this.checkoutService.SelectedPackets[packetKey];
        }
      });
      this.kenticoPacketlist.push({
        code: packetCode,
        price: price,
        checked: false,
        warranties: warrantyList,
        modal_title: kenticoPacket?.modal_title?.value,
      });
    });
  }

  choosePacket(packetName: PacketsName) {
    const tempPacket = this.kenticoPacketlist.find((packet)=> packet.code.toLowerCase() === packetName.toLowerCase());
    tempPacket.checked = !tempPacket.checked;
    this.selectedPacketName = packetName;
    this.selectedPacket = this.nypDataService.CurrentProduct$.value.packets?.find(p => p.name === packetName);
    this.checkoutService.ChosenPackets$.next({
      packet: packetName,
      warranties: this.getSelectedPacketWarranties(packetName),
      price: this.getSelectedPacketPrice(packetName),
    });
    this.packetSelected = packetName;
  }

  isAnyPackageSelected(): boolean {
    return this.selectedPacketName !== null;
  }

  proceedToNext(packet: RecursivePartial<Packet>): void {
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
      const packetObj = this.product.packets.find((p: any) => p.name === packetName);
      this.updateOrder({}, packetObj).subscribe(() => {
        const isLoggedUser = this.authService.loggedUser?.id;
        let digitalData: digitalData = window['digitalData'];
        digitalData.cart.form.button_name = this.nypDataService.CurrentState$.value + '_' + document.getElementById('continue').textContent.toLowerCase().replace(/\s/g, '') + packet?.name?.toLowerCase() || packet?.sku?.toLowerCase();
        this.adobeAnalyticsDataLayerService.adobeTrackClick();
        this.nypDataService.CurrentState$.next('login-register');
        console.log('submit-isLoggedUser',isLoggedUser)
      });

      let digitalData: digitalData = window['digitalData'];
      digitalData.cart.form.button_name = this.nypDataService.CurrentState$.value + '_' + document.getElementById('continue').textContent.toLowerCase().replace(/\s/g, '') + '-' + packetName.toLowerCase();
      this.adobeAnalyticsDataLayerService.adobeTrackClick();
      this.nypDataService.CurrentState$.next('login-register');
    }

  }

  private getSelectedPacketPrice(packetName: PacketsName) {
    const selectedPacket = this.kenticoPacketlist.find((packet)=> packet.code.toLowerCase() === packetName.toLowerCase());
    return selectedPacket.price ;
  }

    private getSelectedPacketWarranties(packetName: PacketsName) {
    const selectedPacket = this.kenticoPacketlist.find((packet)=> packet.code.toLowerCase() === packetName.toLowerCase());
    return selectedPacket.warranties ;
  }

  openWarrantiesInfoModal(packetName: String) {
    this.adobeAnalyticsDataLayerService.pushAdobeCustomTags(digitalData);
    const kenticoPacket = this.kenticoPacketlist?.find(packet => packet?.code?.toLowerCase() === packetName?.toLowerCase());
    const modalRef = this.modalService.open(InsuranceInfoDetailsModalComponent, {
      size: "lg",
      windowClass: "tim-modal-window",
    });

    const rawWarranties = kenticoPacket.warranties;
    const warranties: { title: string; description: string }[] = Array.isArray(rawWarranties)
      ? rawWarranties.map((w: any) => {
          const title = w.modal_title;
          const description = w.modal_subtitle;
          return { title: String(title), description: String(description) };
        }) : [];
    modalRef.componentInstance.translation = {
      title: kenticoPacket?.modal_title,
      subtitle: '',
      price: kenticoPacket?.price,
      warranties,
    } as IModalTransaltion;
  }

  private updateOrder(insuredItems: CyberCustomerInsuredItems, packet: RecursivePartial<Packet>): Observable<(RecursivePartial<IOrderResponse<MyPetInsuredItems>> | void)[]> {
    const currentPacket = this.nypDataService.CurrentProduct$.value.packets?.find(p => p.id == packet.id);
    return concat(
      this.apiService.putOrder({
        orderCode: this.nypDataService.Order$.value.orderCode,
        customerId: this.authService.loggedUser?.id,
        productId: this.nypDataService.CurrentProduct$.value?.id,
        packet: currentPacket,
        price: this.checkoutService.ChosenPackets$.value.price.toString(),
        insuredItems: insuredItems,
        anagState: 'Draft',
      }),
    ).pipe(toArray(), take(1));
  }
}
