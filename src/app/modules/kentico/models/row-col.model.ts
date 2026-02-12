import {ContentItem, Elements} from 'kentico-cloud-delivery';
import {RichTextHtmlHelper} from '../data-layer/helpers/rich-text-html.helper';


export class Row extends ContentItem {
  class: Elements.TextElement;
  body: Elements.RichTextElement;
  constructor() {
    super({
      richTextResolver: (item: Row) => {
        const body = RichTextHtmlHelper.computeHtml(this.body);
        return `<div class="row ${item.class.value}">${body}</div>`;
      }
    });
  }
}

export class Column extends ContentItem {
  class: Elements.TextElement;
  body: Elements.RichTextElement;
  constructor() {
    super({
      richTextResolver: (item: Column) => {
        const body = RichTextHtmlHelper.computeHtml(this.body);
        return `<div class="${item.class.value}">${body}</div>`;
      }
    });
  }
}

export class ColumnImage extends ContentItem {
  class: Elements.TextElement;
  body: Elements.RichTextElement;
  constructor() {
    super({
      richTextResolver: (item: Column) => {
        return `<div class="${item.class.value}">
          <img src="${item.image.value[0].url}"></img>
        </div>`;
      }
    });
  }
}
