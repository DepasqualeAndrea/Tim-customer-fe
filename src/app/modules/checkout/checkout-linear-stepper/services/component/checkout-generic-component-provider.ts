import { CheckoutComponentFactory } from './checkout-component-factory.model';
import { InsuranceUncompletedStepsComponent } from '../../components/insurance-uncompleted-steps/insurance-uncompleted-steps.component';
import { BackNextControllerComponent } from '../../components/back-next-controller/back-next-controller.component';
import { InsuranceCompletedStepsComponent } from '../../components/insurance-completed-steps/insurance-completed-steps.component';
import { CheckoutHeaderComponent } from '../../components/checkout-header/checkout-header.component';
import { CheckoutCostItemDetailsComponent } from '../../components/checkout-cost-item-details/checkout-cost-item-details.component';
import { CheckoutComponentProvider } from './checkout-component-provider.interface';
import { Injectable, ComponentFactoryResolver } from '@angular/core';
import { CheckoutCostItemDetailsShoppingCartComponent } from '../../components/checkout-cost-item-details-shopping-cart/checkout-cost-item-details-shopping-cart.component';
import { CheckoutCollaborationSectionComponent } from '../../components/checkout-collaboration-section/checkout-collaboration-section.component';
import { CheckoutCostItemDetailsSimpleComponent } from '../../components/checkout-cost-item-details-simple/checkout-cost-item-details-simple.component';
import { ComponentFeaturesService } from 'app/core/services/componentFeatures.service';
import { CostItemListComponent } from '../../components/cost-item-list/cost-item-list.component';

type FactoryConstraintConfig = {
    products: string[],
    factory: string
  }

@Injectable(
    {
        providedIn: 'root'
    }
)
export class CheckoutGenericComponentProvider implements CheckoutComponentProvider {
    private readonly COMPONENT = 'checkout';
    private readonly RULE = 'get-factory';
    private readonly CONSTRAINT = 'configs';

    constructor(
        private componentFactoryResolver: ComponentFactoryResolver,
        private componentFeaturesService: ComponentFeaturesService) {
    }
    public getComponentFactories(productCode: string): CheckoutComponentFactory[] {
        return this.getFactories(productCode);
    }
    public canGetComponentsForProduct(productCode: string): boolean {
       return true;
    }
    private getFactories(productCode: string): CheckoutComponentFactory[]  {
        const componentFactories: CheckoutComponentFactory[] = [];
        componentFactories.push(this.getUncompletedStepsComponentFactory());
        componentFactories.push(this.getBackNextStepFactory());
        componentFactories.push(this.getCompletedStepsFactory());
        componentFactories.push(this.getHeaderFactory());
        componentFactories.push(this.getCostItemDetail(productCode));
        componentFactories.push(this.getShoppingCartDetail());
        componentFactories.push(this.getCollaborationSectionFactory());                

        return componentFactories;
    }
    private getUncompletedStepsComponentFactory(): CheckoutComponentFactory {
        return {
            containerName: 'uncompleted_steps'
            , componentFactory: this.componentFactoryResolver.resolveComponentFactory(InsuranceUncompletedStepsComponent)
        };
    }
    private getBackNextStepFactory(): CheckoutComponentFactory {
        return {
            containerName: 'back_next'
            , componentFactory: this.componentFactoryResolver.resolveComponentFactory(BackNextControllerComponent)
        };
    }
    private getCompletedStepsFactory(): CheckoutComponentFactory {
        return {
            containerName: 'completed_steps'
            , componentFactory: this.componentFactoryResolver.resolveComponentFactory(InsuranceCompletedStepsComponent)
        };
    }
  private getHeaderFactory(): CheckoutComponentFactory {
    return {
      containerName: 'header'
      , componentFactory: this.componentFactoryResolver.resolveComponentFactory(CheckoutHeaderComponent)
    };
  }

  private getCostItemDetail(productCode: string): CheckoutComponentFactory {
        const componentFactoryType = this.getComponentFactoryTypeFromRule(productCode);
        switch (componentFactoryType) {
            case 'cost-item-list':
                return  {
                    containerName: 'cost_items_details'
                    , componentFactory: this.componentFactoryResolver.resolveComponentFactory(CostItemListComponent)
                };
            case 'shopping-cart-simple':
                return {
                    containerName: 'cost_items_details'
                    , componentFactory: this.componentFactoryResolver.resolveComponentFactory(CheckoutCostItemDetailsSimpleComponent)
                };
            default:
                return {
                    containerName: 'cost_items_details'
                    ,componentFactory: this.componentFactoryResolver.resolveComponentFactory(CheckoutCostItemDetailsComponent)
                };
        }
    }

    private getComponentFactoryTypeFromRule(productCode: string): string {
        this.componentFeaturesService.useComponent(this.COMPONENT);
        this.componentFeaturesService.useRule(this.RULE);
        if (this.componentFeaturesService.isRuleEnabled()) {
          const configs: FactoryConstraintConfig[] = this.componentFeaturesService.getConstraints().get(this.CONSTRAINT);
          let factoryConfig = configs.find(config => config.products.includes(productCode));
          if(factoryConfig){
            return factoryConfig.factory;
          } else {
            return "";
          }
        }
      }

    private getShoppingCartDetail(): CheckoutComponentFactory {
        return {
            containerName: 'cost_items_details_shopping_cart'
            , componentFactory: this.componentFactoryResolver.resolveComponentFactory(CheckoutCostItemDetailsShoppingCartComponent)
        };
    }
    private getCollaborationSectionFactory(): CheckoutComponentFactory {
        return {
            containerName: 'collaboration_section'
            , componentFactory: this.componentFactoryResolver.resolveComponentFactory(CheckoutCollaborationSectionComponent)
        };
    }        
}
