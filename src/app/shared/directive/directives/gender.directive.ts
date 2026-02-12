import { Directive, OnInit, OnDestroy } from '@angular/core';
import { NgControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Directive({
  selector: '[genderDirective]'
})
export class GenderDirective implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  constructor(private control: NgControl) {}

  ngOnInit() {
    setTimeout(() => {
      if (this.control.value && this.isValidFiscalCode(this.control.value)) {
        this.updateGender(this.control.value);
      }
    }, 100);

    this.control.valueChanges?.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(value => {
      if (value && this.isValidFiscalCode(value)) {
        this.updateGender(value);
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updateGender(fiscalCode: string) {
    const gender = this.getGenderFromFiscalCode(fiscalCode);

    if (gender) {
      const form = this.control.control?.parent;
      const genderControl = form?.get('gender');

      if (genderControl) {
        const currentValue = genderControl.value;
        if (currentValue !== gender) {
          genderControl.setValue(gender, { emitEvent: false });
          console.log(`[FiscalCode] Genere rilevato automaticamente: ${gender}`);
        }
      } else {
        console.warn('[FiscalCode] Campo gender non trovato nel form');
      }
    }
  }

  private getGenderFromFiscalCode(fiscalCode: string): 'Maschio' | 'Femmina' | null {
    if (!fiscalCode || fiscalCode.length < 11) {
      return null;
    }

    const dayString = fiscalCode.substring(9, 11);
    const day = parseInt(dayString, 10);

    if (isNaN(day)) {
      return null;
    }

    return day > 40 ? 'Femmina' : 'Maschio';
  }

  private isValidFiscalCode(fiscalCode: string): boolean {
    if (!fiscalCode || fiscalCode.length !== 16) {
      return false;
    }

    const pattern = /^[A-Z]{6}\d{2}[A-Z]\d{2}[A-Z]\d{3}[A-Z]$/i;
    return pattern.test(fiscalCode);
  }
}
