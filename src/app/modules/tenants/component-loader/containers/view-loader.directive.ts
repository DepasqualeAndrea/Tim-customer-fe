import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
    selector: '[appViewLoader]',
    standalone: false
})
export class ViewLoaderDirective {
    constructor(public viewRef: ViewContainerRef) { }
}
