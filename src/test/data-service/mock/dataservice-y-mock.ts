import { DataServiceMockBase } from './dataservice-mock-base';

export class DataServiceYmock extends DataServiceMockBase {
    constructor() {
        super();
        this.tenantInfo.main.layout = 'y';
        this.tenantInfo.header.layout = 'y';
        this.tenantProductInfo.quotator = 'y';
        this.tenantProductInfo.section_2 = 'y';
    }
}