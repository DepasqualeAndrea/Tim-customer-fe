export class DataServiceMockBase {
    constructor() {

    }
    public tenantInfo: any = {
        products: { 'tutela-legale': { product_code: 'tutela-legale' } },
        header: { layout: {} },
        main: { layout: {} }
    };

    public tenantProductInfo = {
        section_1: { },
        quotator: {},
        section_2: {}
    };
    setTenantProductInfo(info) {
    }
}
