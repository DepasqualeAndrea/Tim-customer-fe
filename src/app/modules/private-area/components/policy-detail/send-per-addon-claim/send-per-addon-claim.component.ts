import { NypInsurancesService } from '@NYP/ngx-multitenant-core';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataService, InsurancesService } from '@services';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { Policy } from 'app/modules/private-area/private-area.model';
import { ContentItem } from 'kentico-cloud-delivery';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-send-per-addon-claim',
  templateUrl: './send-per-addon-claim.component.html',
  styleUrls: ['./send-per-addon-claim.component.scss']
})
export class SendPerAddonClaimComponent implements OnInit {

  policy: Policy;

  @Input() public policyData;
  addons: any;
  addon = null;
  tripCancItems: ContentItem;
  tripAssistance: ContentItem;
  baggage: ContentItem;
  planeDelay: ContentItem;
  flightInjuries: ContentItem;
  thirdPartyLiability: ContentItem;
  legalProtection: ContentItem;
  medicalExpenses: {};
  missConnection: {};


  constructor(
    public activeModal: NgbActiveModal,
    public dataService: DataService,
    private route: ActivatedRoute,
    private kenticoTranslateService: KenticoTranslateService,
    private modalService: NgbModal,
    private nypInsurancesService: NypInsurancesService
  ) { }

  ngOnInit() {
    this.policy = this.route.snapshot.data.policy;
    this.oneBoxLayoutContainer();
    this.twoBoxesLayoutContainer();
    this.nypInsurancesService.getInsuranceById(this.policyData.id).subscribe(res => {
      this.addons = res.addons;
    });
  }

  private oneBoxLayoutContainer(): void {
    this.kenticoTranslateService.getItem<ContentItem>('addon_layout_container').pipe(take(1)).subscribe(item => {
      this.tripCancItems = item.claim_addons.claim_annullamento_viaggio;
      this.tripAssistance = item.claim_addons.claim_assistenza_in_viaggio;
      this.planeDelay = item.claim_addons.ritardo_aereo;
      this.flightInjuries = item.claim_addons.infortuni_in_viaggio;
      this.thirdPartyLiability = item.claim_addons.responsabilita_civile_terzi;
      this.legalProtection = item.claim_addons.tutela_legale_addon;
      this.baggage = item.claim_addons.claim_bagaglio;
    });
  }

  private twoBoxesLayoutContainer(): void {
    this.kenticoTranslateService.getItem<ContentItem>('addon_two_boxes_layout').pipe(take(1)).subscribe(item => {
      this.medicalExpenses = { box_one: item.box_one.value[0], box_two: item.box_two.value[0] };
      this.missConnection = { box_one: item.box_one.value[1], box_two: item.box_two.value[1] };
    });
  }

  selectAddon(addon) {
    this.addon = addon.code;
  }


}
