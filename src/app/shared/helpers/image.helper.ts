import {Image, Product} from '@model';

export class ImageHelper {

  static findImageByTypes(images: Image[], ...types): Image {
    for (let i = 0; i < types.length; i++) {
      const image = ImageHelper.findImageByType(images, types[i]);
      if (image) {
        return image;
      }
    }
  }

  static findImageByType(images: Image[], type: string): Image {
    return images.find(image => image.image_type === type);
  }

  static computeImage(unknownProduct: Product): string {
    const img = ImageHelper.findImageByTypes(unknownProduct.images, 'fp_image', 'default', 'common_image');
    return img && ('' + (img.small_url || img.product_url || img.original_url || img.mini_url || img.large_url));
  }

}
