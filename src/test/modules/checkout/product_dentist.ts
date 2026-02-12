export const PRODUCT_DENTIST = 
{
    "id": 8,
    "orderId": "R939225812",
    "lineItemId": 75172,
    "variantId": 35,
    "code": "ba-dentist",
    "name": "Yolo Dentista",
    "image": "https://yolo-integration.s3.amazonaws.com/spree/images/attachments/80/small/dentista.png?1541759924",
    "currency": {
        "code": "EUR"
    },
    "quantity": 1,
    "extra": {},
    "costItems": [
        {
            "name": "Costo Unitario",
            "amount": 1.5,
            "multiplicator": 1,
            "type": 0
        },
        {
            "name": "Totale",
            "amount": 1.5,
            "type": 2
        }
    ],
    "order": {
        "id": 71167,
        "number": "R939225812",
        "total": 1.5,
        "state": "address",
        "adjustment_total": "0.0",
        "user_id": null,
        "created_by_id": null,
        "created_at": "2020-01-07T12:36:38.006+01:00",
        "updated_at": "2020-01-07T12:36:38.111+01:00",
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
        "token": "tRTJ0_olpMUDRemHolX0ew",
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
            "running": 75172,
            "history": [
                75172
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
                "id": 75172,
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
    },
    "questions": {
        "0": {
            "id": 25,
            "content": "<p>E&rsquo; a conoscenza che il servizio consiste nella possibilit&agrave; di usufruire di tariffe agevolate su prestazioni dentistiche solo se erogate da strutture convenzionate?</p>",
            "acceptable_answers": [
                {
                    "id": 73,
                    "question_id": 25,
                    "value": "Si",
                    "created_at": "2018-09-27T12:23:29.278+02:00",
                    "updated_at": "2018-09-27T12:23:29.278+02:00",
                    "position": 0
                },
                {
                    "id": 74,
                    "question_id": 25,
                    "value": "No",
                    "rule": "prevent_checkout",
                    "created_at": "2018-09-27T12:23:29.279+02:00",
                    "updated_at": "2018-09-27T12:23:29.279+02:00",
                    "position": 0
                },
                {
                    "id": 75,
                    "question_id": 25,
                    "value": "Non rispondo",
                    "rule": "requires_acknowledgement",
                    "created_at": "2018-09-27T12:23:29.281+02:00",
                    "updated_at": "2018-09-27T12:23:29.281+02:00",
                    "position": 0
                }
            ]
        },
        "1": {
            "id": 26,
            "content": "<p>E&rsquo; a conoscenza che il servizio &ldquo;Singolo&rdquo; &egrave; valido per una sola persona, mentre il servizio &ldquo;Nucleo&rdquo; &egrave; valido per due o pi&ugrave; persone facenti parte dello stesso nucleo familiare cos&igrave; come descritto nel Contratto di Servizio?</p>",
            "acceptable_answers": [
                {
                    "id": 76,
                    "question_id": 26,
                    "value": "Si",
                    "created_at": "2018-09-27T12:23:29.283+02:00",
                    "updated_at": "2018-09-27T12:23:29.283+02:00",
                    "position": 0
                },
                {
                    "id": 77,
                    "question_id": 26,
                    "value": "No",
                    "rule": "prevent_checkout",
                    "created_at": "2018-09-27T12:23:29.285+02:00",
                    "updated_at": "2018-09-27T12:23:29.285+02:00",
                    "position": 0
                },
                {
                    "id": 78,
                    "question_id": 26,
                    "value": "Non rispondo",
                    "rule": "requires_acknowledgement",
                    "created_at": "2018-09-27T12:23:29.287+02:00",
                    "updated_at": "2018-09-27T12:23:29.287+02:00",
                    "position": 0
                }
            ]
        },
        "2": {
            "id": 27,
            "content": "<p>E&rsquo; a conoscenza che il contratto prevede un pagamento mensile ricorrente (a rinnovo tacito e automatico)?</p>",
            "acceptable_answers": [
                {
                    "id": 79,
                    "question_id": 27,
                    "value": "Si",
                    "created_at": "2018-09-27T12:23:29.289+02:00",
                    "updated_at": "2018-09-27T12:23:29.289+02:00",
                    "position": 0
                },
                {
                    "id": 80,
                    "question_id": 27,
                    "value": "No",
                    "rule": "prevent_checkout",
                    "created_at": "2018-09-27T12:23:29.291+02:00",
                    "updated_at": "2018-09-27T12:23:29.291+02:00",
                    "position": 0
                },
                {
                    "id": 81,
                    "question_id": 27,
                    "value": "Non rispondo",
                    "rule": "requires_acknowledgement",
                    "created_at": "2018-09-27T12:23:29.292+02:00",
                    "updated_at": "2018-09-27T12:23:29.292+02:00",
                    "position": 0
                }
            ]
        },
        "3": {
            "id": 28,
            "content": "<p>E&rsquo; a conoscenza che &egrave; possibile recedere in qualsiasi momento?</p>",
            "acceptable_answers": [
                {
                    "id": 82,
                    "question_id": 28,
                    "value": "Si",
                    "created_at": "2018-09-27T12:23:29.294+02:00",
                    "updated_at": "2018-09-27T12:23:29.294+02:00",
                    "position": 0
                },
                {
                    "id": 83,
                    "question_id": 28,
                    "value": "No",
                    "rule": "prevent_checkout",
                    "created_at": "2018-09-27T12:23:29.296+02:00",
                    "updated_at": "2018-09-27T12:23:29.296+02:00",
                    "position": 0
                },
                {
                    "id": 84,
                    "question_id": 28,
                    "value": "Non rispondo",
                    "rule": "requires_acknowledgement",
                    "created_at": "2018-09-27T12:23:29.298+02:00",
                    "updated_at": "2018-09-27T12:23:29.298+02:00",
                    "position": 0
                }
            ]
        }
    },
    "originalProduct": {
        "id": 8,
        "product_code": "ba-dentist",
        "name": "Yolo Dentista",
        "title_prod": "<p>Assicurazione dentistica</p>",
        "short_description": "<p><strong>YOLO Dentista</strong> &egrave; un servizio per te e la tua famiglia che ti garantisce qualit&agrave;, capillarit&agrave;, vicino a casa tua ti permette un risparmio fino al 70% rispetto al mercato grazie a tariffe fisse e preconcordate per ogni singola prestazione</p>",
        "description": "<p>Il beneficiario pu&ograve; ricevere le cure dentarie specifiche per le sue esigenze&nbsp;<strong>scegliendo di volta in volta tra i CENTRI ODONTOIATRICI CONVENZIONATI CON YOLO DENTISTA</strong>&nbsp;pi&ugrave; adatti e pi&ugrave; vicini.</p>\r\n<ul>\r\n<li>Il network di odontoiatri convenzionato &egrave; composto, ad oggi, da&nbsp;<strong>PI&Ugrave; DI 1.150 PROFESSIONISTI</strong>, distribuiti sull&rsquo;intero territorio nazionale.</li>\r\n<li>Il numero &egrave; in costante aumento grazie al continuo ampliamento della rete.</li>\r\n</ul>",
        "conditions": "<p>SCELTA DEL DENTISTA</p>\r\n<ul>\r\n<li>&Egrave; possibile scegliere, senza limiti di volte, la struttura pi&ugrave; adatta presso cui effettuare le prestazioni</li>\r\n<li>&Egrave; disponibile un&rsquo;area dedicata che permette di profilare la ricerca secondo parametri geografici</li>\r\n<li>Il servizio di geolocalizzazione rende estremamente agevole la visualizzazione della struttura pi&ugrave; vicina</li>\r\n</ul>\r\n<p>&nbsp;</p>\r\n<p>RISPARMIO E STAMPA DEL VOUCHER</p>\r\n<div class=\"text_exclusions text-left\">Sono esclusi i sinistri per i quali:</div>\r\n<ul>\r\n<li><strong>Risparmio fino al 70%</strong><br>rispetto al mercato grazie a tariffe fisse e preconcordate per ogni singola prestazione</li>\r\n<li><strong>Trasparenza</strong></li>\r\n<li>Le tariffe sono sempre consultabili online</li>\r\n<li>L&rsquo;intero network applica un&nbsp;<strong>TARIFFARIO UNICO</strong>&nbsp;sull&rsquo;intero territorio&nbsp;<strong>nazionale</strong></li>\r\n<li>Dopo aver effettuato la scelta ed il salvataggio il sistema crea il voucher, in formato .pdf, contenente i dati del beneficiario e del centro selezionato</li>\r\n<li>Il voucher, presentato in forma cartacea al professionista, d&agrave; diritto di accedere alle prestazioni con le agevolazioni economiche concordate con il network</li>\r\n</ul>",
        "information_package": "https://yolo-integration.s3.amazonaws.com/spree/products/information_packages/000/000/008/original/Yolo_DENTISTA_Carta_Dr_Smalto_Condizioni_Contrattuali.pdf?1571205867",
        "conditions_package": "/conditions_packages/original/missing.png",
        "display_price": "1,50 €",
        "price": 1.5,
        "only_contractor": true,
        "maximum_insurable": 1,
        "can_open_claim": false,
        "holder_maximum_age": 150,
        "holder_minimum_age": 0,
        "show_in_dashboard": true,
        "images": [
            {
                "id": 12,
                "image_type": "default",
                "mini_url": "https://yolo-integration.s3.amazonaws.com/spree/images/attachments/12/mini/dentista.jpg?1513811568",
                "small_url": "https://yolo-integration.s3.amazonaws.com/spree/images/attachments/12/small/dentista.jpg?1513811568",
                "product_url": "https://yolo-integration.s3.amazonaws.com/spree/images/attachments/12/product/dentista.jpg?1513811568",
                "large_url": "https://yolo-integration.s3.amazonaws.com/spree/images/attachments/12/large/dentista.jpg?1513811568",
                "original_url": "https://yolo-integration.s3.amazonaws.com/spree/images/attachments/12/original/dentista.jpg?1513811568"
            },
            {
                "id": 42,
                "image_type": "app_icon",
                "mini_url": "https://yolo-integration.s3.amazonaws.com/spree/images/attachments/42/mini/icon_dentista.jpg?1522069742",
                "small_url": "https://yolo-integration.s3.amazonaws.com/spree/images/attachments/42/small/icon_dentista.jpg?1522069742",
                "product_url": "https://yolo-integration.s3.amazonaws.com/spree/images/attachments/42/product/icon_dentista.jpg?1522069742",
                "large_url": "https://yolo-integration.s3.amazonaws.com/spree/images/attachments/42/large/icon_dentista.jpg?1522069742",
                "original_url": "https://yolo-integration.s3.amazonaws.com/spree/images/attachments/42/original/icon_dentista.jpg?1522069742"
            },
            {
                "id": 80,
                "image_type": "fp_image",
                "mini_url": "https://yolo-integration.s3.amazonaws.com/spree/images/attachments/80/mini/dentista.png?1541759924",
                "small_url": "https://yolo-integration.s3.amazonaws.com/spree/images/attachments/80/small/dentista.png?1541759924",
                "product_url": "https://yolo-integration.s3.amazonaws.com/spree/images/attachments/80/product/dentista.png?1541759924",
                "large_url": "https://yolo-integration.s3.amazonaws.com/spree/images/attachments/80/large/dentista.png?1541759924",
                "original_url": "https://yolo-integration.s3.amazonaws.com/spree/images/attachments/80/original/dentista.png?1541759924"
            }
        ],
        "payment_methods": [
            {
                "id": 3,
                "name": "Braintree Recurrent",
                "type": "Spree::Gateway::BraintreeRecurrent"
            }
        ],
        "addons": [],
        "type": "BlueAssistance::Dentist::Product",
        "category": "Health",
        "variants": [
            {
                "id": 35,
                "name": "blueassistance_single",
                "option_values": [
                    {
                        "id": 6,
                        "name": "blueassistance_single",
                        "presentation": "Singolo",
                        "option_type_name": "coverage",
                        "option_type_id": 2
                    }
                ],
                "price": 1.5
            },
            {
                "id": 36,
                "name": "blueassistance_family",
                "option_values": [
                    {
                        "id": 7,
                        "name": "blueassistance_family",
                        "presentation": "Famiglia",
                        "option_type_name": "coverage",
                        "option_type_id": 2
                    }
                ],
                "price": 4
            }
        ],
        "properties": [],
        "questions": [
            {
                "id": 25,
                "content": "<p>E&rsquo; a conoscenza che il servizio consiste nella possibilit&agrave; di usufruire di tariffe agevolate su prestazioni dentistiche solo se erogate da strutture convenzionate?</p>",
                "acceptable_answers": [
                    {
                        "id": 73,
                        "question_id": 25,
                        "value": "Si",
                        "created_at": "2018-09-27T12:23:29.278+02:00",
                        "updated_at": "2018-09-27T12:23:29.278+02:00",
                        "position": 0
                    },
                    {
                        "id": 74,
                        "question_id": 25,
                        "value": "No",
                        "rule": "prevent_checkout",
                        "created_at": "2018-09-27T12:23:29.279+02:00",
                        "updated_at": "2018-09-27T12:23:29.279+02:00",
                        "position": 0
                    },
                    {
                        "id": 75,
                        "question_id": 25,
                        "value": "Non rispondo",
                        "rule": "requires_acknowledgement",
                        "created_at": "2018-09-27T12:23:29.281+02:00",
                        "updated_at": "2018-09-27T12:23:29.281+02:00",
                        "position": 0
                    }
                ]
            },
            {
                "id": 26,
                "content": "<p>E&rsquo; a conoscenza che il servizio &ldquo;Singolo&rdquo; &egrave; valido per una sola persona, mentre il servizio &ldquo;Nucleo&rdquo; &egrave; valido per due o pi&ugrave; persone facenti parte dello stesso nucleo familiare cos&igrave; come descritto nel Contratto di Servizio?</p>",
                "acceptable_answers": [
                    {
                        "id": 76,
                        "question_id": 26,
                        "value": "Si",
                        "created_at": "2018-09-27T12:23:29.283+02:00",
                        "updated_at": "2018-09-27T12:23:29.283+02:00",
                        "position": 0
                    },
                    {
                        "id": 77,
                        "question_id": 26,
                        "value": "No",
                        "rule": "prevent_checkout",
                        "created_at": "2018-09-27T12:23:29.285+02:00",
                        "updated_at": "2018-09-27T12:23:29.285+02:00",
                        "position": 0
                    },
                    {
                        "id": 78,
                        "question_id": 26,
                        "value": "Non rispondo",
                        "rule": "requires_acknowledgement",
                        "created_at": "2018-09-27T12:23:29.287+02:00",
                        "updated_at": "2018-09-27T12:23:29.287+02:00",
                        "position": 0
                    }
                ]
            },
            {
                "id": 27,
                "content": "<p>E&rsquo; a conoscenza che il contratto prevede un pagamento mensile ricorrente (a rinnovo tacito e automatico)?</p>",
                "acceptable_answers": [
                    {
                        "id": 79,
                        "question_id": 27,
                        "value": "Si",
                        "created_at": "2018-09-27T12:23:29.289+02:00",
                        "updated_at": "2018-09-27T12:23:29.289+02:00",
                        "position": 0
                    },
                    {
                        "id": 80,
                        "question_id": 27,
                        "value": "No",
                        "rule": "prevent_checkout",
                        "created_at": "2018-09-27T12:23:29.291+02:00",
                        "updated_at": "2018-09-27T12:23:29.291+02:00",
                        "position": 0
                    },
                    {
                        "id": 81,
                        "question_id": 27,
                        "value": "Non rispondo",
                        "rule": "requires_acknowledgement",
                        "created_at": "2018-09-27T12:23:29.292+02:00",
                        "updated_at": "2018-09-27T12:23:29.292+02:00",
                        "position": 0
                    }
                ]
            },
            {
                "id": 28,
                "content": "<p>E&rsquo; a conoscenza che &egrave; possibile recedere in qualsiasi momento?</p>",
                "acceptable_answers": [
                    {
                        "id": 82,
                        "question_id": 28,
                        "value": "Si",
                        "created_at": "2018-09-27T12:23:29.294+02:00",
                        "updated_at": "2018-09-27T12:23:29.294+02:00",
                        "position": 0
                    },
                    {
                        "id": 83,
                        "question_id": 28,
                        "value": "No",
                        "rule": "prevent_checkout",
                        "created_at": "2018-09-27T12:23:29.296+02:00",
                        "updated_at": "2018-09-27T12:23:29.296+02:00",
                        "position": 0
                    },
                    {
                        "id": 84,
                        "question_id": 28,
                        "value": "Non rispondo",
                        "rule": "requires_acknowledgement",
                        "created_at": "2018-09-27T12:23:29.298+02:00",
                        "updated_at": "2018-09-27T12:23:29.298+02:00",
                        "position": 0
                    }
                ]
            }
        ],
        "master_variant": 20,
        "goods": [],
        "extras": [],
        "quotator_type": "quotator_variants",
        "product_structure": {
            "product_header": {
                "title": "Affronta la salute dei tuoi denti col sorriso,",
                "descr": "con Yolo Dentista!",
                "bg_color": "#2C8FE6",
                "image": "https://yolo-insurance.com/assets/products/toothinspect-1415cf5eebb45bc8ddaf8d53384c687b8c857761966cb4aefbff2d2ffd5394b9.svg"
            },
            "product_how": {
                "text_html": "<h1>Come funziona</h1><p>Yolo Dentista è la soluzione ideale per la cura e la salute del tuo sorriso. Grazie agli oltre 1.000 centri convenzionati, potrai ricevere tutte le prestazioni di cui necessiti, in totale serenità e a costi agevolati.</p><p>Ecco le prestazioni a cui puoi aver accesso con Yolo dentista:</p><ul><li>Ablazione del tartaro, devitalizzazioni e otturazioni</li><li>Radiografia</li><li>Protesi in resina o ceramica</li><li>Fluoroprofilassi</li><li>Sigillatura</li><li>Estrazione dei denti e riparazione delle protesi</li><li>Corona protesica provvisoria</li></ul><p>L'assicurazione ha una durata annuale. Potrai pagarla in 12 rate mensili e potrai disdire l'assicurazione solo allo scadere della dodicesima rata.</p>",
                "img_left": "https://yolo-insurance.com/assets/products/toothbrush-5afb9b26db3aa645188ad56b860c1fb490a3dc7ce8fd4e3c33e0d37fbf75bac4.svg",
                "img_right": "https://yolo-insurance.com/assets/products/zoomtooth-19f459f1c7d8129bf8e8469dd78d2da17a8483c0f6769e41bd298020b29fe74e.svg"
            },
            "product_what": {
                "text_html": "<h1>Cos'altro devi sapere</h1><p>Yolo Dentista è un servizio on demand in abbonamento che ti permette di accedere ai migliori centri odontoiatrici in pochi semplici passi e a condizioni vantaggiose.</p><p>          Per accedere al servizio ti basta:          </p>          <ul>          <li>Scegliere il coupon che intendi acquistare, per te o la tua famigli </li>          <li>Completare il processo di acquisto, riceverai per email le istruzioni per accedere al servizio sul sito My net di Blue Assistance</li>          <li>Scegliere la struttura convenzionata più vicina</li>          <li>Ti verrà creato un voucher in formato PDF che dovrai presentare il giorno della prestazione</li>          </ul>          <p>          Per maggiori informazioni          <a target=\"_blank\" href=\"https://yolo-production.s3.amazonaws.com/spree/products/conditions_packages/000/000/009/original/Yolo_DENTISTA_Carta_Dr_Smalto_Condizioni_Contrattuali.pdf?1521736029\">Scarica le condizioni di servizio</a>.</p>",
                "img_left": "",
                "img_right": "https://yolo-insurance.com/assets/products/tools-ac36ccdf71c9f71c12748f6702328798dbed2b9494fca92cf9919aa8b9b8194e.svg"
            },
            "product_found": {
                "text_html": "<div class=\"product-found-y row justify-content-center\"><section class=\"middle-container\"><div class=\"row m-0 d-block\"><h3 class=\"pf-title mt-4 mb-4\">Non hai trovato quello che cercavi?</h3><p>Vuoi assicurare protezione a un bene che non è tra quelli elencati?</p><p>Fornisci tutte le informazioni utili, cercheremo di rispondere ai tuoi bisogni il prima possibile.</p> <button class=\"btn-animation\" routerLink=\"/contatti\"> Contattaci</button> </div></section></div>",
                "img_left": "https://yolo-insurance.com/assets/products/openmouth-b3c329c8fc52fa2023e6dc1dcf536d553f93f8b6f4cbcf79d7c7ea9c3a52c2dc.svg"
            }
        },
        "travel_detinations": [],
        "provider": {
            "name": "Blue Assistance",
            "image_url": "https://yolo-integration.s3.amazonaws.com/yolo/providers/images/000/000/003/original/blue.png?1554739251"
        }
    },
    "paymentMethods": [
        {
            "id": 3,
            "name": "Braintree Recurrent",
            "type": "Spree::Gateway::BraintreeRecurrent"
        }
    ],
    "duration": 32,
    "durationUnit": "coverage",
    "startDate": "2020-01-06T23:00:00.000Z",
    "endDate": "2020-02-07T23:00:00.000Z"
}