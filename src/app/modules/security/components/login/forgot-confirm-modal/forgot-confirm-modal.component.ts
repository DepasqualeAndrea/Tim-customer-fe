import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { debounceTime } from 'rxjs/operators';


@Component({
  selector: 'app-forgot-confirm-modal',
  templateUrl: './forgot-confirm-modal.component.html',
  styleUrls: ['./forgot-confirm-modal.component.scss']
})
export class ForgotConfirmModalComponent implements OnInit {

  @Input() sent: boolean;

  constructor(
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit() {
  }

}
