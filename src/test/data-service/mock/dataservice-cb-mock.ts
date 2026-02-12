import { DataServiceMockBase } from './dataservice-mock-base';

export class DataServiceCBmock extends DataServiceMockBase {

    constructor() {
        super();
        this.tenantInfo.main.layout = 'cb';
        this.tenantProductInfo.section_1 = 'cb';
        this.tenantInfo.header.layout = 'y';
    }
}