export interface IPaymentResponseCode {
  OTP_VALID: string;
  PROCEED: string;
  AUTH_ERROR: string;
  OTP_INVALID: string;
  NO_MONEY: string;
  SERVICE_UNAVAILABLE: string;
  STORAGE: string;
  TECH_ERROR: string;
  ERROR_GENERIC: string;
}

export enum PaymentConstants {
  ENTITY_TYPE = 'payment',
  COMPLETED_AUTH = 'COMPLETED_AUTH',
  SCA_TYPE = 'SCA_TYPE',
  OTP = 'SMS_OTP',
  PUSH_NOTIFICATION = 'RSA_TOKEN_SW'
}

export enum PaymentResponseCode {
  OTP_VALID = 'CNCTR_20',
  PROCEED = 'CNCTR_26',
  AUTH_ERROR = 'CNCTR_41',
  OTP_INVALID = 'CNCTR_41_9',
  NO_MONEY = 'BPAG-0521',
  SERVICE_UNAVAILABLE = 'BPAG-0539',
  STORAGE = 'TDP_20_3',
  TECH_ERROR = 'TECH_ERROR',
  ERROR_GENERIC = 'error'
}

export enum ModalConstants {
  MODAL_OTP_ITEM = 'modal_otp',
  MODAL_OTP_NAME = 'OTPModal',
  MODAL_PUSH_NOTIFICATION_ITEM = 'modal_push_notification',
  MODAL_PUSH_NOTIFICATION_NAME = 'PushModal'
}
