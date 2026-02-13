import { DataService } from  '@services';
import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-per-addon-claim-one-box-layout',
    templateUrl: './per-addon-claim-one-box-layout.component.html',
    styleUrls: ['./per-addon-claim-one-box-layout.component.scss'],
    standalone: false
})
export class PerAddonClaimOneBoxLayoutComponent implements OnInit {

  @Input() public policyData;
  @Input() public claimInfo;
  listAnullamento: any;
  listAssistenza: any;

  constructor(public dataService: DataService) { }

  ngOnInit() {
  }


}
