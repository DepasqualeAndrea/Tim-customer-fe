import { ContentItem, Elements } from "kentico-cloud-delivery";

export class HomepageLayout extends ContentItem{
  header: Elements.LinkedItemsElement;
  main: Elements.LinkedItemsElement;
  product_card: Elements.LinkedItemsElement;
  insurtech_platform: Elements.LinkedItemsElement;
  about_us: Elements.LinkedItemsElement;
}

export interface Products {
  business:boolean; image: string; name: string; category: string[];
}