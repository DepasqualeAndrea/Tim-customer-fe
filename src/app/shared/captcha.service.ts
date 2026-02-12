import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment.prod';


@Injectable()
export class CaptchaService {
    constructor(private http: HttpClient) {

    }
    checkCaptcha(token: string): Observable<CaptchaResult> {
        throw new Error("checkCaptcha")
    }


}
class YoloCaptchaResult {
    data: CaptchaResult;
}
export class CaptchaResult {
    success: boolean;
    expired: boolean = false;
}