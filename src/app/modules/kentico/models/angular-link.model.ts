import {ContentItem, Elements} from 'kentico-cloud-delivery';


export class AngularLink extends ContentItem {
  label: Elements.TextElement;
  value: Elements.TextElement;
  constructor() {
    super({

      richTextResolver: (item: AngularLink) => {
        return `<a routerLink="${item.value.value}">${item.label.value}</a>`;
      }
    });
  }
}
