import {AfterViewInit, Component, Input, OnChanges, OnDestroy, SimpleChanges, ViewChild, ViewContainerRef, Output, EventEmitter} from '@angular/core';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { TmpComponent } from './tmp.component';

@Component({
    selector: 'app-dynamic-section',
    templateUrl: './dynamic-section.component.html',
    styleUrls: ['./dynamic-section.component.scss'],
    standalone: false
})
export class DynamicSectionComponent implements AfterViewInit, OnChanges, OnDestroy {

  @Input() dynamicHtml: any;
  @Output() innerEvent = new EventEmitter<any>();

  @ViewChild('vc', { read: ViewContainerRef, static: true }) vc: ViewContainerRef;

  constructor() {
  }

  ngAfterViewInit() {
    this.createComponentFromRaw(this.dynamicHtml);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.dynamicHtml && !changes.dynamicHtml.firstChange) {
      this.createComponentFromRaw(this.dynamicHtml);
    }
  }

  private createComponentFromRaw(template: string) {
    if (!template) {
      return;
    }

    this.vc.clear();
    const componentRef = this.vc.createComponent(TmpComponent);
    componentRef.instance.template = template;
    componentRef.instance.tmpInnerEvent
      .pipe(untilDestroyed(this))
      .subscribe(eventData => this.innerEvent.emit(eventData));
  }

  ngOnDestroy(): void {
  }
}
