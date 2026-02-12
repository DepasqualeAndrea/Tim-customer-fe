import {ContentItem, Elements} from 'kentico-cloud-delivery';
import {RichTextHtmlHelper} from '../data-layer/helpers/rich-text-html.helper';

export class ListModel extends ContentItem {
  listItems: Elements.LinkedItemsElement;

  constructor() {
    super({
      propertyResolver: fieldName => {
        if (fieldName === 'list_items') {
          return 'listItems';
        }
        return fieldName;
      },
      richTextResolver: contentItem => {
        const list = <ListModel>contentItem;
        const listItems = list.listItems.value.map(item => {
          const li = <ListItemModel>item;
          const img = li.image.value[0];
          const imgTag = img && img.url ? `<img src="${img && img.url}">` : '';
          return `
          <li class="kc-list-item list-group-item">
            <div class="row">
              <div class="col-12 col-sm-2 text-center text-sm-left">${imgTag}</div>
              <div class="col-12 col-sm-10 text-center text-sm-left">
                <div class="row row-title"><div class="col-12">${RichTextHtmlHelper.computeHtml(li.title)}</div></div>
                <div class="row row-subtitle"><div class="col-12">${RichTextHtmlHelper.computeHtml(li.subtitle)}</div></div>
                <div class="row row-body"><div class="col-12">${RichTextHtmlHelper.computeHtml(li.body)}</div></div>
              </div>
            </div>
          </li>`;
        }).join('\n');
        return `<ul class="kc-list-group list-group">${listItems}</ul>`;
      }
    });
  }

}

export class ListItemModel extends ContentItem {
  image: Elements.AssetsElement;
  title: Elements.RichTextElement;
  subtitle: Elements.RichTextElement;
  body: Elements.RichTextElement;
}
