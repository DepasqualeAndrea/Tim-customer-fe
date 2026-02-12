export interface BraintreePaymentMethodNonce {
    paymentMethodNonce: {
        success: boolean
        , type: string
        , nonce: string
        , description: string
        , threeDSecureInfo: any
        , binData: any
    }
    success: boolean
}