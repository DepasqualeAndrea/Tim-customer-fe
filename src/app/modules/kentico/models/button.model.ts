import { ContentItem, Elements } from 'kentico-cloud-delivery';
import { Card } from './card.model';

export class HREFButton extends ContentItem {

  label: Elements.TextElement;
  link: Elements.TextElement;

  constructor() {
    super({
      richTextResolver: (item: Card) => {
        const decodedURI = decodeURIComponent(item.link.value);
        const attributeLink = `href = "` +  decodedURI + `"`;

        return `
                <div id="button-container" class="doubled-button position-relative border-0 p-0 dark-blue mt-auto">
                    <a id="button-clickable" target="_self" class="button-text d-flex w-100 h-100
                    justify-content-center align-items-center text-uppercase font-weight-bold"
                    ${attributeLink}>
                      ${item.label.value}
                    </a>
                    <div id="button-rectangle" class="bg w-100 h-100 position-absolute"></div>
                </div>
                `;
      }
    });
  }
}
