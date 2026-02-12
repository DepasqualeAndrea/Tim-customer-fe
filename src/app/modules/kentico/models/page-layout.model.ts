import { ContentItem, Elements } from 'kentico-cloud-delivery';

export class PageLayout extends ContentItem {

    header: Elements.AssetsElement;
    header_title: Elements.RichTextElement;
    header_subtitle: Elements.RichTextElement;
    body: Elements.RichTextElement;
    sub_section: Elements.RichTextElement;
    children: Elements.LinkedItemsElement;

}
