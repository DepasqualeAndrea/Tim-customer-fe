import { StepInfoGenertelSciSubstep } from "../step-info-generte-lsci-substep.model";

export const insuranceInfoDataLayerSciSubsteps = [
  {
    step: StepInfoGenertelSciSubstep.INSURANCE_DATE,
    value: {
      vpv: '/preventivatore/diretto/sci/quando-vuoi-essere-assicurato',
      vpvt: 'Preventivatore Sci - Selezione Data Start'
    }
  },
  {
    step: StepInfoGenertelSciSubstep.INSURANCE_HOLDERS,
    value: {
      vpv: '/preventivatore/diretto/sci/anagrafica-persone-da-assicurare',
      vpvt: 'Preventivatore Sci - Anagrafica Persone da Assicurare'
    }
  },
  {
    step: StepInfoGenertelSciSubstep.CONTRACTOR_INFO,
    value: {
      vpv: '/preventivatore/diretto/sci/dove-abita-il-contraente',
      vpvt: 'Preventivatore Sci - Anagrafica Contraente'
    }
  }
];