import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Packet, RecursivePartial } from "app/modules/nyp-checkout/models/api.model";

@Component({
    selector: 'app-packet-selector',
    templateUrl: './packet-selector.component.html',
    styleUrls: ['./packet-selector.component.scss'],
    standalone: false
})
export class PacketSelectorComponent {

  @Input() packets: RecursivePartial<Packet>[] = [];
  @Input() warrantyTitle?: string;
  @Input() selectedPacketId?: number;
  @Input() warrantiesIconSrc?: string;
  @Input() priceCtaLabel?: string;
  @Input() priceCtaIconSrc?: string;
  @Input() priceBottomLabel?: string;
  @Input() addButtonLabel?: string;
  @Input() addButtonIconSrc?: string;
  @Input() removeButtonLabel?: string;
  @Input() removeButtonIconSrc?: string;
  @Output() packetSelected = new EventEmitter<RecursivePartial<Packet>>();
  @Output() showDetailsModal = new EventEmitter<RecursivePartial<Packet>>();

  constructor() {}

  selectPacket(packet: RecursivePartial<Packet>) {
    this.packetSelected.emit(packet);
      
  }

  showDetailsModalEmit(packet: RecursivePartial<Packet>){
    this.showDetailsModal.emit(packet);
  }

}