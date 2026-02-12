import { NypIadDocumentaryService } from '@NYP/ngx-multitenant-core';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataService } from '@services';
import { CheckoutStates } from 'app/modules/nyp-checkout/models/api.model';
import { NypDataService } from 'app/modules/nyp-checkout/services/nyp-data.service';
import { map } from 'rxjs/operators';
import { InfoDetailsModalComponent } from '../../modal/info-details-modal/info-details-modal.component';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss', '../../../../../../styles/shopping-cart.scss', '../../../../../../styles/size.scss', '../../../../../../styles/colors.scss', '../../../../../../styles/text.scss', '../../../../../../styles/common.scss']
})
export class ShoppingCartComponent implements OnInit {
  public Order$ = this.nypDataService.Order$;
  public isStickyCartOpen = true;
  public isSticky: boolean = false;
  public showStates: CheckoutStates[] = ['login-register', 'address', 'insurance-info', 'survey', 'payment', 'consensuses', 'thank-you'];
  private documentToDownload: any;
  public selectedPacket: string;
  public warranties: string[] = [];
  public startDate: string;
  public endDate: string;
  redirectToThankYou: boolean = false;
  public destination: any;
  @Input('state') public state: CheckoutStates;
  @Input('isTablet') set _(isTablet: boolean) { this.isSticky = isTablet; this.isStickyCartOpen = !isTablet; }
  @ViewChild('innerhide') public HIDE;

  constructor(
    private nypIadDocumentaryService: NypIadDocumentaryService,
    public nypDataService: NypDataService,
    private modalService: NgbModal,
    public dataService: DataService,
    private router: Router,

  ) { }

  ngOnInit(): void {
    this.destination = this.nypDataService.Order$?.value?.orderItem[0]?.insured_item?.destination,


      this.startDate = this.formatDateToDMY(new Date(this.nypDataService.Order$.value?.orderItem[0]?.insured_item.start_date));
    this.endDate = this.formatDateToDMY(new Date(this.nypDataService.Order$.value?.orderItem[0]?.insured_item.expiration_date));

    if (this.router.url.includes('thank-you')) {
      this.redirectToThankYou = true;
    }

    console.log('Selected Packet:', this.nypDataService.Order$.value.packet.data.product.code);

    this.warranties = (this.nypDataService.Order$.value.packet.data.warranties.map(warranty => warranty.anagWarranty.name)).sort();
    console.log("Warranties:", this.warranties);

    this.documentToDownload = this.nypDataService.Order$.value.product?.data.informativeSet;

  }
  formatDateToDMY(date: Date): string {
    if (!date) return '';
    const day = ('0' + date.getUTCDate()).slice(-2);
    const month = ('0' + (date.getUTCMonth() + 1)).slice(-2);
    const year = date.getUTCFullYear();

    return `${day}/${month}/${year}`;
  }
  formatDateToISOString(date: Date): string {
    if (!date) return '';
    return date.toISOString().slice(0, 10);
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

  openInfoDetailsModal() {
    const modalRef = this.modalService.open(InfoDetailsModalComponent, {
      size: "lg",
      windowClass: "modal-window",
    });
  }

  formatSeasonalStartDate(dateString: string): Date {
    const date = new Date(dateString);
    date.setDate(date.getDate() - 1);
    return date;
  }
}
export interface ISelectedWarranties {
  packet: string;
  warranties: string[];
}
