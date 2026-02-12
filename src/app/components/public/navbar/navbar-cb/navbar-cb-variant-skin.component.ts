import { OnDestroy, AfterViewChecked, Directive } from '@angular/core';

@Directive()
export abstract class NavbarCbVariantSkinComponent implements AfterViewChecked, OnDestroy {

  ngAfterViewChecked(): void {
    const nav = document.getElementById('nav-main');
    const navsuv = document.getElementById('nav-sub');
    if (nav) {
      nav.classList.add('variant');
    }
    if (navsuv) {
      navsuv.classList.add('variant');
    }
  }

  ngOnDestroy(): void {
    const nav = document.getElementById('nav-main');
    const navsuv = document.getElementById('nav-sub');
    if (nav) {
      nav.classList.remove('variant');
    }
    if (navsuv) {
      navsuv.classList.remove('variant');
    }
  }
}
