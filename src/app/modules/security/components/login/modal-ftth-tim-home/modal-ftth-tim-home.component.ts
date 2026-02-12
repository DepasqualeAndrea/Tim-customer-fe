import { Component, OnInit, Input } from "@angular/core";
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: "app-modal-ftth-tim-home",
  templateUrl: "./modal-ftth-tim-home.component.html",
  styleUrls: ["./modal-ftth-tim-home.component.scss"],
})
export class ModalFtthTimHomeComponent implements OnInit {
  @Input() kenticoContent: any;
  contentItem: any;

  constructor(public activeModal: NgbActiveModal, public router: Router) {}

  ngOnInit() {
    this.contentItem = this.contentStructureFromKenticoItem(this.kenticoContent);
  }

  contentStructureFromKenticoItem(kenticoItem: any) {
    return {
      close_icon: kenticoItem.close_icon.value[0].url
        ? kenticoItem.close_icon.value[0].url : null,
      warning_icon: kenticoItem.warning_icon.value[0].url
        ? kenticoItem.warning_icon.value[0].url : null,
      title: kenticoItem.title.value ? kenticoItem.title.value : null,
      desc: kenticoItem.desc ? kenticoItem.desc.value : null,
      btn_txt: kenticoItem.btn_txt ? kenticoItem.btn_txt.value : null,
    };
  }

  goToHomePage() {
    window.location.href = 'https://www.tim.it/fisso-e-mobile/mobile/servizi/mybroker';
  }

  closeModal(){
    this.router.navigate(['main-page']);
    this.activeModal.dismiss();
  }

}
