import {ContentItem, Elements} from 'kentico-cloud-delivery';
import { RichTextHtmlHelper } from '../data-layer/helpers/rich-text-html.helper';

export class ArticleYolo extends ContentItem {

    date: Elements.TextElement;
    image: Elements.AssetsElement;
    title: Elements.RichTextElement;
    body: Elements.TextElement;
    link: Elements.TextElement

  constructor() {
    super({

      richTextResolver: (item: ArticleYolo) => {

        return `
        <div>
          <h6> ${item.date.value} </h6>
              <a target="_blank" class="leggi" href="${item.link.value}">
                  <div class="blog-img" style="background-image: url(${item.image.value[0].url});"> </div>
                  <h3> ${item.title.value} </h3>
              </a>
              <div class="content"> ${item.body.value} </div>
          <a target="_blank" class="leggi" href="${item.link.value}">
            Leggi tutto
            &nbsp;&nbsp;  <i class="fas fa-long-arrow-alt-right" aria-hidden="true"></i>
          </a>
        <div>
        `;
      }
    });
  }
}
