import {AfterContentChecked, AfterViewChecked, Component, ElementRef, Input, OnChanges, OnInit, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'app-how-works-table',
  templateUrl: './how-works-table.component.html',
  styleUrls: ['../preventivatoreCT.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HowWorksTableComponent implements OnInit, AfterContentChecked {

  @Input() productInformation;

  constructor(private elementRef: ElementRef) {
  }

  ngOnInit() {}

  ngAfterContentChecked(): void {
    const openEls = this.elementRef.nativeElement.querySelector('.open');
    const closeEls = this.elementRef.nativeElement.querySelector('.close');

    if (openEls) {
      openEls.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        const accordion = document.getElementsByClassName('accordion')[0];
        if (!accordion.classList.contains('active')) {
          accordion.classList.add('active');
          document.getElementsByClassName('toggle-accordion')[0].classList.add('active');
        }
      });
    }

    if (closeEls) {
      closeEls.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        const accordion = document.getElementsByClassName('accordion')[0];
        if (accordion.classList.contains('active')) {
          const scrollFrom = this.offsetTop;
          accordion.classList.remove('active');
          document.getElementsByClassName('toggle-accordion')[0].classList.remove('active');
          const target = document.getElementsByClassName('table')[0];
          animate(document.scrollingElement || document.documentElement, 'scrollTop', '', scrollFrom, target['offsetTop'], 500, true);
        }
      });
    }

    function animate(elem, style, unit, from, to, time, prop) {
      if (!elem) {
        return;
      }
      const start = new Date().getTime(),
        timer = setInterval(function () {
          const step = Math.min(1, (new Date().getTime() - start) / time);
          if (prop) {
            elem[style] = (from + step * (to - from)) + unit;
          } else {
            elem.style[style] = (from + step * (to - from)) + unit;
          }
          if (step === 1) {
            clearInterval(timer);
          }
        }, 25);
      if (prop) {
        elem[style] = from + unit;
      } else {
        elem.style[style] = from + unit;
      }
    }
  }
}
