import { OnInit, ViewChild, ComponentRef, Input, ComponentFactory, Component, Output, EventEmitter, OnDestroy } from '@angular/core';
import { ComponentMapper } from '../component-mapper.service';
import { Observable, of, BehaviorSubject, Subject } from 'rxjs';
import { ViewLoaderDirective } from './view-loader.directive';



@Component({
    selector: 'app-container',
    template: '<ng-template appViewLoader></ng-template>',
    standalone: false
})
export class ContainerComponent implements OnInit, OnDestroy {
    @ViewChild(ViewLoaderDirective, { static: true }) private view: ViewLoaderDirective;

    @Input() inputOptions: any[]

    @Input() type: string;
    @Input() componentInputData: { [key: string]: any } = {};
    @Input() componentEventHandlers: { [eventName: string]: Function } = {};
    @Output() loaded: EventEmitter<boolean> = new EventEmitter();

    private subscribedEvents: EventEmitter<any>[] = [];
    protected componentRef: ComponentRef<any>;
    private referenceComponentSubject: Subject<any> = new Subject<any>();
    referenceComponent$ = this.referenceComponentSubject.asObservable();

    constructor(
        protected componentMapper: ComponentMapper
    ) { }

    ngOnInit(): void {
        this.load();
    }

    /**
     * Sets attributes to reference reading from componentInputData, used through binding
     */
    private loadInputData(): void {
        if (this.componentInputData) {
            Object.entries(this.componentInputData).forEach(p => {
                this.componentRef.instance[p[0]] = p[1];
            });
        }
    }

    /**
     * Sets event handlers reading from componentEventsHandler, used throught binding
     */
    private loadEventHandlers(): void {
        if (this.componentEventHandlers) {
            Object.entries(this.componentEventHandlers).forEach(e => {
                const event = this.componentRef.instance[e[0]];

                if (event && event instanceof EventEmitter) {
                    this.subscribedEvents.push(event);
                    event.subscribe(e[1]);
                }
            });
        }
    }

    ngOnDestroy() {
        this.subscribedEvents.forEach(event => {
            event.unsubscribe();
        });
        this.subscribedEvents.slice(0, this.subscribedEvents.length);
    }

    private load(): boolean {
        const targetComponent: ComponentFactory<any> = this.componentMapper.getComponentFor(this.type);
        if (!targetComponent) {
            this.loaded.emit(false);
            return false;
        }

        this.view.viewRef.clear();
        this.componentRef = this.view.viewRef.createComponent(targetComponent);

        if (!!this.inputOptions && this.inputOptions.length > 0) {
            this.inputOptions.forEach(option => {
                const entries = Object.entries(option)
                for (const [key, value] of entries) {
                    this.componentRef.instance[key] = value
                }
            })
        }

        this.loadInputData();
        this.loadEventHandlers();

        this.referenceComponentSubject.next(this.componentRef);
        this.loaded.emit(true);
        return true;
    }

    /**
     * Loads another component at runtime.
     * @param type is the id of the component registered throught the service
     */
    loadComponent(type: string): boolean {
        this.type = type;
        return this.load();
    }

    /**
     * Bind a custom event defined into referenced component to a function called when the event raises
     * @param eventName name of the custom event (attribute name)
     * @param callback Function to call when event raises.
     */
    defineEvent(eventName: string, callback: Function) {
        if (!this.componentRef || !this.componentRef.instance) {
            // L'istanza non è ancora stata caricata. Assegna la definizione dell'evento all'ogetto
            // di inizializzazione degli eventi.
            Object.assign(this.componentEventHandlers, { [eventName]: callback });
        } else {
            // gestisci la sottoscrizione dell'evento e aggiorna l'array degli eventi sottoscritti
            const event = this.componentRef.instance[eventName];
            if (event && event instanceof EventEmitter) {
                const indexOfEvent = this.subscribedEvents.findIndex(e => e === event);
                if (indexOfEvent >= 0) {
                    const existingEvent = this.subscribedEvents[indexOfEvent];
                    existingEvent.unsubscribe();
                    this.subscribedEvents.splice(indexOfEvent, 1);
                }

                event.subscribe(callback);
                this.subscribedEvents.push(event);
            }
        }

    }


    getReference(): Observable<any> {
        return this.referenceComponent$;
    }
}
