import {Elements} from 'kentico-cloud-delivery';

declare var $: any;

export const Replacements: { [key: string]: string } = {
  routerlink: 'routerLink',
  ngbtabtitle: 'ngbTabTitle',
  ngbtabcontent: 'ngbTabContent'
};

export class RichTextHtmlHelper {

  private static stripWrapper(html: string): string {
    const container = document.createElement('div');
    container.innerHTML = html;
    const wrappers = container.querySelectorAll('div.kc-linked-item-wrapper');
    RichTextHtmlHelper.processKenticoWrappers(wrappers);
    return container.innerHTML;
  }
  static processKenticoWrappers(htmlColl: NodeListOf<Element>): void {
    for (let i = 0; i < htmlColl.length; i++) {
      const parentElem = htmlColl[i].parentElement;
      const prev = htmlColl[i].previousElementSibling;
      const next = htmlColl[i].nextElementSibling;
      const elements = htmlColl[i].children;
      for (let j = 0; j < elements.length; j++) {
        const el = elements.item(j);
        if (el.tagName.toLowerCase() === 'a' && RichTextHtmlHelper.isParagraph(prev) || RichTextHtmlHelper.isParagraph(next)) {
          const container = document.createElement('div');
          const anchorContainer = document.createElement('div');
          anchorContainer.appendChild(el);
          let html = (prev && prev.tagName.toLowerCase() === 'p' && prev.innerHTML || '');
          html += ' ' + anchorContainer.innerHTML + ' ';
          html += next && next.tagName.toLowerCase() === 'p' && next.innerHTML || '';
          container.innerHTML = html;
          parentElem.insertBefore(container, htmlColl[i]);
          (RichTextHtmlHelper.isParagraph(prev) && parentElem.removeChild(prev));
          (RichTextHtmlHelper.isParagraph(next) && parentElem.removeChild(next));
        } else {
          parentElem.insertBefore(el, htmlColl[i]);
        }
      }
      parentElem.removeChild(htmlColl[i]);
    }
  }

  static isParagraph(el: Element): boolean {
    return el && el.tagName.toLowerCase() === 'p';
  }



  private static adjustAttributes(html: string): string {
    return Object.keys(Replacements).reduce((content, k) => content.replace(new RegExp(k, 'g'), Replacements[k]), html);
  }

  static computeHtml(richTextField: Elements.RichTextElement): string {
    const stripped = RichTextHtmlHelper.stripWrapper(richTextField.resolveHtml());
    const adjusted = RichTextHtmlHelper.adjustAttributes(stripped);
    return adjusted;
  }

}
