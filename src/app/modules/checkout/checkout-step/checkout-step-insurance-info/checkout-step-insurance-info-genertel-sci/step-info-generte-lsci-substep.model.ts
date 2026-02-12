export enum StepInfoGenertelSciSubstep {
  INSURANCE_DATE = 'select_date',
  INSURANCE_HOLDERS = 'insert_insurance_holders_data',
  CONTRACTOR_INFO = 'insert_contractor_info',
  CONTRACTOR_ADDRESS = 'insert_contractor_address',
  CONTRACTOR_CONTACTS = 'insert_contractor_contacts',
}

export const stepInfoGenertelSciSubsteps = [
  StepInfoGenertelSciSubstep.INSURANCE_DATE,
  StepInfoGenertelSciSubstep.INSURANCE_HOLDERS,
  StepInfoGenertelSciSubstep.CONTRACTOR_INFO,
  StepInfoGenertelSciSubstep.CONTRACTOR_ADDRESS,
  StepInfoGenertelSciSubstep.CONTRACTOR_CONTACTS,
]