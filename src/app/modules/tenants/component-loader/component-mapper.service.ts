import { Injectable, ComponentFactory} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ComponentMapper {
    private map: Map<string, ComponentFactory<any>> = new Map<string, ComponentFactory<any>>();

    constructor() {
    }

    setComponentFor(contentId: string, factory: ComponentFactory<any> ) {
        this.map.set(contentId, factory);
    }
    getComponentFor(contentId: string): ComponentFactory<any> {
        return this.map.get(contentId);
    }

}

