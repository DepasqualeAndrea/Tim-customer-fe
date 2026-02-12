import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
    selector: '[appViewLoader]'
})
export class ViewLoaderDirective {
    constructor(public viewRef: ViewContainerRef) {}
}
