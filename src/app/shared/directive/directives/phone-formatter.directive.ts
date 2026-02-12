import { Directive, ElementRef, HostListener, OnInit } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[phoneFormatter]'
})
export class PhoneFormatterDirective implements OnInit {

  constructor(
    private el: ElementRef,
    private control: NgControl
  ) {}

  ngOnInit() {
    setTimeout(() => {
      if (this.control.value) {
        const formatted = this.formatPhone(this.control.value);
        if (formatted !== this.control.value) {
          this.control.control?.setValue(formatted);
        }
      }
    });
  }

  @HostListener('blur')
  onBlur() {
    this.formatValue();
  }

  private formatValue() {
    const value = this.el.nativeElement.value;
    if (value) {
      const formatted = this.formatPhone(value);
      if (formatted !== value) {
        this.el.nativeElement.value = formatted;
        this.control.control?.setValue(formatted);
      }
    }
  }

  private formatPhone(phone: string): string {
    if (!phone) return phone;
    let cleaned = phone.replace(/[^\d+]/g, '');

    if (cleaned.startsWith('+39')) {
      return cleaned;
    }
    cleaned = cleaned.replace(/^\+/, '');

    if (cleaned.startsWith('39')) {
      return '+' + cleaned;
    }

    return '+39' + cleaned;
  }
}
