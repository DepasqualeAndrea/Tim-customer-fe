import { Injectable } from '@angular/core';

@Injectable()
export class JwtHelperService {

  constructor() { }

  private b64decode(str) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    let output = '';
    str = String(str).replace(/=+$/, '');
    if (str.length % 4 === 1) {
        throw new Error('\'atob\' failed: The string to be decoded is not correctly encoded.');
    }
    for (
    // initialize result and counters
    let bc = 0, bs = void 0, buffer = void 0, idx = 0;
    // get next character
    (buffer = str.charAt(idx++));
    // character found in table? initialize bit storage and add its ascii value;
    /* tslint:disable */
    ~buffer &&
        ((bs = bc % 4 ? bs * 64 + buffer : buffer),
            // and if not first of each 4 characters,
            // convert the first 8 bits to one ascii character
            bc++ % 4)
        ? (output += String.fromCharCode(255 & (bs >> ((-2 * bc) & 6))))
        : 0) {
        // try to find character in table (0-63, not found => -1)
        buffer = chars.indexOf(buffer);
    }
    /* tslint:enable */
    return output;
  }

  private b64DecodeUnicode(str) {
    return decodeURIComponent(Array.prototype.map
        .call(this.b64decode(str), function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
  }

  private urlBase64Decode(str) {
    let output = str.replace(/-/g, '+').replace(/_/g, '/');
    switch (output.length % 4) {
        case 0: {
            break;
        }
        case 2: {
            output += '==';
            break;
        }
        case 3: {
            output += '=';
            break;
        }
        default: {
            throw new Error('Illegal base64url string!');
        }
    }
    return this.b64DecodeUnicode(output);

  }

  public decodeToken(token) {
    const _tkn = (token) ? token : localStorage.getItem(token);
    if (!_tkn) {
      throw new Error('no token deifned');
    }
    const parts = token.split('.');
    if (parts.length !== 3) {
        throw new Error('The inspected token does not appear to be a JWT. Check to make sure it has three parts');
    }
    const decoded = this.urlBase64Decode(parts[1]);
    if (!decoded) {
        throw new Error('Cannot decode the token.');
    }
    return JSON.parse(decoded);
  }

  public getTokenKey(tokenName: string, key: string) {
    const lsTkn = localStorage.getItem(tokenName);
    if (!lsTkn) {
      throw new Error(tokenName + ' not available');
    }
    const _tkn = this.decodeToken(lsTkn);
    return (_tkn) ? _tkn[key] : undefined;

  }

}
