import { HREFButton } from 'app/modules/kentico/models/button.model';
import { YoloButton } from '../../../modules/kentico/models/card.model';
import { DeliveryClient, TypeResolver, ContentItem } from 'kentico-cloud-delivery';
import { KenticoAbstractService } from 'app/modules/kentico/data-layer/kentico-abstract.service';
import { Injectable } from '@angular/core';
import { PageSection } from '../../../modules/kentico/models/architecture.model';
import { AccessLogo } from 'app/modules/kentico/models/logo.model';
import { AngularLink } from 'app/modules/kentico/models/angular-link.model';
import { take, map } from 'rxjs/operators';
import {KenticoConfigurator} from '../../../modules/kentico/kentico-configurator.service';

@Injectable({
  providedIn: 'root'
})
export class KenticoNetInsuranceService extends KenticoAbstractService {

  private contents: {id: string, value?: string, url?: string, description?: string}[] = [];
  images: {url: string, description?: string}[] = [];

  constructor(protected kenticoConfigurator: KenticoConfigurator) {
    super(kenticoConfigurator, '2f0fba60-9b75-01b8-5228-32817d046777', null, null, null);
  }

  initDeliveryClient() {
    return new DeliveryClient({
      projectId: '2f0fba60-9b75-01b8-5228-32817d046777',
      typeResolvers: [
        new TypeResolver('section', () => new PageSection()),
        new TypeResolver('yolobutton', () => new YoloButton()), // create a new button layout
        new TypeResolver('logo', () => new AccessLogo()),
        new TypeResolver('href_button', () => new HREFButton()),
        new TypeResolver('angular_link_b527c22', () => new AngularLink())
      ],
      linkedItemResolver: {
        linkedItemWrapperTag: 'div'
      }
    });
  }

  getContentsOf(view: string) {
    return this.getItem<ContentItem>(view).pipe(take(1), map(item => item.page.value));
  }

  setContentsOf(view: string) {
    this.getItem<ContentItem>(view).pipe(take(1)).subscribe(item => {
      const linkedItems = item.page.value;
      linkedItems.map(linkedItem => {
        const currentIndex: number = linkedItems.indexOf(linkedItem);
        const codename: string = linkedItem.system.codename;
        const type: string = linkedItem.system.type;
        switch (type) {
          case 'image':
            linkedItem.image.value.map(img => {
              const index = linkedItem.image.value.indexOf(img);
              this.contents.push(this.addImageToContents(codename, index, img));
            });
            break;
          case 'textbox':
          case 'dynamic_textbox':
            this.contents.push(this.addTextToContents(codename, linkedItem));
            break;
          case 'choice':
            const previousItem = linkedItems[currentIndex - 1];
            const nextItemId: string = linkedItems[currentIndex + 1].system.codename;
            this.handleBehaviour(linkedItem, previousItem, currentIndex, nextItemId);
            break;
          default:
            // type not permitted inside view
            break;
        }
      });
    });
  }

  private handleBehaviour(item: ContentItem, targetForReplacement: ContentItem, currentIndex: number, targetId: string) {
    const itemCodename = item.options.value[0].codename;
    const text = targetForReplacement.text.value;
    const codename = targetForReplacement.system.codename;
    switch (itemCodename) {
      case 'collapse':
        this.editContent(currentIndex, codename, this.setCollapseAttributes(this.createContainerElement(text), targetId));
        break;
      case 'dropdown':
        this.editContent(currentIndex, codename, this.setDropdownAttributes(this.createContainerElement(text), targetId));
        break;
      default:
        // type not permitted inside choice
        break;
    }
  }

  private createContainerElement(innerHtml: string) {
    const div = document.createElement('div');
    div.innerHTML = innerHtml;
    return div;
  }

  private editContent(currentIndex: number, targetForReplacementCodename: string, newValue: string) {
    const newContent = { id: targetForReplacementCodename, value: newValue };
    this.contents.splice(currentIndex - 1, 1, newContent);
  }

  private setDropdownAttributes(element: HTMLDivElement, dropdownTargetElement: string): string {
    const a = element.querySelector('a');
    this.removeKenticoAddInAttributes(element);
    a.setAttribute('data-toggle', 'dropdown');
    a.setAttribute('data-target', '#' + dropdownTargetElement);
    a.setAttribute('aria-haspopup', 'true');
    return element.innerHTML;
  }

  private setCollapseAttributes(element: HTMLDivElement, collapseTargetElement: string): string {
    const a = element.querySelector('a');
    this.removeKenticoAddInAttributes(a);
    a.setAttribute('href', '#' + collapseTargetElement);
    a.setAttribute('data-toggle', 'collapse');
    a.setAttribute('role', 'button');
    a.setAttribute('aria-expanded', 'false');
    return element.innerHTML;
  }

  private removeKenticoAddInAttributes(element: HTMLElement) {
    element.removeAttribute('data-new-window');
    element.removeAttribute('data-item-id');
    element.removeAttribute('rel');
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

  getProductContent(code: string, linkedItem: string) {
    const content = this.contents.find(c => c.id === `${code}_${linkedItem}`);
    if (content && content.value) {
      return content.value;
    } else if (content && content.id && (content.url || content.description)) {
      return { url: content.url, description: content.description };
    }
  }
}
