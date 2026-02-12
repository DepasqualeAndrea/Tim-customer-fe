import { NypIadDocumentaryService } from '@NYP/ngx-multitenant-core';
import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { CheckoutStates, Packet } from 'app/modules/nyp-checkout/models/api.model';
import { NypDataService } from 'app/modules/nyp-checkout/services/nyp-data.service';
import { map, take } from 'rxjs/operators';
import { TimForSkiCheckoutService } from '../../services/checkout.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { InfoDetailsModalComponent } from '../../modal/info-details-modal/info-details-modal.component';
import { DataService } from '@services';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss', '../../../../styles/shopping-cart.scss', '../../../../styles/size.scss', '../../../../styles/colors.scss', '../../../../styles/text.scss', '../../../../styles/common.scss'],
  providers: [DatePipe]
})
export class ShoppingCartComponent implements OnInit {
  public Order$ = this.nypDataService.Order$;
  public isStickyCartOpen = true;
  public isSticky: boolean = false;
  public showStates: CheckoutStates[] = ['insurance-info', 'login-register', 'address', 'survey', 'payment', 'consensuses', 'thank-you'];
  private documentToDownload: string;
  public selectedPacket: string;
  public warranties: string;

  isSeasonal: boolean;
  redirectToThankYou: boolean = false;

  @Input('state') public state: CheckoutStates;
  @Input('isTablet') set _(isTablet: boolean) { this.isSticky = isTablet; this.isStickyCartOpen = !isTablet; }
  @ViewChild('innerhide') public HIDE;

  constructor(
    public checkoutService: TimForSkiCheckoutService,
    private nypIadDocumentaryService: NypIadDocumentaryService,
    public nypDataService: NypDataService,
    private modalService: NgbModal,
    public dataService: DataService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.isSeasonal = this.Order$.value.packet.data.sku.includes('season') ? true : false;

    if (this.router.url.includes('thank-you')) {
      this.redirectToThankYou = true;
    }

    const packetCode = this.nypDataService.Order$.value.packet.data.product.code;
    this.selectedPacket = this.getSelectedPacket(packetCode);
    this.warranties = this.nypDataService.Order$.value.packet.data.warranties[0].anagWarranty.name;

    this.nypDataService.CurrentProduct$.pipe(take(1)).subscribe(product =>
      this.documentToDownload = product?.informativeSet
    );

    const customOrder = [1, 20, 21, 22, 23, 2];
    this.nypDataService.Order$.value.packet.data.warranties.sort((a, b) => {
      const idA = a.anagWarranty.id;
      const idB = b.anagWarranty.id;
      const indexA = customOrder.indexOf(idA);
      const indexB = customOrder.indexOf(idB);
      return indexA - indexB;
    });

    if (this.Order$.value.orderItem[0].insured_item?.start_date && this.Order$.value.orderItem[0].insured_item?.expiration_date) {
      const insuredItem = this.Order$.value.orderItem[0].insured_item;

      if (insuredItem.start_date) {
        this.dataService.firstDay = new Date(insuredItem.start_date);
      }

      if (insuredItem.expiration_date) {
        if (!this.dataService.lastDay) {
          console.warn("lastDay non è impostato in DataService, correggo...");
        }
        this.dataService.lastDay = new Date(insuredItem.expiration_date);
      }
    }
  }

    packetIsSeasonal(packet: Packet): boolean {
      return [
        'tim-for-ski-silver-season', 
        'tim-for-ski-gold-season', 
        'tim-for-ski-platinum-season'
      ].includes(packet?.sku);
    }

  getSelectedPacket(code: string): string {
    switch (code) {
      case 'tim-for-ski-silver':
        return 'BLU';
      case 'tim-for-ski-gold':
        return 'ROSSA';
      case 'tim-for-ski-platinum':
        return 'NERA';
      default:
        return '';
    }
  }

  toggleStickyCart() {
    this.isStickyCartOpen = !this.isStickyCartOpen;
  }

  downloadProductDocuments() {
    this.nypIadDocumentaryService.downloadFileFromUrl({
      filename: this.documentToDownload?.split('/')?.pop(),
      remoteUrl: this.documentToDownload
    })
    .pipe(
      map(r => ({
        content: r,
        filename: this.documentToDownload?.split('/')?.pop()
      }))
    )
    .subscribe(b => saveAs(b.content, b.filename));
  }

  openInfoDetailsModal() {
    const modalRef = this.modalService.open(InfoDetailsModalComponent, {
      size: "lg",
      windowClass: "modal-window",
    });
  }

  formatDate(dateString: string): Date {
    return new Date(dateString);
  }

  formatSeasonalStartDate(dateString: string): Date {
    const date = new Date(dateString);
    date.setDate(date.getDate() - 1);
    return date;
  }
}
