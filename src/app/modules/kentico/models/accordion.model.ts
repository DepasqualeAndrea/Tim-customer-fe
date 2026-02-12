import {ContentItem, Elements} from 'kentico-cloud-delivery';
import {RichTextHtmlHelper} from '../data-layer/helpers/rich-text-html.helper';

export class Accordion extends ContentItem {

  id: Elements.TextElement;
  parent: Elements.TextElement;
  title: Elements.TextElement;
  body: Elements.RichTextElement;
  show: Elements.MultipleChoiceElement;

  constructor() {
    super({
      richTextResolver: contentItem => {
        const accordion = <Accordion>contentItem;
        const accordionBody = RichTextHtmlHelper.computeHtml(accordion.body);
        const show = this.computeYesNoFlag(this.show);
        return `
         <div class="padding">
            <div class="row flex-nowrap align-items-center accordion pointer" id="heading-${accordion.id.value}"
              data-toggle="collapse" data-target="#collapse-${accordion.id.value}" aria-expanded="true" aria-controls="collapse-${accordion.id.value}">
              <i class="fa fa-chevron-up mr-2"></i>
              <p class="mb-0"><b>${accordion.title.value}</b></p>
            </div>
            <div id="collapse-${accordion.id.value}" class="collapse ${show ? 'show' : ''}" aria-labelledby="heading-${accordion.id.value}">
              <div class="ml-2">${accordionBody}</div>
            </div>
         </div>
        `;
      }
    });
  }

  computeYesNoFlag(field: Elements.MultipleChoiceElement): boolean {
    return field.value && field.value.length && field.value.some(val => val.codename === 'yes');
  }

}


export class AccordionYolo extends ContentItem {

  id: Elements.TextElement;
  parent: Elements.TextElement;
  title: Elements.TextElement;
  body: Elements.RichTextElement;
  show: Elements.MultipleChoiceElement;

  constructor() {
    super({
      richTextResolver: contentItem => {
        const accordion = <Accordion>contentItem;
        const accordionBody = RichTextHtmlHelper.computeHtml(accordion.body);
        const show = this.computeYesNoFlag(this.show);
        return `
        <div class="card filterFaqs">
        <div class="card-header" role="tab" id="heading${accordion.id.value}">
            <h5 class="mb-0" data-toggle="collapse" href="#collapse${accordion.id.value}"
            aria-expanded="true" aria-controls="collapse${accordion.id.value}">
                ${accordion.title.value}
                <i class="material-icons float-right text-primary">add</i>
            </h5>
        </div>
        <div id="collapse${accordion.id.value}" class="collapse ${show ? 'show' : ''}" role="tabpanel"
        aria-labelledby="heading${accordion.id.value}" style="">
          <div class="card-body">
            ${accordionBody}
          </div>
        </div>
      </div>
        `;
      }
    });
  }

  computeYesNoFlag(field: Elements.MultipleChoiceElement): boolean {
    return field.value && field.value.length && field.value.some(val => val.codename === 'yes');
  }

}
