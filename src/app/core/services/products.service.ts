import {Injectable} from '@angular/core';

import * as _ from 'lodash';
import {Product} from '@model';
import {InsurancesService} from './insurances.service';


@Injectable()
export class ProductsService {

  constructor(
    private insuranceService: InsurancesService
  ) {
  }

  createAggregateList(productsList) {
    const productsJson = productsList.reduce((acc, cur) => {
      const findProperty = cur.properties.find(p => p.name === 'uniq_name');
      return findProperty
        ? {...acc, [findProperty.value]: [...(acc[findProperty.value] || []), cur]}
        : {...acc, ['single']: [...(acc['single'] || []), cur]};
    }, {});
    const mappingProducts = Object.keys(productsJson).map(key => (this.aggObjForSlider(key, productsJson)));
    return [].concat.apply([], mappingProducts).sort((a, b) => a.showcase_index - b.showcase_index);
  }

  aggObjForSlider(key, productsJson) {
    if (key === 'single') {
      const arraySingleProducts = [];
      for (const product of productsJson[key]) {
        arraySingleProducts.push({
          key: key,
          showcase_index: this.insuranceService.getShowCasePropertyProductOrder(product) || null,
          products: new Array(product)
        });
      }
      return arraySingleProducts;
    }
    return this.aggObj(key, productsJson);
  }

  aggObj(key, productsJson) {
    return {
      key: key,
      price: key !== 'single' ? this.getPrice(productsJson[key]) : null,
      images: key !== 'single' ? this.getImage(productsJson[key]) : null,
      showcase_index: this.insuranceService.getShowCasePropertyProductOrder(productsJson[key][0]) || null,
      products: productsJson[key]
    };
  }

  getPrice(products) {
    let min = 99999;
    let min_display = '';
    _.each(products, (product) => {
      if (product.price < min) {
        min = product.price;
        min_display = product.display_price;
      }
    });
    return min;
  }

  getImage(products) {
    let img = {};
    _.each(products, (product) => {
      img = _.find(product.images, ['image_type', 'common_image']);
      if (!img) {
        img = _.find(product.images, ['image_type', 'fp_image']);
      }
    });
    return img;
  }

  findSelectedProduct(productsList, id) {
    const splittedId = id.split('-');
    const productCategory = productsList
      .find(productsArray => productsArray.products
        .some(p => splittedId.some(s => parseInt(s, 10) === p.id)));
    if (productCategory.key === 'single') {
      return productCategory.products.filter(p => p.id === parseInt(id, 10));
    }
    return productCategory.products;
  }

  getIsProductLinkDisabled(products: Product[]): boolean {
    return products.some(product => {
      if (!!product.product_structure.template_properties) {
        return product.product_structure.template_properties.thumbnail === true;
      }
      return false;
    });
  }

  createPreventivatoreLinkDisabledRoute(products: Product[], explicitRoute: boolean = true) {
    const productLink = this.getIsProductLinkDisabled(products);
    if (explicitRoute && productLink) {
      const code = products.map(p => p.product_code);
      return ['preventivatore', {code}];
    }
    return [];
  }

  createPreventivatoreRoute(products: Product[], explicitRoute: boolean = true) {
    if (explicitRoute) {
      const prefix = products.map(p => ((p.properties.find(a => a.name === 'prefix') || {value: 'assicurazione'}).value));
      const alias = products.map(p => ((p.properties.find(a => a.name === 'alias') || {value: p.product_code}).value));
      const code = products.map(p => p.product_code);
      console.log(prefix);
      if (alias[0] !== code[0]) {
        return [prefix[0] + '-' + alias.join('_')];
      } else {
        return ['preventivatore', {code}];
      }
    } else {
      const ids = products.reduce((acc, cur) => acc ? `${acc}-${cur.id}` : cur.id, '');
      return [`preventivatore/${ids}`];
    }
  }

  createPreventivatoreLandingProductRoute(products: Product[]) {
    const code = products.map(p => p.product_code);
    return ['product-landing', {code}];
  }

  // Specific Code for SCI CHEBANCA, to be removed to CB module
  getTravelDestinationsName(productDestinations) {
    const destinations = [];
    for (const [key, value] of Object.entries(productDestinations)) {
      const label = key === 'EUROPA' ? 'UNIONE EUROPEA, REGNO UNITO E SVIZZERA' : key;
      destinations.unshift({value: key, description: value, label});
    }
    return destinations;
  }

  createAgesList(minAge: number, maxAge: number) {
    return [
      {
        description: minAge === 0 ? `Fino a 24` : `Età ${minAge}-24`,
        quantity: 0,
        id: 'number_of_insureds_25',
        descriptionLabel: `(${minAge}-24)`
      },
      {
        description: 'Età 25-49',
        quantity: 0,
        id: 'number_of_insureds_50',
        descriptionLabel: '(25-49)'
      },
      {
        description: 'Età 50-59',
        quantity: 0,
        id: 'number_of_insureds_60',
        descriptionLabel: '(50-59)'
      },
      {
        description: `Età 60-${maxAge}`,
        quantity: 0,
        id: 'number_of_insureds_65',
        descriptionLabel: `(60-${maxAge})`
      }];
  }

  createAgesListWinterSport(minAge: number, maxAge: number) {
    return [
      {
        description:`Età ${minAge}-49`,
        quantity: 0,
        id: 'number_of_insureds_25',
        descriptionLabel: `(${minAge}-49)`
      },
      {
        description: maxAge > 150 ? `Età +50` : `Età 50-${maxAge}`,
        quantity: 0,
        id: 'number_of_insureds_65',
        descriptionLabel: `(50-${maxAge})`
      }];
  }

  isRecurrent(product) {
    return product.payment_methods.some(pm => pm.type === 'Spree::Gateway::BraintreeRecurrent');
  }

}
