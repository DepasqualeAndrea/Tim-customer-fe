import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-activate-modal',
  templateUrl: './activate-modal.component.html',
  styleUrls: ['./activate-modal.component.scss']
})
export class ActivateModalComponent implements OnInit {

  @Input() public activated: boolean;

  constructor(
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit() {
  }

}
