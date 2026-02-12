import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-navbar-tim-container',
    styleUrls: [],
    template: '<app-container [inputOptions]="options" [type]="navbarTim"></app-container>'
})
export class NavbarTimComponent implements OnInit {
    @Input() secondaryNavbar: boolean

    navbarTim = 'navbar-tim-container' 
    options: any[] = []
    
    ngOnInit() {
        this.options = [
            {secondaryNavbar: this.secondaryNavbar}
        ]
    }

}
