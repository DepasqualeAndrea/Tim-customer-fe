import { Input, Output, EventEmitter, ChangeDetectorRef, OnChanges, Directive, ViewContainerRef, OnInit, ElementRef } from '@angular/core';
import { QuotatorLeasysComponent } from '../quotator-leasys/quotator-leasys.component';
@Directive({
    selector: '[appSelectedValues]'
})
export class SelectedValuesDirective implements OnInit {
    constructor(private viewContainerRef: ViewContainerRef) {

    }
    private _data: any = null;
    ngOnInit(): void {
 
    }
    @Input()
    set appSelectedValues(data: any) {
        const detectChanges = !!data && !(data === this.data);
        this._data = data;
        if (detectChanges && this.viewContainerRef) {
            const view = this.viewContainerRef as any;
            const component = view._view.component;
            component.selectedValuesChanged();
        }
    }
    get data(): any { return this._data; }
}
