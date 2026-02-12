import { Directive, Input, Output, EventEmitter, OnInit, Inject, ElementRef, OnDestroy } from '@angular/core';
import { GtmService } from 'app/core/services/gtm/gtm.service';
import { Observable, fromEvent, Subscription } from 'rxjs';
import { GTMTrigger } from './gtm-settings.model';
import { GtmHandlerService } from 'app/core/services/gtm/gtm-handler.service';

@Directive({
    selector: '[gtmEvent]'
})
export class GtmEventDirective implements OnInit, OnDestroy {
    @Input('gtmEvent') eventName: string;
    @Input('tenant') tenant: string;
    @Output() pendingPush: EventEmitter<GtmService> = new EventEmitter<GtmService>();
    private event$: Observable<any>;
    private subscription: Subscription;

    constructor(private el: ElementRef, public gtmService: GtmService, private gtmHandler: GtmHandlerService) {}

    ngOnInit() {
        this.event$ = fromEvent(this.el.nativeElement, this.eventName);
        this.subscription = this.event$.subscribe(() => {
          this.gtmHandler.requireTenant(this.tenant);
          if(this.gtmHandler.isEnabledFor(GTMTrigger.Events) && !this.gtmHandler.isException(GTMTrigger.Events) && this.gtmHandler.checkTenant()) {
              this.pendingPush.emit(this.gtmService);
          }
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
