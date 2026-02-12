import {ContentItem, Elements} from 'kentico-cloud-delivery';
import {RichTextHtmlHelper} from '../data-layer/helpers/rich-text-html.helper';

export class Cards extends ContentItem {
  cardItems: Elements.LinkedItemsElement<Card>;

  constructor() {
    super({
      propertyResolver: fieldName => {
        if (fieldName === 'card_items') {
          return 'cardItems';
        }
        return fieldName;
      },
      richTextResolver: contentItem => {
        const cards = <Cards>contentItem;
        const cardItems = cards.cardItems.value.map(item => {
          const card = <Card>item;
          const imgDiv = item.image.value.length ? `<div class="w-100 mb-2"><img src="${card.image.value[0].url}"></div>` : '';
          return `
                <div class="kc-card card">
                    ${imgDiv}
                    <div class="card-title">${card.title.value}</div>
                    <div class="card-body">${RichTextHtmlHelper.computeHtml(card.body)}</div>
                </div>`;
        }).join('\n');
        return `<div class="kc-card-group card-group">${cardItems}</div>`;
      }
    });
  }
}
export class Card extends ContentItem {

    image: Elements.AssetsElement;
    title: Elements.RichTextElement;
    body: Elements.RichTextElement;

  constructor() {
    super({
      richTextResolver: (item: Card) => {
        const body = RichTextHtmlHelper.computeHtml(this.body);
        const imgDiv = item.image.value.length ? `<div class="w-100 mb-2"><img src="${item.image.value[0].url}"></div>` : '';
        return `
                <div class="card">
                    ${imgDiv}
                    <h3 class="w-100 text-center text-uppercase">
                        ${item.title.value}
                    <h3>
                    <div class="d-flex flex-column">
                        ${body}
                    <div>
                </div>
                `;
      }
    });
  }
}

export class YoloButton extends ContentItem {

  label: Elements.TextElement;
  value: Elements.TextElement;

  constructor() {
    super({
      richTextResolver: (item: Card) => {
        const link = item.value.value;
        let attributeLink;
        if (link.includes('http')) {
          attributeLink = `href = "` +  link + `"`;
        } else {
          attributeLink = `routerLink = "` +  link + `"`;
        }
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
