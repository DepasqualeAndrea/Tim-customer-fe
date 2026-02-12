export interface TenantUserProperties {
    userType?: string;
    facebookLoginDisabled?: boolean;
    loginDisabled?: boolean;
    redirectToCheckoutAfterAccountActivation?: boolean;
    availableConsentFlagTags?: string[];
}
