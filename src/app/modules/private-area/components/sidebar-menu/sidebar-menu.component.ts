import {Component, OnDestroy, OnInit} from '@angular/core';
import {DataService} from '@services';
import { ComponentFeaturesService } from 'app/core/services/componentFeatures.service';

@Component({
  selector: 'app-private-area-sidebar-menu',
  templateUrl: './sidebar-menu.component.html',
  styleUrls: ['./sidebar-menu.component.scss']
})
export class PrivateAreaSidebarMenuComponent implements OnInit, OnDestroy {

  menuItems: any[] = [];
  sidebarMenuEnabled: boolean;

  constructor(
     public dataService: DataService,
     private componentFeaturesService: ComponentFeaturesService,
  ) {
  }

  ngOnInit() {
    this.componentFeaturesService.useComponent('private-area');
    this.componentFeaturesService.useRule('sidebar-menu');
    this.sidebarMenuEnabled = this.componentFeaturesService.isRuleEnabled();
    if (this.dataService.isTenant('imagin-es-es_db')) {
      this.dataService.getImaginLoggedMenu().subscribe(menuItems => this.menuItems = menuItems);
    } else {
      this.dataService.getLoggedMenu().subscribe(menuItems => this.menuItems = menuItems);
    }
  }

  redirectExternal() {
    window.location.href = 'https://www.tim.it/fisso-e-mobile/mobile/servizi/mybroker';
  }

  ngOnDestroy() {
  }


}
