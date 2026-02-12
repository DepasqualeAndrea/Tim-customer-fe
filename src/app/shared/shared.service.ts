import { Injectable } from '@angular/core';
// import * as shajs from 'sha.js';
import * as aesjs from 'aes-js';

@Injectable()
export class SharedService {

  private key: Array<any>;
  private aesCtr: any;

  constructor() {
    // this.key = aesjs.utils.hex.toBytes(shajs('sha256').update('22fbf4f959c2a1214848f3411b401b01').digest('hex'));
  }

  encryptUser(user: any) {
    user.email = this.letsEncrypt(user.email);
    user.password = this.letsEncrypt(user.password);
  }

  letsEncrypt(val: string) {

    this.aesCtr = new aesjs.ModeOfOperation.ctr(this.key);

    const ciphertext = this.aesCtr.encrypt(aesjs.utils.utf8.toBytes(val)),
          encryptedHex = aesjs.utils.hex.fromBytes(ciphertext);

    // To print or store the binary data, you may convert it to hex
    // const encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);
    return encryptedHex;
  }

}
