import {ContentItem, Elements} from 'kentico-cloud-delivery';


export class AngularClickLink extends ContentItem {
  label: Elements.TextElement;
  event_data: Elements.TextElement;

  constructor() {
    super({
      richTextResolver: (item: AngularClickLink) => {
        // innerEvent comes from the TmpComponent created in DynamicSectionComponent
        return `<a (click)="innerEvent(${item.event_data.value})">${item.label.value}</a>`;
      }
    });
  }
}
