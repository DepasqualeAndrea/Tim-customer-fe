import {TargetTriggerService} from './target-trigger.service';
import { ElementRef, Input, OnDestroy, OnInit, Directive } from '@angular/core';

@Directive()
export abstract class Target implements OnInit, OnDestroy {

  @Input() targetId: string = null;
  targetElement: HTMLElement;
  private state: any;

  constructor(
    private service: TargetTriggerService,
    private elementRef: ElementRef
  ) {
    this.targetElement = elementRef.nativeElement as HTMLElement;
  }


  protected setState(state: any) {
    this.state = state;
  }
  protected getState(): any {
    return this.state;
  }

  ngOnInit(): void {
    this.service.registerTarget(this.targetId, this);
  }


  ngOnDestroy(): void {
    this.service.removeTarget(this.targetId);
  }


  abstract trigger(...args: any): void;
}
