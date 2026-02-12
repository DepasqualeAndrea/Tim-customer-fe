export interface SportsSpainAddon {
    id?: number;
    code?: string;
    name?: string;
    description?: string;
    image?: {
        id?: number,
        image_type?: string,
        mini_url?: string,
        small_url?: string,
        product_url?: string,
        large_url?: string,
        original_url?: string
      };
    taxons?: any;
    price?: number;
    prices?: [
        {
            id?: number,
            price?: string,
            currency?: string,
            country_iso?: any,
            addon_id?: number,
            deleted_at?: string,
            created_at?: string,
            updated_at?: string,
            variant_id?: number,
        }
    ];
  }
