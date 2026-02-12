import { Injectable } from '@angular/core';
import { AuthService, CheckoutService } from '@services';
import { HostedFieldFieldOptions, HostedFields } from 'braintree-web';
import { forkJoin, from, Observable, of } from 'rxjs';
import { first, map, mergeMap } from 'rxjs/operators';
import { Braintree3DSecureParametersFactory } from './braintree-3d-secure-parameters.factory';
import { BraintreeClientService } from './braintree-client.service';


@Injectable({
    providedIn: 'root'
})
export class Braintree3DSecurePaymentService {
    constructor(private checkoutService: CheckoutService
        , private braintreeClientService: BraintreeClientService
        , private authService: AuthService) {
    }
    public updateSubscription(paymentProvider, clientPaymentId, insuranceId): Observable<any> {
        const paymentSourceInfo = {
            payment_method_id: paymentProvider, 
            wallet_payment_source_id: clientPaymentId, 
            insurance_id: insuranceId 
        }
        const providerInfo$ = this.checkoutService.paymentSourceInfoFromInsurance(paymentSourceInfo);
        const braintreeClientProvider$ = this.braintreeClientService.braintreeProvider$.pipe(first(x => x));
        const authorization$ = this.checkoutService.getClientToken(paymentProvider);
        return forkJoin([providerInfo$, braintreeClientProvider$, authorization$]).pipe(
            mergeMap(([providerInfo, braintreeClientProvider, authorization]) => {
                return this.payWithNonce(providerInfo, braintreeClientProvider, authorization, paymentSourceInfo)
            })
            , map((result) => {
                return result
            })
        );
    }
    private hf;
    private threeDS;

    public pay(paymentSourceInfo: { payment_method_id: number, wallet_payment_source_id: number, order_number: string }): Observable<any> {
        const paymentSource$ = this.checkoutService.paymentSourceInfo(paymentSourceInfo);
        const braintreeClientProvider$ = this.braintreeClientService.braintreeProvider$.pipe(first(x => x));
        const authorization$ = this.checkoutService.getClientToken(paymentSourceInfo.payment_method_id);
        return forkJoin([paymentSource$, braintreeClientProvider$, authorization$]).pipe(
            mergeMap(([paymentSource, braintreeClientProvider, authorization]) => {
                return this.payWithNonce(paymentSource, braintreeClientProvider, authorization, paymentSourceInfo)
            })
        );
    }
    private getThreeDSecureParameters(providerInfo, amount) {
        const nonce = providerInfo.paymentMethodNonce.nonce
        const bin = providerInfo.paymentMethodNonce.binData
        const parametersFactory = new Braintree3DSecureParametersFactory(this.authService)
        const parameters = parametersFactory.resolveThreeDSecureBasicParametersObject(nonce, bin, amount)
        return parameters;
    }
    private payWithNonce(paymentSourceInfoResponse: { total: number, email: string, billing_address?: any, nonce: string, bin: string }
        , braintreeClientProvider
        , authorization
        , paymentSourceInfo: { payment_method_id: number, wallet_payment_source_id: number }): Observable<any> {
        let clientInstance = null;
        let deviceData = null;
        const promise = braintreeClientProvider.client.create(
            {
                authorization: authorization
            }
        ).then((clientInstanceResult) => {
            clientInstance = clientInstanceResult;
            return braintreeClientProvider.dataCollector.create({
                client: clientInstance,
                paypal: true
            });
        }).then((dataCollectorInstance) => {
            deviceData = dataCollectorInstance.deviceData;
            return new Promise((resolve, reject) => {
                resolve(clientInstance)
            })
        }).then((clientInstanceResult) => {
            return braintreeClientProvider.threeDSecure.create({
                version: 2, // Will use 3DS 2 whenever possible
                client: clientInstanceResult
            });
        }).then((threeDSecureInstance) => {
            const threeDsecureObject = Braintree3DSecureParametersFactory.resolveThreeDSecureObjectFromPaymentSource(paymentSourceInfoResponse)
            return threeDSecureInstance.verifyCard(threeDsecureObject)
        }).then((response) => {
            return new Promise((resolve, reject) => {
                const resultWithNoChallenge = this.checkPaymentSuccess(response, paymentSourceInfo.payment_method_id, paymentSourceInfo.wallet_payment_source_id, deviceData)
                if (resultWithNoChallenge) {
                    resolve(resultWithNoChallenge)
                } else {
                    const error = this.getInvalidStatusError(response)
                    reject(error)
                }
            })
        });
        return from(promise);
    }
    public checkPaymentSuccess(response, payment_method_id, wallet_payment_source_id, device_data) {
        const deniedStatuses = [
            'authenticate_rejected',
            'authenticate_failed',
            'challenge_required'
        ]
        const isStatusInvalid = deniedStatuses.some(status => status === response.threeDSecureInfo.status)

        if (isStatusInvalid) {
            return null;
        }
        const payment_method_nonce = response.nonce;
        const threeDSecureAuthenticationId = response.threeDSecureInfo.threeDSecureAuthenticationId;
        const status = response.threeDSecureInfo.status;
        const liabilityShifted = response.threeDSecureInfo.liabilityShifted;
        const result = {
            success: true,
            payments_attributes: [
                {
                    payment_method_id: payment_method_id
                    , source_attributes: { nonce:payment_method_nonce, payment_type: "CreditCard" }
                    , device_data: device_data
                    , three_d_secure_authentication_id: threeDSecureAuthenticationId
                    , status: status
                    , liability_shifted: liabilityShifted
                }
            ]
        }
        return result;
    }

    public createForm(paymentProvider: number, hostedFields: HostedFieldFieldOptions): Observable<HostedFields> {
        this.hf = null
        this.threeDS = null
        const braintreeClientProvider$ = this.braintreeClientService.braintreeProvider$.pipe(first(x => x));
        const authorization$ = this.checkoutService.getClientToken(paymentProvider);
        return forkJoin([braintreeClientProvider$, authorization$]).pipe(
            mergeMap(([braintreeClientProvider, authorization]) => {
                return this.getHostedFieldInstanceFromBraintree(braintreeClientProvider, authorization, hostedFields)
            })
        );
    }

    private getHostedFieldInstanceFromBraintree(braintreeClientProvider, authorization: string, hostedFields: HostedFieldFieldOptions): Observable<HostedFields> {
        const promise = Promise.all([
            (braintreeClientProvider.hostedFields as HostedFields).create({
                authorization: authorization,
                fields: hostedFields
            }),
            braintreeClientProvider.threeDSecure.create({
                authorization: authorization,
                version: 2
            })
        ]).then((instances) => {
            this.hf = instances[0];
            this.threeDS = instances[1];
            return new Promise((resolve, reject) => {
                resolve(this.hf)
            })
        }).catch(function (err) {
            console.log('component error:', err);
        });
        return from(promise as Promise<HostedFields>);
    }

    public verifyCardWhenIsAddedToWallet = true;
    public createCreditCardPayload(amount?): Observable<any> {
        if (this.verifyCardWhenIsAddedToWallet) {
            const promise = this.hf.tokenize()
                .then((payload) => {
                    return this.threeDS.verifyCard(
                        this.getThreeDSecureParametersFromTokenize(payload, amount)
                    )
                })
                .then((tokenizedPayload) => {
                    return new Promise((resolve, reject) => {
                        const resultWithNoChallenge = this.checkValidAuthenticationStatus(tokenizedPayload)
                        if (resultWithNoChallenge) {
                            resolve(resultWithNoChallenge)
                        }
                        else {
                            reject(this.getInvalidStatusError(tokenizedPayload))
                        }
                    })
                })
            return from(promise)
        }
        const promise = this.hf.tokenize()
            .then((payload) => {
                return new Promise((resolve, reject) => {
                    resolve(payload)
                })
            })
        return from(promise)
    }

    private getThreeDSecureParametersFromTokenize(tokenizePayload, amount) {
        const nonce = tokenizePayload.nonce
        const bin = tokenizePayload.details.bin
        const parametersFactory = new Braintree3DSecureParametersFactory(this.authService)
        const parameters = parametersFactory.resolveThreeDSecureBasicParametersObject(nonce, bin, amount)
        return parameters;
    }
    private checkVerifyCardWithNoChallenge(tokenizedPayload) {
        if (!tokenizedPayload
            || !tokenizedPayload.threeDSecureInfo
            || !tokenizedPayload.threeDSecureInfo.liabilityShiftPossible
            || tokenizedPayload.threeDSecureInfo.status != "authenticate_successful") {
            return null;
        }
        return tokenizedPayload;
    }
    public getInvalidStatusError(tokenizedPayload) {
        if (!tokenizedPayload ||
            Object.keys(tokenizedPayload).length === 0) {
            return { message: 'Unknown error' }
        }
        if (!tokenizedPayload.threeDSecureInfo) {
            return { message: 'Cannot find 3DSecure info' }
        }
        if (!tokenizedPayload.threeDSecureInfo.status) {
            return { message: 'Cannot fetch error status' }
        }
        const errorMessages = {
            authenticate_failed: { message: 'Authentication failed' },
            lookup_bypassed: { message: 'Lookup bypassed' },
            authenticate_unable_to_authenticate: { message: 'Unable to authenticate' },
            authenticate_rejected: { message: 'Authentication rejected' },
            authentication_unavailable: { message: 'Authentication unavailable' },
            lookup_error: { message: 'Lookup error' },
            challenge_required: { message: 'Challenge required' },
        }
        return errorMessages[tokenizedPayload.threeDSecureInfo.status]
    }

    public checkValidAuthenticationStatus(tokenizedPayload) {
        const acceptedStatuses = [
            'authenticate_successful',
            'authenticate_attempt_successful'
        ]
        if (tokenizedPayload &&
            tokenizedPayload.threeDSecureInfo &&
            tokenizedPayload.threeDSecureInfo.liabilityShiftPossible) {
            const isPayloadStatusValid = acceptedStatuses.some(status => status === tokenizedPayload.threeDSecureInfo.status)
            if (isPayloadStatusValid) {
                return tokenizedPayload
            }
        }
        return null;
    }

}

