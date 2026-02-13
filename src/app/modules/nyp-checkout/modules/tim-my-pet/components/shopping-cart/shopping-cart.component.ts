import { NypIadDocumentaryService } from '@NYP/ngx-multitenant-core';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CheckoutStates } from 'app/modules/nyp-checkout/models/api.model';
import { NypDataService } from 'app/modules/nyp-checkout/services/nyp-data.service';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { IPacketNWarranties, TimMyPetCheckoutService } from '../../services/checkout.service';


@Component({
    selector: 'app-shopping-cart',
    templateUrl: './shopping-cart.component.html',
    styleUrls: ['./shopping-cart.component.scss',
        '../../../../styles/shopping-cart.scss',
        '../../../../styles/size.scss',
        '../../../../styles/colors.scss',
        '../../../../styles/text.scss',
        '../../../../styles/common.scss'],
    standalone: false
})
export class ShoppingCartComponent implements OnInit {
  public Order$ = this.nypDataService.Order$;
  public isStickyCartOpen = true;
  public isSticky: boolean = false;
  public showStates: CheckoutStates[] = ['insurance-info', 'login-register', 'address', 'survey', 'payment', 'consensuses', 'thank-you'];
  private documentToDownload: string;

  private packetAndWarranties = new Map<string, ISelectedWarranties>();
  public ChosenPackets$: Observable<IPacketNWarranties>;

  @Input('state') public state: CheckoutStates;
  @Input('isTablet') set _(isTablet: boolean) { this.isSticky = isTablet; this.isStickyCartOpen = !isTablet; }
  @ViewChild('innerhide') public HIDE;

  constructor(
    public checkoutService: TimMyPetCheckoutService,
    private nypIadDocumentaryService: NypIadDocumentaryService,
    public nypDataService: NypDataService,
    private modalService: NgbModal,

  ) { }

  ngOnInit(): void {
    this.nypDataService.CurrentProduct$.pipe(take(1)).subscribe(product => {
      this.documentToDownload = product?.informativeSet;

      product
        .packets
        ?.forEach(p => {
          switch (p?.sku) {
            case 'tim-my-pet-smart': {
              this.packetAndWarranties.set('smart', { packet: 'customers_tim_pet.insurance_info_smart_title_mp', warranties: p.warranties?.map(w => w.translationCode) });
            }; break;
            case 'tim-my-pet-deluxe': {
              this.packetAndWarranties.set('deluxe', { packet: 'customers_tim_pet.insurance_info_deluxe_title_mp', warranties: p.warranties?.map(w => w.translationCode) });
            }; break;
            case 'tim-my-pet-smart-plus': {
              this.packetAndWarranties.set('smart-plus', { packet: 'customers_tim_pet.insurance_info_smart_plus_title_mp', warranties: p.warranties?.map(w => w.translationCode) });
            }; break;
          }
        });
    });
  }

  toggleStickyCart() {
    this.isStickyCartOpen = !this.isStickyCartOpen;
  }

  downloadProductDocuments() {
    this.nypIadDocumentaryService.downloadFileFromUrl({ filename: this.documentToDownload?.split('/')?.pop(), remoteUrl: this.documentToDownload })
      .pipe(
        map(r => ({ content: r, filename: this.documentToDownload?.split('/')?.pop(), }))
      )
      .subscribe(b => saveAs(b.content, b.filename));
  }

}

export interface ISelectedWarranties {
  packet: string;
  warranties: string[];
}
