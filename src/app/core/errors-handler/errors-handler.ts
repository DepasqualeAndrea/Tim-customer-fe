import {ErrorHandler, Inject, Injectable, Injector} from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import {ToastrService} from 'ngx-toastr';
import {tap} from 'rxjs/operators';
import {Observable, of, zip} from 'rxjs';
import {CustomError} from '../../shared/errors/custom-error.model';
import {ErrorStrategy} from './error-strategy.interface';
import {KenticoTranslateService} from '../../modules/kentico/data-layer/kentico-translate.service';

@Injectable({providedIn: 'root'})
export class ErrorsHandler extends ErrorHandler {
  errorMessages: { [key: string]: string };
  entityNames: { [key: string]: string };
  errorKeys = [
    'toasts.cannot_open_claim',
    'toasts.password_validation',
    'toasts.value_not_valid',
    'toasts.must_insert_date',
    'toasts.must_compile',
    'toasts.cannot_find_payment',
    'toasts.dates_overlap',
    'toasts.not_authorized',
    'toasts.credentials_not_valid',
    'toasts.travel_max_duration',
    'toasts.user_not_registered',
    'toasts.error_loading',
    'toasts.no_error_message',
    'toasts.invalid_cap',
    'toasts.max_age_65',
  ];
  entityKeys = [
    'toasts.insurance_holder',
    'toasts.bill_address'
  ];
  private customStrategies: Map<string, ErrorStrategy<any>> = new Map<string, ErrorStrategy<any>>();

  constructor(@Inject(Injector) private injector: Injector,
              private kenticoTranslateService: KenticoTranslateService) {
    super();
  }

  private _toastrService: ToastrService;
  private readonly genertelQuoteError: RegExp = /genertel_quote/

  private get toastrService(): ToastrService {
    if (!this._toastrService) {
      this._toastrService = this.injector.get(ToastrService);
    }
    return this._toastrService;
  }

  addCustomStrategy(errorType: string, strategy: ErrorStrategy<any>) {
    this.customStrategies.set(errorType, strategy);
  }

  initializeTranslations(): Observable<any> {
    if (this.errorMessages) {
      return of({});
    }
    this.errorMessages = {};
    if (this.entityNames) {
      return of({});
    }
    this.entityNames = {};
    const errorMessagesTranslations = this.errorKeys.map(key =>
      this.kenticoTranslateService.getItem(key).pipe(tap((message: any) => {
        this.errorMessages[key] = message.value;
      }))
    );
    const errorEntitiesTranslations = this.entityKeys.map(key =>
      this.kenticoTranslateService.getItem(key).pipe(tap((entity: any) => {
        this.entityNames[key] = entity.value;
      }))
    );

    return zip(...errorMessagesTranslations, ...errorEntitiesTranslations);
  }

  handleError(error: Error | HttpErrorResponse) {
    if (this.isCustom(error)) {
      this.handleCustom((error as CustomError));
    } else {
      this.initializeTranslations().subscribe(() => {
        this.displayError(error);
      });
    }
  }

  private isCustom(error: Error) {
    return error['custom'] || false;
  }

  private handleCustom(error: CustomError) {
    const strategy: ErrorStrategy<any> = this.customStrategies.get(error.type);
    if (!!strategy) {
      strategy.handle(error);
    }
  }

  private displayError(error: any) {
    if (error instanceof HttpErrorResponse) {
      // Server error happened
      // if (error.status === 401 && error.statusText === 'Unauthorized') {
      //   this.auth.setLoggedInCurrentUser(false);
      //   this.auth.logout(true);
      // } else
      if (error.error.message) {
        if (error.error.message.indexOf('The user ID') > -1) {
          this.toastrService.error(this.errorMessages['toasts.user_not_registered'], '', {onActivateTick: true});
        } else {
          this.toastrService.error(this.parseErrorMessage(error.error.message), '', {onActivateTick: true});
        }
      } else if (this.isErrorGenertelQuote(error.error.provider_error)) {
        return
      } else if (error.error.errors === undefined && error.error.error) {
        this.toastrService.error(this.parseErrorMessage(error.error.provider_error || error.error.error), '', {onActivateTick: true});
      } else if (error.error.errors === undefined) {
        console.log(error)
        this.toastrService.error(this.errorMessages['toasts.error_loading'], '', {onActivateTick: true});
      }

      if (!navigator.onLine) {
        // No Internet connection
        for (const key in error.error.errors) {
          if (key) {
            this.iterateOnKey(error.error.errors[key], '');
          } else {
            this.toastrService.error(this.errorMessages['toasts.no_error_message'], '', {onActivateTick: true});
          }
        }
        return;
      }
      // Http Error
      for (const key in error.error.errors) {
        if (key) {
          if (key.includes('line_items[0].insurance_holders[')) {
            const str = key.split('.');
            const insuranceHolderIndex = +(str[1].substring(str[1].indexOf('[') + 1, str[1].lastIndexOf(']')));

            this.toastrService.error(
              this.parseErrorMessage(error.error.errors[key]),
              key.includes('base')
                ? ''
                : this.entityNames['toasts.insurance_holder'] + (insuranceHolderIndex + 1),
              {onActivateTick: true}
            );

          } else if (key === 'bill_address.zipcode') {
            this.toastrService.error(this.errorMessages['toasts.invalid_cap'], '', {onActivateTick: true});

          } else if (key === 'birth_date') {
            const isThisMaxAge65Error = error.error.errors[key][0].startsWith('deve essere successiva o uguale a');
            const thisYear = new Date().getFullYear();
            const errorYear = error.error.errors[key][0].split(" ").pop().split('/').pop();
            if ((thisYear - errorYear === 65) && isThisMaxAge65Error) {
              this.toastrService.error(this.errorMessages['toasts.max_age_65'], '', {onActivateTick: true});
            }

          } else if (key.indexOf('ship') < 0) {
            const check = this.checkMessage(error.error.errors[key]);
            if (check) {
              this.iterateOnKey(error.error.errors[key], '');
            }
          }
        } else {
          this.toastrService.error(this.errorMessages['toasts.no_error_message'], '', {onActivateTick: true});

        }
      }
    } else {
      // Client Error Happend
      // this.toastrService.error(`${error.message}`, 'Client Errore', { onActivateTick: true });
      console.error(error);
    }
    return;
  }

  private checkMessage(_errorKey) {
    let check = false;
    _errorKey.forEach(key => {
      if (key !== 'è già stato confermato' && key !== 'translation missing: it.errors.messages.not_italian_country' && key !== []) {
        check = true;
      }
    });
    return check;
  }

  private provideTitle(entityKey: string, entityNumber?: number): string {
    return entityKey === '' ? entityKey : this.entityNames[entityKey] + entityNumber;
  }

  private iterateOnKey(errorKeys, entityKey: string) {
    let count = 0;
    for (const key of errorKeys) {
      count++;
      this.toastrService.error(this.parseErrorMessage(key), this.provideTitle(entityKey, count), {onActivateTick: true});
    }
  }


  private parseErrorMessage(message: string): string {
    switch (message) {
      case 'Impossibile aprire una denuncia per il prodotto specificato':
        return this.errorMessages['toasts.cannot_open_claim'];
      case 'Deve avere almeno 8 caratteri alfanumerici, Deve contenere almeno una lettera maiuscola, Deve contenere almeno una lettera minuscola, Deve contenere almeno un carattere numerico':
        return this.errorMessages['toasts.password_validation'];
      case 'non è valido':
        return this.errorMessages['toasts.value_not_valid'];
      case 'non può essere lasciato in bianco,inserire una data':
        return this.errorMessages['toasts.must_insert_date'];
      case 'non può essere lasciato in bianco':
        return this.errorMessages['toasts.must_compile'];
      case 'Risorsa non trovata':
        return this.errorMessages['toasts.cannot_find_payment'];
      case 'le date di inizio/fine si sovrappongono ad un altro ordine già presente':
        return this.errorMessages['toasts.dates_overlap'];
      case 'Non autorizzato':
        return this.errorMessages['toasts.not_authorized'];
      case 'Credenziali non valide':
        return this.errorMessages['toasts.credentials_not_valid'];
      case 'La data di ritorno deve essere al massimo 30 giorni successiva alla data di partenza':
        return this.errorMessages['toasts.travel_max_duration'];
    }
    return message;
  }

  private isErrorGenertelQuote(message: string): boolean {
    return this.genertelQuoteError.test(message)
  }

}
