export const ORDER_DENTIST_DATASERVICE =
{
    "id": 71172,
    "number": "R505106942",
    "total": 1.5,
    "state": "address",
    "adjustment_total": "0.0",
    "user_id": null,
    "created_by_id": null,
    "created_at": "2020-01-07T14:47:10.712+01:00",
    "updated_at": "2020-01-07T14:47:10.811+01:00",
    "completed_at": null,
    "payment_state": null,
    "email": null,
    "special_instructions": null,
    "verbal_order": "/verbal_orders/original/missing.png",
    "channel": "api",
    "utm_source": "",
    "currency": "EUR",
    "canceler_id": null,
    "type": "BlueAssistance::Dentist::Order",
    "quotation_id": null,
    "item_total": 1.5,
    "payment_total": 0,
    "display_item_total": "1,50 €",
    "total_quantity": 1,
    "display_total": "1,50 €",
    "token": "UgGTbk-yGOcykvnLD4aRBw",
    "checkout_steps": [
        "address",
        "payment",
        "confirm",
        "complete"
    ],
    "payments_sources": [],
    "payment_methods": [
        {
            "id": 3,
            "name": "Braintree Recurrent",
            "type": "Spree::Gateway::BraintreeRecurrent"
        }
    ],
    "bill_address": null,
    "payments": [],
    "credit_cards": [],
    "insurances": {
        "running": 75177,
        "history": [
            75177
        ],
        "last_renewed": null,
        "last_renewed_policy_number": null,
        "renew_candidate": null,
        "renewal_date": null,
        "replace_date": null
    },
    "extra": {},
    "data": null,
    "line_items": [
        {
            "id": 75177,
            "quantity": 1,
            "price": 1.5,
            "variant_id": 35,
            "policy_number": null,
            "master_policy_number": null,
            "state": "current",
            "start_date": "2020-01-07T00:00:00.000+01:00",
            "expiration_date": "2020-02-08T00:00:00.000+01:00",
            "insured_is_contractor": true,
            "papery_docs": false,
            "instant": false,
            "replace_date": null,
            "appliances_properties": null,
            "pet_properties": null,
            "variant": {
                "product_id": 8,
                "id": 35,
                "name": "blueassistance_single",
                "sku": "",
                "option_values": [
                    {
                        "id": 6,
                        "name": "blueassistance_single",
                        "presentation": "Singolo",
                        "option_type_name": "coverage",
                        "option_type_id": 2,
                        "duration": null,
                        "quantity": null
                    }
                ],
                "product_properties": {},
                "price": 1.5,
                "fixed_start_date": null,
                "fixed_end_date": null,
                "images": []
            },
            "addons": [],
            "insurance_info": {
                "destination": {}
            },
            "installments": {},
            "single_display_amount": "1,50 €",
            "display_amount": "1,50 €",
            "total": 1.5,
            "insured_entities": {
                "insurance_holders": null,
                "pets": null,
                "house": null,
                "houses": null,
                "bike": null,
                "appliances": null
            },
            "answers": []
        }
    ]
}