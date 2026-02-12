import {TargetTriggerService} from './target-trigger.service';
import {Directive, ElementRef, Input, OnInit} from '@angular/core';
import {Target} from './target';
import * as moment from 'moment';
import {Moment} from 'moment';

@Directive()
export abstract class Trigger implements OnInit {

  @Input() targetId: string = null;
  private onEvents: string[] = [];
  private targets: Target[] = [];
  private triggerElement: HTMLElement;
  private lastUpdate: Moment = null;


  constructor(
    private service: TargetTriggerService,
    private elementReference: ElementRef
  ) {
    this.triggerElement = elementReference.nativeElement as HTMLElement;
  }

  private initEvents() {
    this.customizeEvents(this.onEvents);

    this.onEvents.forEach(eventName => {
      this.triggerElement.addEventListener(eventName, () => {
        this.updateTargets();
        this.targets.forEach(target => {
          this.trigger(target, eventName);
        });
      })
    });
  }


  private castToTargets(targetString: string): Target[] {
    const targets: Target[] = [];
    const targetIds: string [] = targetString.split(/,\s*/);
    targetIds.forEach(id => {
      const target: Target = this.service.getTarget(id);
      if(!!target) {
        targets.push(this.service.getTarget(id))
      }
    });
    return targets;
  }
  private updateTargets(): void {
    if(!this.lastUpdate || this.service.isToUpdate(this.lastUpdate)) {
      this.lastUpdate = moment();
      if(!this.targetId) {
        this.targets = this.service.getAllTargets();
      } else {
        this.targets = this.castToTargets(this.targetId);
      }
    }
  }
  ngOnInit(): void {
    this.initEvents();
  }

  abstract customizeEvents(events: string[]): void;
  abstract trigger(target: Target, eventName: string): void;

}
