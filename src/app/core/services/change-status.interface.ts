export interface StatusRequest {
  entity_type: string;
  status: string;
  idOperation: null;
  insuranceFactor: {
    amount: number;
    dExpiration: null;
    dOperation: string;
    dEffect: null;
    duration: null;
    nrPolicy: null;
    product: string;
    questionnaire: null;
    sogInsured: null
  };
  questionnaire?: [
    {
      code: string;
      description: string;
      answer: string;
      type: string;
      valoriDrop: [
        {
          code: string;
          description: string
        }
      ]
    },
    {
      code: string;
      description: string;
      answer: string;
      type: string;
      valoriDrop: [
        {
          code: string;
          description: string
        }
      ]
    }
  ];
  sogInsured?: [
    {
      name: string;
      surname: string;
      cf: string;
      dBirth: string
    }
  ];
  pdf: null;
}

export interface StatusResponse {
  status: string;
  errors: Array<Object>;
  idOperation: string;
  idPreventivo: string;
}
