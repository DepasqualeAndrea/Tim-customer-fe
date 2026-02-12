import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { LegalProtectionAddon } from './legal-protection-addon.model';
import { Component, forwardRef, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-legal-protection-addons',
    templateUrl: './legal-protection-addons.component.html',
    styleUrls: ['./legal-protection-addons.component.scss', '../../preventivatoreY.component.scss'],
    providers: [
          { provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => LegalProtectionAddonsComponent),
            multi: true
          }
      ]
  })
export class LegalProtectionAddonsComponent implements ControlValueAccessor, OnInit {

    @Input() addons: LegalProtectionAddon[];
    @Input() labelCopertureOpzionali: string;
    availableLegalProtetionAddons = [];
    selectedlegalProtectionAddonsValue: any;

    ngOnInit() {
        this.addons.forEach( (addOn) => {
            const selectableAddon = Object.assign(addOn, {selected: false});
            this.availableLegalProtetionAddons.push(selectableAddon);
        });
    }


    writeValue(legalProtectionAddons: any): void {
        if (!!legalProtectionAddons) {
            this.selectedlegalProtectionAddonsValue = [];
            legalProtectionAddons.forEach( (addOn) => {
               const selectedAddOn = this.availableLegalProtetionAddons.find(( addOnItem) => addOnItem.id === addOn.id);
               selectedAddOn.selected = true;
               this.selectedlegalProtectionAddonsValue.push(selectedAddOn);
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
        return this.availableLegalProtetionAddons.filter(addon => addon.selected === true);
    }
    getAddonsDataCyValue(code) {
        return 'das-quotator-addons__' + code.toLowerCase();
    }
}
