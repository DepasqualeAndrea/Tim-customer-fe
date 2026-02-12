import {KenticoAbstractService} from '../kentico-abstract.service';
import {TypeResolver} from 'kentico-cloud-delivery';
import {KenticoConfigurator} from '../../kentico-configurator.service';


export class KenticoGenericService extends KenticoAbstractService {

  constructor(
    protected kenticoTenantConfigurator: KenticoConfigurator,
    protected apiKey: string,
    protected resolvers: TypeResolver[],
    protected previewApiKey: string,
    protected usePreviewMode: boolean

  ) {
    super(kenticoTenantConfigurator, apiKey, resolvers, previewApiKey, usePreviewMode);
  }

}
