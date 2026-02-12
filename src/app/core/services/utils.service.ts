import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { DocumentFileModel } from '../models/DocumentFile.model';
import { environment } from '../../../environments/environment';
import { getMimeType } from 'app/core/utils/mime-types';
import { saveAs } from 'file-saver';
import { BlobFileDownloadResponse, ParsedDocument } from './utils.model';

@Injectable()
export class UtilsService {

  private readonly userAgentRegex = /iphone|ipod|ipad|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|firefox|Opera Mini/i

  constructor(
    private httpClient: HttpClient,
  ) {
  }

  base64DecodeParams(obj: any) {
    const cp = JSON.parse(JSON.stringify(obj));
    Object.keys(cp).forEach(key => {
      cp[key] = atob(cp[key]);
    });
    return cp;
  }

  base64DecodeValue(_val: string) {
    return atob(_val);
  }

  base64EncodeParams(obj: any) {
    const cp = JSON.parse(JSON.stringify(obj));
    Object.keys(cp).forEach(key => {
      cp[key] = btoa(cp[key]);
    });
    return cp;
  }

  base64EncodeValue(_val: string) {
    return btoa(_val);
  }

  svgUrlToHtml(url: string): Observable<any> {
    return this.httpClient.get(url, { responseType: 'text' });
  }

  public parseDocumentResponse(response: BlobFileDownloadResponse): ParsedDocument {
    const regexRes = /filename="(.*)"/.exec(response.headers.get('content-disposition'));
    const filename = regexRes ? regexRes[1] : 'precontractual.zip';
    const type = getMimeType(filename) || 'application/zip';
    return { data: response.body, name: filename, type: type };
  }

  public saveFile(file: ParsedDocument): void {
    const blobFile = new Blob([file.data], { type: file.type })
    if (this.userAgentTest()) {
      window.open(URL.createObjectURL(blobFile), '_blank');
    }
    else {
      saveAs(blobFile, file.name);
    }
  }

  public userAgentTest(): boolean {
    return this.userAgentRegex.test(navigator.userAgent)
  }

}
