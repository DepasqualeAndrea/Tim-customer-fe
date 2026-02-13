import {Component, Input, OnInit, EventEmitter, Output} from '@angular/core';
import { Addons } from '@model';
import { keyframes } from '@angular/animations';


@Component({
    selector: 'app-checkout-card-addons',
    templateUrl: './checkout-card-addons.component.html',
    styleUrls: ['./checkout-card-addons.component.scss'],
    standalone: false
})
export class CheckoutCardAddonsComponent implements OnInit {

  @Input() addons: Array<Addons>;
  @Input() addonsFunctionalities: Array<any>;
  @Input() productName: string;

  @Output() toggledAddon = new EventEmitter<Addons>();

  activeAddonsFunctionalities: Array<any>;

  constructor() {
  }

  ngOnInit() {
    this.getAddonsList();
  }

  getAddonsList() {
    return this.activeAddonsFunctionalities = this.addonsFunctionalities
      .filter(a => a.ProductSelectable)
      .map(addonFunc =>
        Object.assign(addonFunc, this.addons.find(addon => addon.code.includes(addonFunc.SubModuleCode)), {selected: false})
      )
      .reduce((prev, cur) => {
        prev[cur.Module] = prev[cur.Module] || [];
        prev[cur.Module].push(cur);
        return prev;
      }, {});
  }

  toggleAddon(addon, categoryName) {
    if (this.isDisabled(addon, categoryName)) {
      return;
    }
    addon.selected = !addon.selected;
    this.toggledAddon.emit(addon);
    if (addon.selected) {
      this.activeAddonsFunctionalities[categoryName]
        .filter(a => a.ProductMandatory)
        .forEach(mandatoryAddom => {
          if(!mandatoryAddom.selected) {
            mandatoryAddom.selected = true;
            this.toggledAddon.emit(mandatoryAddom);
          }
        });
    }
  }

  isDisabled(addon, categoryName) {
    return (addon.ProductMandatory && this.activeAddonsFunctionalities[categoryName].filter(ad => !ad.ProductMandatory).some(a => a.selected));
  }

}

