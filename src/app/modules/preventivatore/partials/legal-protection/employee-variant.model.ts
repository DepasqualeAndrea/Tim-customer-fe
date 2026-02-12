export interface EmployeeVariant {
    product_id?: number;
    id?: number;
    name?: string;
    sku?: string;
    option_values?: {
        id?: number;
        name?: string;
        presentation?: string;
        option_type_name?: string;
        option_type_id?: number;
        duration?: number;
        quantity?: number;
    };
    product_properties?: any;
    price?: number;
    fixed_start_date?: any;
    fixed_end_date?: any;
    images?: string;
}

