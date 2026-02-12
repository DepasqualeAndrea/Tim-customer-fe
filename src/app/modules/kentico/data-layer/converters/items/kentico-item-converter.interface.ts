import {ContentItem} from 'kentico-cloud-delivery';

export interface KenticoItemConverterInterface {
  convertItem(item: ContentItem): ContentItem;
}
