export class CheckoutMockService {
  setUrlQuotator(url: string) {
    sessionStorage.setItem('quotatorRedirectUrl', url);
  }
  
  getUrlQuotator() {
    sessionStorage.getItem('quotatorRedirectUrl');
  }
}