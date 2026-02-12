import { Injectable } from '@angular/core';
import { KenticoAbstractService } from '../../../modules/kentico/data-layer/kentico-abstract.service';
import { DeliveryClient, TypeResolver, ContentItem, RichTextImage } from 'kentico-cloud-delivery';
import { PageSection, PageView, Textbox } from 'app/modules/kentico/models/architecture.model';
import { take } from 'rxjs/operators';
import { untilDestroyed } from 'ngx-take-until-destroy';
import {KenticoConfigurator} from '../../../modules/kentico/kentico-configurator.service';

@Injectable({
  providedIn: 'root'
})
export class KenticoMediaworld extends KenticoAbstractService {

  contents: {id: string, value?: string, url?: string, description?: string}[] = [];
  images: {url: string, description?: string}[] = [];

  constructor(protected kenticoConfigurator: KenticoConfigurator) {
    super(kenticoConfigurator, '6f0ec384-96dc-0000-f339-ff68bf6e9f6a', null, null, null);
  }

  initDeliveryClient() {
    return new DeliveryClient({
      projectId: '6f0ec384-96dc-0000-f339-ff68bf6e9f6a',
      typeResolvers: [
        new TypeResolver('section', () => new PageSection()),
        new TypeResolver('view', () => new PageView()),
        new TypeResolver('dynamic_textbox', () => new Textbox()),
        new TypeResolver('textbox', () => new Textbox())
      ],
      linkedItemResolver: {
        linkedItemWrapperTag: 'div'
      }
    });
  }

  setContentsOf(view: string) {
    this.getItem<PageView>(view).pipe(take(1)).subscribe(item => {
      const linkedItemCodenames = item.page.linkedItemCodenames;
      item.page.images.forEach(img => {
        this.images.push({ description: img.description, url: img.url });
      });
      linkedItemCodenames.map(codename => {
        this.pushContent(codename, this.contents);
      });
    });
  }
  pushContent(contentCodename: string, destination: any[]) {
    this.getItem<ContentItem>(contentCodename).pipe().subscribe(item => {
      if (item.system.type === 'image') {
        item.image.value.map(img => {
          const index = item.image.value.indexOf(img);
          let image = {id: contentCodename, url: '', description: ''};
          image = Object.assign(image, this.addImageToContents(contentCodename, index, img));
          destination.push(image);
        });
      } else if (item.system.type.includes('textbox')) { destination.push(this.addTextToContents(contentCodename, item)); }
    });
  }

  addImageToContents(linkedItemCodename: string, index: number, image: any) {
    return {
      id: linkedItemCodename + `[${index}]`,
      url: image.url,
      description: image.description
    };
  }

  addTextToContents(linkedItemCodename: string, item: any) {
    return {
      id: linkedItemCodename,
      value: item.text.value
    };
  }

  getContent(linkedItemCodename: string) {
    const content = this.contents.find(c => c.id === linkedItemCodename);
    if (content && content.value) {
      return content.value;
    } else if (content && content.id && (content.url || content.description)) {
      return { url: content.url, description: content.description };
    }
  }
}
