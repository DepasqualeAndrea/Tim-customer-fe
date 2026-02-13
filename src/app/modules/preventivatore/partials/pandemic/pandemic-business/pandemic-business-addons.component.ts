import { Component, OnInit, Input, forwardRef } from '@angular/core';
import { PandemicBusinessAddon } from './pandemic-business-addon.model';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    selector: 'app-pandemic-business-addons',
    templateUrl: './pandemic-business-addons.component.html',
    styleUrls: ['./pandemic-business-addons.component.scss', '../../../preventivatoreY.component.scss'],
    providers: [
        { provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => PandemicBusinessAddonsComponent),
            multi: true
        }
    ],
    standalone: false
})
export class PandemicBusinessAddonsComponent implements OnInit {

  @Input() addons: PandemicBusinessAddon[];
  availablePandemicBusinessAddons = [];
  selectedPandemicBusinessAddonsValue: any;

  ngOnInit() {
    this.addons.forEach( (addOn) => {
      const selectableAddon = Object.assign(addOn, {selected: false});
      this.availablePandemicBusinessAddons.push(selectableAddon);
    });
  }

  writeValue(pandemicBusinessAddons: any): void {
    if (!!pandemicBusinessAddons) {
        this.selectedPandemicBusinessAddonsValue = [];
        pandemicBusinessAddons.forEach( (addOn) => {
           const selectedAddOn = this.availablePandemicBusinessAddons.find(( addOnItem) => addOnItem.id === addOn.id);
           selectedAddOn.selected = true;
           this.selectedPandemicBusinessAddonsValue.push(selectedAddOn);
        });
    }
  }

  propagateChange = (x: any) => {};
  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }
  public inputValueChanged(newValue) {
    this.writeValue(newValue);
    this.propagateChange(newValue);
  }
  registerOnTouched(fn: any): void {
  }
  setDisabledState?(isDisabled: boolean): void {
  }

  toggleSelectionAddons(addon) {
    addon.selected = !addon.selected;
    const selectedAddOns = this.getSelectedAddOns();
    this.inputValueChanged(selectedAddOns);
  }

  getSelectedAddOns() {
    return this.availablePandemicBusinessAddons.filter(addon => addon.selected === true);
  }

  getAddonsDataCyValue(code) {
    return 'pmi-pandemic-quotator-addons__' + code.toLowerCase();
}

}
