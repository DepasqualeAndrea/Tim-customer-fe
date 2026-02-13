import {Component, Input, OnInit} from '@angular/core';
import {DataService} from '@services';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    standalone: false
})
export class HeaderComponent implements OnInit {

  @Input() headerContent;
  tenant: boolean;

  constructor(
    private dataService: DataService
  ) {
  }

  ngOnInit() {
    this.tenant = this.dataService.tenantInfo.tenant === 'imagin-es-es_db';
  }

}
