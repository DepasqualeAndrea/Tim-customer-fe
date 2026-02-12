import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-quotator-y-multirischi-modal-ateco-vat',
  templateUrl: './quotator-y-multirischi-modal-ateco-vat.component.html',
  styleUrls: ['./quotator-y-multirischi-modal-ateco-vat.component.scss']
})
export class QuotatorYMultirischiModalAtecoVatComponent implements OnInit {
  @Input() kenticoContent: any;
  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {

  }

}
