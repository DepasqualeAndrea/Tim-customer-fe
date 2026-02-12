export const SPORTMOCK = {
  'id': 47,
  'product_code': 'chubb-sport-rec',
  'name': 'Yolo Sport',
  'title_prod': '',
  'short_description': '',
  'description': '<p>&Egrave; una assicurazione infortuni, assistenza e responsabilit&agrave; civile che garantisce all&rsquo;assicurato coperture adeguate durante lo svolgimento di sport amatoriale &ndash; praticato in palestra o all&rsquo;aperto &ndash; finalizzato al raggiungimento e al mantenimento del benessere psico-fisico della persona.</p>',
  'conditions': '<p>Soggetti Assicurabili:</p>\r\n<ul>\r\n<li>\r\n<div><nav>\r\n<li>Persone la cui et&agrave; non abbia raggiunto i 60 anni di et&agrave;</li>\r\n<li>Residenti o domiciliati in Italia, Repubblica di San Marino o Stato Citt&agrave; del Vaticano</li>\r\n</nav></div>\r\n<div>&nbsp;</div>\r\n</li>\r\n</ul>\r\n<p>Sono esclusi dalla presente assicurazione i sinistri derivanti da:</p>\r\n<ul>\r\n<li>Sport praticati a livello competitivo che generino compensi monetari</li>\r\n<li>Partecipazione a eventi organizzati da scuole o universit&agrave;, se gi&agrave; assicurati dalle stesse</li>\r\n<li>Partecipazione ai Giochi della Giovent&ugrave;</li>\r\n<li>Partecipazione a campionati sportivi nazionali o internazionali</li>\r\n</ul>',
  'information_package': 'https://yolo-staging.s3.amazonaws.com/spree/products/information_packages/000/000/047/original/Yolo_Sport_04022019.pdf?1548864676',
  'conditions_package': '/conditions_packages/original/missing.png',
  'display_price': '4,90 €',
  'price': 4.9,
  'only_contractor': false,
  'maximum_insurable': 20,
  'can_open_claim': true,
  'holder_maximum_age': 65,
  'holder_minimum_age': 4,
  'show_in_dashboard': true,
  'images': [
    {
      'id': 113,
      'image_type': 'app_icon',
      'mini_url': 'https://yolo-staging.s3.amazonaws.com/spree/images/attachments/113/mini/icon_sport_%281%29.jpg?1548864975',
      'small_url': 'https://yolo-staging.s3.amazonaws.com/spree/images/attachments/113/small/icon_sport_%281%29.jpg?1548864975',
      'product_url': 'https://yolo-staging.s3.amazonaws.com/spree/images/attachments/113/product/icon_sport_%281%29.jpg?1548864975',
      'large_url': 'https://yolo-staging.s3.amazonaws.com/spree/images/attachments/113/large/icon_sport_%281%29.jpg?1548864975',
      'original_url': 'https://yolo-staging.s3.amazonaws.com/spree/images/attachments/113/original/icon_sport_%281%29.jpg?1548864975'
    },
    {
      'id': 115,
      'image_type': 'fp_image',
      'mini_url': 'https://yolo-staging.s3.amazonaws.com/spree/images/attachments/115/mini/sport.png?1548864990',
      'small_url': 'https://yolo-staging.s3.amazonaws.com/spree/images/attachments/115/small/sport.png?1548864990',
      'product_url': 'https://yolo-staging.s3.amazonaws.com/spree/images/attachments/115/product/sport.png?1548864990',
      'large_url': 'https://yolo-staging.s3.amazonaws.com/spree/images/attachments/115/large/sport.png?1548864990',
      'original_url': 'https://yolo-staging.s3.amazonaws.com/spree/images/attachments/115/original/sport.png?1548864990'
    }
  ],
  'payment_methods': [
    {
      'id': 3,
      'name': 'Braintree Recurrent',
      'type': 'Spree::Gateway::BraintreeRecurrent'
    }
  ],
  'addons': [
    {
      'id': 3,
      'code': 'sport-equip',
      'name': 'Equipaggiamento Sportivo',
      'description': 'Copertura dell’attrezzatura sportiva soltanto se il danno è conseguente a infortunio',
      'image': {
        'id': 111,
        'image_type': 'default',
        'mini_url': 'https://yolo-staging.s3.amazonaws.com/spree/images/attachments/111/mini/sport_equip.?1548864754',
        'small_url': 'https://yolo-staging.s3.amazonaws.com/spree/images/attachments/111/small/sport_equip.?1548864754',
        'product_url': 'https://yolo-staging.s3.amazonaws.com/spree/images/attachments/111/product/sport_equip.?1548864754',
        'large_url': 'https://yolo-staging.s3.amazonaws.com/spree/images/attachments/111/large/sport_equip.?1548864754',
        'original_url': 'https://yolo-staging.s3.amazonaws.com/spree/images/attachments/111/original/sport_equip.?1548864754'
      },
      'taxons': [],
      'price': 0.0
    },
    {
      'id': 4,
      'code': 'sport-rc',
      'name': 'Pacchetto RC',
      'description': 'Copertura in caso di danni a terzi',
      'image': {
        'id': 112,
        'image_type': 'default',
        'mini_url': 'https://yolo-staging.s3.amazonaws.com/spree/images/attachments/112/mini/sport_rc.?1548864777',
        'small_url': 'https://yolo-staging.s3.amazonaws.com/spree/images/attachments/112/small/sport_rc.?1548864777',
        'product_url': 'https://yolo-staging.s3.amazonaws.com/spree/images/attachments/112/product/sport_rc.?1548864777',
        'large_url': 'https://yolo-staging.s3.amazonaws.com/spree/images/attachments/112/large/sport_rc.?1548864777',
        'original_url': 'https://yolo-staging.s3.amazonaws.com/spree/images/attachments/112/original/sport_rc.?1548864777'
      },
      'taxons': [],
      'price': 0.0
    }
  ],
  'type': 'Chubb::SportRecurrent::Product',
  'category': 'People',
  'variants': [
    {
      'id': 179,
      'name': '1 month',
      'option_values': [
        {
          'id': 38,
          'name': '1 month',
          'presentation': 'abbonamento mensile',
          'option_type_name': 'day',
          'option_type_id': 1,
          'duration': 0
        }
      ],
      'price': 4.9
    }
  ],
  'properties': [
    {
      'value': 'Yolo Sport',
      'name': 'uniq_name'
    }
  ],
  'questions': [
    {
      'id': 85,
      'content': 'Ha necessità di assicurarsi contro gli infortuni e i danni, subiti o provocati, mentre svolge attività sportiva a livello amatoriale-dilettantistico? (Agonismo e professionismo sono infatti esclusi)',
      'acceptable_answers': [
        {
          'id': 247,
          'question_id': 85,
          'value': 'Si',
          'created_at': '2019-01-30T17:17:11.090+01:00',
          'updated_at': '2019-01-30T17:17:11.090+01:00',
          'position': 1
        },
        {
          'id': 248,
          'question_id': 85,
          'value': 'No',
          'rule': 'prevent_checkout',
          'created_at': '2019-01-30T17:17:11.094+01:00',
          'updated_at': '2019-01-30T17:17:11.094+01:00',
          'position': 2
        },
        {
          'id': 249,
          'question_id': 85,
          'value': 'Non rispondo',
          'rule': 'requires_acknowledgement',
          'created_at': '2019-01-30T17:17:11.097+01:00',
          'updated_at': '2019-01-30T17:17:11.097+01:00',
          'position': 3
        }
      ]
    },
    {
      'id': 86,
      'content': 'Conferma che non è tesserato presso una Federazione Sportiva o partecipa a competizioni sotto il controllo di Federazioni Sportive e/o che prevedono una remunerazione?',
      'acceptable_answers': [
        {
          'id': 250,
          'question_id': 86,
          'value': 'Si',
          'created_at': '2019-01-30T17:17:25.485+01:00',
          'updated_at': '2019-01-30T17:17:25.485+01:00',
          'position': 1
        },
        {
          'id': 251,
          'question_id': 86,
          'value': 'No',
          'rule': 'prevent_checkout',
          'created_at': '2019-01-30T17:17:25.488+01:00',
          'updated_at': '2019-01-30T17:17:25.488+01:00',
          'position': 2
        },
        {
          'id': 252,
          'question_id': 86,
          'value': 'Non rispondo',
          'rule': 'requires_acknowledgement',
          'created_at': '2019-01-30T17:17:25.490+01:00',
          'updated_at': '2019-01-30T17:17:25.490+01:00',
          'position': 3
        }
      ]
    },
    {
      'id': 87,
      'content': 'Pratica Sport definibili come pericolosi o estremi? (ad esempio: qualsiasi pratica “freestyle” o acrobatica, alpinismo oltre il 1° grado della scala U.I.A.A, arti marziali, rugby o footbal americano, “downhill”, pugilato, sport che prevedono l’uso di armi da fuoco o di veicoli a motore)',
      'acceptable_answers': [
        {
          'id': 253,
          'question_id': 87,
          'value': 'Si',
          'created_at': '2019-01-30T17:17:40.936+01:00',
          'updated_at': '2019-01-30T17:17:40.936+01:00',
          'position': 1
        },
        {
          'id': 254,
          'question_id': 87,
          'value': 'No',
          'rule': 'prevent_checkout',
          'created_at': '2019-01-30T17:17:40.939+01:00',
          'updated_at': '2019-01-30T17:17:40.939+01:00',
          'position': 2
        },
        {
          'id': 255,
          'question_id': 87,
          'value': 'Non rispondo',
          'rule': 'requires_acknowledgement',
          'created_at': '2019-01-30T17:17:40.941+01:00',
          'updated_at': '2019-01-30T17:17:40.941+01:00',
          'position': 3
        }
      ]
    },
    {
      'id': 88,
      'content': 'Gli assicurati hanno una età compresa tra i 4 e i 65 anni?',
      'acceptable_answers': [
        {
          'id': 256,
          'question_id': 88,
          'value': 'Si',
          'created_at': '2019-01-30T17:17:55.922+01:00',
          'updated_at': '2019-01-30T17:17:55.922+01:00',
          'position': 1
        },
        {
          'id': 257,
          'question_id': 88,
          'value': 'No',
          'rule': 'prevent_checkout',
          'created_at': '2019-01-30T17:17:55.924+01:00',
          'updated_at': '2019-01-30T17:17:55.924+01:00',
          'position': 2
        },
        {
          'id': 258,
          'question_id': 88,
          'value': 'Non rispondo',
          'rule': 'requires_acknowledgement',
          'created_at': '2019-01-30T17:17:55.927+01:00',
          'updated_at': '2019-01-30T17:17:55.927+01:00',
          'position': 3
        }
      ]
    },
    {
      'id': 89,
      'content': 'E’ in buono stato di salute? (ovvero non soffre di malattie croniche e/o preesistenti?',
      'acceptable_answers': [
        {
          'id': 259,
          'question_id': 89,
          'value': 'Si',
          'created_at': '2019-01-30T17:18:15.249+01:00',
          'updated_at': '2019-01-30T17:18:15.249+01:00',
          'position': 1
        },
        {
          'id': 260,
          'question_id': 89,
          'value': 'No',
          'rule': 'prevent_checkout',
          'created_at': '2019-01-30T17:18:15.252+01:00',
          'updated_at': '2019-01-30T17:18:15.252+01:00',
          'position': 2
        },
        {
          'id': 261,
          'question_id': 89,
          'value': 'Non rispondo',
          'rule': 'requires_acknowledgement',
          'created_at': '2019-01-30T17:18:15.254+01:00',
          'updated_at': '2019-01-30T17:18:17.863+01:00',
          'position': 3
        }
      ]
    }
  ],
  'master_variant': 178,
  'goods': [],
  'extras': {
    'ALPINISMO': '001',
    'ARRAMPICATA AL COPERTO': '002',
    'ATLETICA': '003',
    'AUTOMODELLISMO': '004',
    'BASEBALL/SOFTBALL': '005',
    'BILIARDO': '006',
    'BOCCE': '007',
    'BOWLING': '008',
    'CALCIO A 11-7-5': '009',
    'CANOTTAGGIO': '010',
    'CANYONING': '011',
    'CICLISMO': '012',
    'CORSA/RUNNING/JOGGING': '013',
    'CURLING': '014',
    'DANZA': '015',
    'DANZA SPORTIVA': '016',
    'DIVING – IMMERSIONI': '017',
    'EQUITAZIONE': '018',
    'FITNESS/PALESTRA': '019',
    'FRISBEE': '020',
    'GOLF': '021',
    'JUDO': '022',
    'KAYAKING': '023',
    'NUOTO – TUFFI IN VASCA': '024',
    'NUOTO IN ACQUE LIBERE': '025',
    'NUOTO IN VASCA': '026',
    'PALLACANESTRO': '027',
    'PALLAMANO': '028',
    'PALLAVOLO': '029',
    'PATTINAGGIO SU ROTELLE': '031',
    'PESCA SPORTIVA': '032',
    'PING PONG': '033',
    'RAFTING': '034',
    'SCHERMA': '035',
    'SQUASH': '036',
    'TENNIS': '037',
    'TIRO CON L’ARCO': '038',
    'TREKKING/ESCURSIONISMO': '039',
    'TWIRLING': '040',
    'VELA': '041'
  },
  'quotator_type': 'quotator_chubb-sport-rec',
  'product_structure': {
    'product_header': {
      'title': 'Con Yolo Sport la sicurezza è imbattibile!',
      'bg_color': '#2C8FE6',
      'image': 'https://yolo-insurance.com/assets/products/peopleworkout-b294e0b61ec86ce1bc2506791d6b2bab0407fe9a7693d278fa0cf4c9181933d1.png'
    },
    'product_how': {
      'text_html': '<h1>Come funziona</h1><p>Yolo Sport è l’assicurazione on demand che ti fa vivere al meglio la tua passione per lo sport, proteggendoti ogni volta che lo pratichi, quando vuoi e per quanto vuoi!</p><p>Una partita di calcio o un allenamento organizzati all’ultimo? Da oggi con Yolo Sport la tua copertura è instant, attiva dopo solo 2 ore dall’acquisto.</p><p>Yolo Sport è semplice e intuitiva, personalizzala in base alle tue esigenze! Scegli lo sport, il numero di assicurati, la loro fascia d’età e la durata per calcolare il preventivo.</p><p>Perché dovresti scegliere Yolo Sport?</p><ul><li>Rimborso delle spese mediche e diaria da ricovero a seguito d’infortunio</li><li>Indennizzo a seguito di frattura</li><li>Consulenza medica telefonica, invio di un medico specialista</li><li>Assistenza a domicilio (consegna della spesa, invio di un infermiere e/o di un fisioterapista) a seguito d’infortunio</li></ul>Inoltre puoi aggiungere le seguenti opzioni:<ul><li>copertura RC contro danni a terzi</li><li>copertura dell’attrezzatura sportiva (solo se il danno è conseguente a infortunio)</li></ul><em>N.B. Per i gruppi di minimo 10 persone, viene applicato uno sconto del 10% (sconto applicabile solo per i pacchetti 1 giorno, 3 giorni, 7 giorni).</em><p></p>',
      'img_left': '',
      'img_right': 'https://yolo-insurance.com/assets/products/fitness-98c8c33729cc69cb2588d1eb58ff4510ebe5f8d62f7389e29bbd75a59a9e8087.svg'
    },
    'product_what': {
      'text_html': '<h1>Cos\'altro devi sapere</h1><p>\n  Yolo Sport ha validità esclusivamente per lo sport, le persone ed il periodo indicati in fase di acquisto.\n</p>\n\n<p>\n  Quali sono le condizioni per acquistare Yolo Sport?\n  </p><ul>\n    <li>hai un’età compresa tra i 4 e 64 anni compiuti</li>\n    <li>sei domiciliato o residente in Italia, Repubblica di San Marino o Stato Città del Vaticano</li>\n    <li>utilizzi la polizza per praticare sport a livello amatoriale e per “benessere fisico”</li>\n  </ul>\n<p></p>\n\n<p>\n  Non potrai usufruire delle garanzie di Yolo sport nei seguenti casi:\n  </p><ul class="style-disc">\n    <li>pratica di sport a livello competitivo, pratica di sport estremi o pericolosi</li>\n    <li>Partecipazione a campionati sportivi nazionali o internazionali</li>\n  </ul>\n<p></p>\n\n<p>\n  Per maggiori informazioni   <a target="_blank" href="https://yolo-production.s3.amazonaws.com/spree/products/information_packages/000/000/026/original/Yolo_Sport_26032019.pdf?1553601445">Scarica il set informativo precontrattuale</a>. Consulta l’elenco delle attività sportive coperte da Yolo Sport prima della sottoscrizione.\n</p>\n\n<ul>\n        <li>Alpinismo</li>\n        <li>Arrampicata al coperto</li>\n        <li>Atletica</li>\n        <li>Automodellismo</li>\n        <li>Baseball/softball</li>\n        <li>Biliardo</li>\n        <li>Bocce</li>\n        <li>Bowling</li>\n        <li>Calcio a 11-7-5</li>\n        <li>Canottaggio</li>\n        <li>Canyoning</li>\n          </ul><ul class="col-sm-6 col-md-3 mb-0">\n        <li>Ciclismo</li>\n        <li>Corsa/running/jogging</li>\n        <li>Curling</li>\n        <li>Danza</li>\n        <li>Danza sportiva</li>\n        <li>Diving – immersioni</li>\n        <li>Equitazione</li>\n        <li>Fitness/palestra</li>\n        <li>Frisbee</li>\n        <li>Golf</li>\n          </ul><ul class="col-sm-6 col-md-3 mb-0">\n        <li>Judo</li>\n        <li>Kayaking</li>\n        <li>Nuoto in acque libere</li>\n        <li>Nuoto in vasca</li>\n        <li>Nuoto – tuffi in vasca</li>\n        <li>Pallacanestro</li>\n        <li>Pallamano</li>\n        <li>Pallavolo</li>\n        <li>Pattinaggio su rotelle</li>\n        <li>Pesca sportiva</li>\n          </ul><ul class="col-sm-6 col-md-3 mb-0">\n        <li>Ping pong</li>\n        <li>Rafting</li>\n        <li>Scherma</li>\n        <li>Squash</li>\n        <li>Tennis</li>\n        <li>Tiro con l’arco</li>\n        <li>Trekking/escursionismo</li>\n        <li>Twirling</li>\n        <li>Vela</li>\n    </ul>',
      'img_left': 'https://yolo-insurance.com/assets/products/tennis-6997e9c15c1e4b205178889ee588fa8544d8d392ec65fede971941c2a20e47cf.svg',
      'img_right': ''
    },
    'product_found': {
      'text_html': '<div class="product-found-y row justify-content-center"><section><div class="row m-0 d-block"><h3 class="pf-title mt-4 mb-4">Non hai trovato quello che cercavi?</h3><p>Vuoi assicurare protezione a un bene che non è tra quelli elencati?</p><p>Fornisci tutte le informazioni utili, cercheremo di rispondere ai tuoi bisogni il prima possibile.</p> <button class="btn-animation"> Contattaci</button> </div></section></div>'
    }
  },
  'provider': {
    'name': 'Chubb',
    'image_url': 'https://yolo-staging.s3.amazonaws.com/yolo/providers/images/000/000/001/original/chubb.png?1544702271'
  }
};
