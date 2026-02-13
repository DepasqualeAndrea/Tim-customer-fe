import { DataService} from '@services';
import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-per-addon-claim-tabs-layout',
    templateUrl: './per-addon-claim-tabs-layout.component.html',
    styleUrls: ['./per-addon-claim-tabs-layout.component.scss'],
    standalone: false
})
export class PerAddonClaimTabsLayoutComponent implements OnInit {

  @Input() public policyData;
  @Input() public claimInfo;
  listAnullamento: any;
  listAssistenza: any;

  constructor(public dataService: DataService) { }

  ngOnInit() {
  }



}
