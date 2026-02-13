import { Component } from '@angular/core';

@Component({
    selector: 'app-chi-siamo',
    styleUrls: [],
    template: '<app-container [type]="whoweare"></app-container>',
    standalone: false
})
export class ChiSiamoPageComponent {
    whoweare = 'chi-siamo'
}