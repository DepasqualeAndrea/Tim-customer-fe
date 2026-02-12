export const EXTERNAL_PRODUCTS = {
  yolodb: [
    {
      name: 'Homeflix',
      product_code: 'homeflix',
      category: 'Goods',
      properties: [
        {value: '2', name: 'showcase_index'}
      ],
      images: [
        {
          image_type: 'default',
          small_url: './assets/images/product_icons/Homeflix_icon.svg',
          name_url: './assets/images/product_icons/Homeflix_title.svg'
        }
      ],
      show_in_dashboard: true,
      img_name: true,
      external_url: 'https://www.homeflix.it/'
    },
    {
      name: 'Libera mente special',
      product_code: 'liberamente',
      category: 'Goods',
      properties: [
        {value: '3', name: 'showcase_index'}
      ],
      images: [
        {
          image_type: 'default',
          small_url: './assets/images/product_icons/icona_liberamente.svg',
        }
      ],
      show_in_dashboard: true,
      external_url: 'https://liberamente.yolo-insurance.com'
    }]
};
