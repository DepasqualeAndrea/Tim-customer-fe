import { ContentItem, Elements, RichTextImage } from 'kentico-cloud-delivery';

export class Architecture extends ContentItem {
    title: Elements.RichTextElement;
    body: Elements.RichTextElement;

}

export class Architecture_api extends ContentItem {

    title: Elements.RichTextElement;
    body: Elements.RichTextElement;

}

export class PageSection extends ContentItem {
    title: Elements.TextElement;
    subtitle: Elements.TextElement;
    body: Elements.RichTextElement;
    images: Elements.AssetsElement;
}

export class PageView extends ContentItem {
  page: Elements.RichTextElement;
}

export class Textbox extends ContentItem {
  text: Elements.TextElement | Elements.RichTextElement;
}

export class Image extends ContentItem {
  image: Elements.AssetsElement;
}