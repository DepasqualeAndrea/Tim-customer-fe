import { ConfigurationService } from '../configuration.service';

export class ConfigurationMockService extends ConfigurationService {
  getFeaturesToggle() {
    throw new Error("getFeaturesToggle")
  }

  getContents() {
    throw new Error("getContents")
  }
}
