import {KenticoElementConverterInterface} from './kentico-element-converter.interface';
import {Elements} from 'kentico-cloud-delivery';
import {RichTextHtmlHelper} from '../../helpers/rich-text-html.helper';

export class RichTextElementConverter implements KenticoElementConverterInterface<Elements.RichTextElement> {
  convertElement(obj: Elements.RichTextElement): object {
    obj.value = RichTextHtmlHelper.computeHtml(obj);
    return obj;
  }

}
