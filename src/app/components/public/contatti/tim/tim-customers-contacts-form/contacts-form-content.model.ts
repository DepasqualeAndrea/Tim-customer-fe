export type ContactsFormContent = {
  backgroundTopLeft: string
  backgroundBottomRight: string
  title: string
  formNameLabel: string
  formSurnameLabel: string
  formPhoneLabel: string
  formMailLabel: string
  formSellerCodeLabel: string
  buttonLabel: string
  privacyPolicy: string
  disclaimer: string

  breadcrumbHome: string
  breadcrumbContacts: string

  submissionSuccess?: string
  submissionFail?: string
}

export type ContactMailPayload = {
  data: {
    name: string
    surname: string
    phone: string
    email: string
    sellerCode: string
  }
}

export type ContactMailResponse = {
  result: string
}