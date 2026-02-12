export class digitalData {
    cart: {
        ID?: string;
        attributes?: {
            error?: {
                ID?: string;
                description?: string;
            };
        };
        item: ItemCart[];
        price: {
            cartTotal: string | number;
        }
        form:{
            paymentmethod: string;
            mypet_pet_type: string;
            codice_sconto: string;
            sci_numassicurati: number;
            sci_min14: number;
            sci_polizza: string;
            button_name: string
        }
    }

    page: {
        attributes: {
            siteArea: string;
            webSite: string;
        }
        category: {
            pageType: string;
            primaryCategory: string;
        }
        pageInfo: {
            pageName: string;
        }
    }
    transaction: {
        transactionID?: string;
    }

    constructor() {
    }
}

export class ItemCart{
    price: string | number;
    productInfo: {
        productID: string;
        productName: string;
    }
    quantity: number;
}
