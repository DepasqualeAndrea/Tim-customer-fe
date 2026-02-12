export enum StepInfoTimMySciSubstep {
  INSURED_NUMBER = 'insured_holders_number',
  DURATION = 'policy_duration',
  SELECT_TYPE = 'select_policy_type',
  INSURED_DATA = 'insured_holders_data'
}

export const stepInfoTimMySciSubsteps = [
  StepInfoTimMySciSubstep.INSURED_NUMBER,
  StepInfoTimMySciSubstep.DURATION,
  StepInfoTimMySciSubstep.SELECT_TYPE,
  StepInfoTimMySciSubstep.INSURED_DATA,
]