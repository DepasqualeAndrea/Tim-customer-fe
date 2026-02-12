import { PreventivatoreDynamicState } from './preventivatore-dynamic-state.model';

export abstract class PreventivatoreAbstractStateReducer {
    protected state: PreventivatoreDynamicState;
    protected common(actionName: string, payload: any) {
        switch (actionName) {
            case 'addHero':
                this.state = this.addHero(this.state, payload);
                break;
            case 'addHeader':
                this.state = this.addHeader(this.state, payload);
                break;
            case 'addBgImgHero':
                this.state = this.addBgImgHero(this.state, payload);
                break;
            case 'addHowWorks':
                this.state = this.addHowWorks(this.state, payload);
                break;
            case 'addWhatToKnow':
                this.state = this.addWhatToKnow(this.state, payload);
                break;
            case 'addMoreInfo':
                this.state = this.addMoreInfo(this.state, payload);
                break;
            case 'addForWho':
                this.state = this.addForWho(this.state, payload);
                break;
            case 'whatToKnowUpdateTitle':
                this.state = this.whatToKnowUpdateTitle(this.state, payload);
                break;
            case 'selected_product':
                this.state = this.selectedProduct(this.state, payload);
                break;
            case 'selectedProduct':
                this.state = this.selectedProduct(this.state, payload);
                break;

        }
        // for generic containers
        if (actionName.match(/^addComponent\d+$/)) {
          const index = +actionName.match(/\d+$/)[0];
          this.state = this.addComponent(this.state, payload, index);
        }
        return this.state;
    }


    private addHero(state: PreventivatoreDynamicState, hero: any) {
        const obj = Object.assign({}, hero);
        state.hero = obj;
        return state;
    }

    private addHeader(state: PreventivatoreDynamicState, header: any) {
        const obj = Object.assign({}, header);
        state.header = obj;
        return state;
    }

    private addBgImgHero(state: PreventivatoreDynamicState, bgImgHero: any) {
        const obj = Object.assign({}, bgImgHero);
        state.bgImgHero = obj;
        return state;
    }

    private addHowWorks(state: PreventivatoreDynamicState, howWorks: any) {
        const obj = Object.assign({}, howWorks);
        state.howWorks = obj;
        return state;
    }

    private addWhatToKnow(state: PreventivatoreDynamicState, whatToKnow: any) {
        const obj = Object.assign({}, whatToKnow);
        state.whatToKnow = obj;
        return state;
    }

    private addMoreInfo(state: PreventivatoreDynamicState, moreInfo: any) {
        const obj = Object.assign({}, moreInfo);
        state.moreInfo = obj;
        return state;
    }

    private addForWho(state: PreventivatoreDynamicState, forWho: any) {
        const obj = Object.assign({}, forWho);
        state.forWho = obj;
        return state;
    }

    private addComponent(state: PreventivatoreDynamicState, component: any, index: number) {
      const obj = Object.assign({}, component);
      state[`component${index}`] = obj;
      return state;
    }

    private whatToKnowUpdateTitle(state: PreventivatoreDynamicState, updateTitle: any) {
        const obj = Object.assign({}, state.whatToKnow);
        obj.title_section = updateTitle.title;
        state.whatToKnow = obj;
        return state;
    }

    private selectedProduct(state: PreventivatoreDynamicState, product: any) {
      const productContainer = state.howWorks ? Object.assign({}, state.howWorks) : Object.assign({}, state.component2);
      const selected_slide = product.product.product_code;
      if (productContainer.product_content) {
        productContainer.selected_slide = selected_slide;
        productContainer.product_content.forEach(productElement => {
          productElement.selected = product.product_code === selected_slide;
        });
        if (state.howWorks) {
          state.howWorks = productContainer;
        }
        if (state.component2) {
          state.component2 = productContainer;
        }
      }
      return state;
    }
}
