import { Component } from "@angular/core";

@Component({
    selector: 'app-complaints-container',
    template: '<app-container [type]="complaints"></app-container>',
    standalone: false
})

export class ComplaintsContainerComponent {
    complaints = 'reclami';
}