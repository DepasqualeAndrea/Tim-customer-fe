import { ContentItem, Elements } from 'kentico-cloud-delivery';

export class ImageLink extends ContentItem{
    image: Elements.AssetsElement;
    link: Elements.TextElement;

    
constructor() {
    super({

      richTextResolver: contentItem => {
        const item = <ImageLink>contentItem;
        

        return `
            <a href="${item.link.value}"  >
              <img class="blog-img" src="${item.image.value[0].url}"></img>
            </a>
         `;
      }
    });
  }

}

export class Image extends ContentItem {
  thumbnail: Elements.AssetsElement;
  
}
