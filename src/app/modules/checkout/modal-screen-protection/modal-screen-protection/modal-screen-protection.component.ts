import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-screen-protection',
  templateUrl: './modal-screen-protection.component.html',
  styleUrls: ['./modal-screen-protection.component.scss']
})
export class ModalScreenProtectionComponent implements OnInit {


  @Input() content;

  constructor( public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

}
