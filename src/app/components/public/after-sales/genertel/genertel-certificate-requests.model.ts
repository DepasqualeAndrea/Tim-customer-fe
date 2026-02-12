export type CertificateFindPayload = {
  taxcode: string
  email: string
  phone: string
  date: string
}

export type CertificateCorrectionPayload = {
  taxcode?: string
  policy_number?: string
  email: string
  phone: string
  date: string
  message: string
}

