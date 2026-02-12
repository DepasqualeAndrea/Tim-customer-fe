import {ContentItem, Elements} from 'kentico-cloud-delivery';
import {RichTextHtmlHelper} from '../data-layer/helpers/rich-text-html.helper';

export class PageModel extends ContentItem {
  banner: Elements.AssetsElement;
  title: Elements.RichTextElement;
  subtitle: Elements.RichTextElement;
  body: Elements.RichTextElement;
  sub_section: Elements.RichTextElement;
}

export class PageSectionModel extends ContentItem {
  id: Elements.TextElement;
  title: Elements.RichTextElement;
  body: Elements.RichTextElement;

  constructor() {
    super({
      richTextResolver: contentItem => {
        const pageSection = <PageSectionModel>contentItem;
        const id = pageSection.id.value ? `id="${pageSection.id.value}"` : '';
          return `<section ${id} class="section">
          <div class="section-title">
              ${RichTextHtmlHelper.computeHtml(pageSection.title)}
          </div>
          <div class="section-body">
              ${RichTextHtmlHelper.computeHtml(pageSection.body)}
          </div>
        </section>`;
      }
    });
  }
}
