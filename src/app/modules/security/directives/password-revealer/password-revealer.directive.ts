import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
    selector: '[password-revealer]'
})
export class PasswordRevealerDirective implements OnInit {
    @Input('password-revealer') canShowPassword = true;

    private visible = false;
    private inputElement: HTMLInputElement;
    private eyeElement: HTMLElement;


    constructor(private el: ElementRef) {
        this.inputElement = el.nativeElement as HTMLInputElement;
    }

    ngOnInit() {
        if (this.canShowPassword) {
            this.eyeElement = document.createElement('i');
            this.eyeElement.classList.add('password-revealer', 'far', 'fa-eye-slash');

            this.eyeElement.addEventListener('click', (ev) => {
                this.eyeClick(this.eyeElement, ev);
            });
            this.inputElement.parentNode.appendChild(this.eyeElement);
        }
    }


    private eyeClick(element: HTMLElement, ev: MouseEvent) {
        if (this.visible) {
            element.classList.remove('fa-eye');
            element.classList.add('fa-eye-slash');
            this.visible = false;
            this.inputElement.setAttribute('type', 'password');
        } else {
            element.classList.remove('fa-eye-slash');
            element.classList.add('fa-eye');
            this.visible = true;
            this.inputElement.setAttribute('type', 'text');
        }
    }

}
