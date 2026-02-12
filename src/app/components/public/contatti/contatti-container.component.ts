import { Component } from '@angular/core';

@Component({
    selector: 'app-contatti-container',
    styleUrls: [],
    template: '<app-container [type]="contacts"></app-container>'
})
export class ContattiContainerComponent {
    contacts = 'contatti';
}