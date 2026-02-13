import { Component } from '@angular/core';

@Component({
    selector: 'app-contatti-container',
    styleUrls: [],
    template: '<app-container [type]="contacts"></app-container>',
    standalone: false
})
export class ContattiContainerComponent {
    contacts = 'contatti';
}