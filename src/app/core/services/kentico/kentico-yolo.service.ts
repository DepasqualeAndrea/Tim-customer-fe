import { Injectable } from '@angular/core';
import { DeliveryClient } from 'kentico-cloud-delivery';
import { KenticoAbstractService } from '../../../modules/kentico/data-layer/kentico-abstract.service';
import { KenticoConfig } from '../../../modules/kentico/kentico-config.model';
import { KenticoConfigurator } from '../../../modules/kentico/kentico-configurator.service';
import { TenantDefault } from 'app/modules/tenants/default/tenant-default.module';

@Injectable({ providedIn: 'root' })
export class KenticoYoloService extends KenticoAbstractService {

  constructor(protected kenticoConfigurator: KenticoConfigurator) {
    super(kenticoConfigurator, TenantDefault.KENTICO_API, null, null, null);
  }

  initDeliveryClient() {
    return new DeliveryClient({
      projectId: TenantDefault.KENTICO_API,
      previewApiKey: TenantDefault.KENTICO_PREVIEW_API,
      globalQueryConfig: {
        usePreviewMode: TenantDefault.KENTICO_USE_PREVIEW_MODE
      },
      typeResolvers: this.contentsTypeResolvers,
      linkedItemResolver: {
        linkedItemWrapperTag: 'div'
      }
    });

  }

}


