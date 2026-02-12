import {ContentItem, Elements } from 'kentico-cloud-delivery';
import {RichTextHtmlHelper} from '../data-layer/helpers/rich-text-html.helper';

export class Tab extends ContentItem {
  tabCards: Elements.LinkedItemsElement;

  constructor() {
    super({
      propertyResolver: fieldName => {
        if (fieldName === 'tab_cards') {
          return 'tabCards';
        }
        return fieldName;
      },
      richTextResolver: contentItem => {
        const tab = <Tab>contentItem;
        const cards = tab.tabCards.value.map(item => {
          const card = <TabCard>item;
          return `
          <ngb-tab id="${card.id.value}-tab">
            <ng-template ngbTabTitle="">
              <div class="${card.id.value}-title title">
                <h3>${card.title.value}</h3>
              </div>
            </ng-template>
            <ng-template ngbTabContent="">${RichTextHtmlHelper.computeHtml(card.body)}</ng-template>
          </ngb-tab>`;
        });
        return `<ngb-tabset type="pills">${cards}</ngb-tabset>`;
      }
    });
  }
}

export class TabCard extends ContentItem {
  id: Elements.TextElement;
  title: Elements.TextElement;
  body: Elements.RichTextElement;

  constructor() {
    super({
      richTextResolver: contentItem => {
        const card = <TabCard>contentItem;
        const body = RichTextHtmlHelper.computeHtml(card.body);
        return `
          <ngb-tab id="${card.id.value}-tab">
            <ng-template ngbTabTitle="">
              <div class="${card.id.value}-title title">
                <h3>${card.title.value}</h3>
              </div>
            </ng-template>
            <ng-template ngbTabContent="">${body}</ng-template>
          </ngb-tab>`;
      }
    });
  }
}
