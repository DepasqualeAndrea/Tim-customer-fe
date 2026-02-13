import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
    selector: 'app-quotator-y-multirischi-modal-error-format',
    templateUrl: './quotator-y-multirischi-modal-error-format.component.html',
    styleUrls: ['./quotator-y-multirischi-modal-error-format.component.scss'],
    standalone: false
})
export class QuotatorYMultirischiModalErrorFormatComponent implements OnInit {
  @Input() kenticoItem: any;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

}
