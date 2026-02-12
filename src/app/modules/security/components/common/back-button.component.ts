import { EventEmitter, Input, Output, Directive } from '@angular/core';

@Directive()
export abstract class BackButtonComponent {

  @Input() backButton = false;
  @Output() goBack = new EventEmitter<void>();

  backClicked() {
    this.goBack.emit();
  }
}
