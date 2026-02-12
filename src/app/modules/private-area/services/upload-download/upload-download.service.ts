import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { InsurancesService } from 'app/core/services/insurances.service';
import { UploadFileRequest } from './upload-file-request.model';
import { UploadFileResult } from './upload-file-result.model';
import { Policy } from '../../private-area.model';

@Injectable({
  providedIn: 'root'
})
export class UploadDownloadService {
  constructor(
    protected insurancesService: InsurancesService,
  ) { }

  private uploadDownloadStateSubject = new Subject<
    {
      showUpload: boolean
      , showDownload: boolean
      , enabled: boolean
    }
  >();
  uploadDownloadState$ = this.uploadDownloadStateSubject.asObservable();

  public selectedPolicyChanged(policy: Policy) {
    const showUpload = this.uploadIsVisible(policy, null);
    const showDownload = this.downloadIsVisible(policy, null);
    const enabled = this.isEnabled(policy);
    const state = {
      showUpload: showUpload
      , showDownload: showDownload
      , enabled: enabled
      , uploadComponent: showUpload ? this.getUploadComponentInitialState() : undefined
      , downloadComponent: showDownload ? this.getDownloadComponentInitialState(policy) : undefined
    };
    this.uploadDownloadStateSubject.next(state);
  }

  private uploadIsVisible(policy: Policy, result: UploadFileResult): boolean {
    if (!!policy.insuredEntities.insureds_excel) {
      return false;
    }
    if (!policy) {
      return false;
    }
    if (!policy.external_id) {
      return false;
    }
    if (policy.insuredSubjectsUrl) {
      return false;
    }
    if (!policy.insuredSubjectsUrl && !result) {
      return true;
    }
    if (result && result.result === 'ok') {
      return false;
    }
    if (result && result.result === 'ko') {
      return true;
    }
  }

  private downloadIsVisible(policy: Policy, result: UploadFileResult): boolean {
    if (!!policy.insuredEntities.insureds_excel) {
      return true;
    }
    if (policy.insuredSubjectsUrl) {
      return true;
    }
    if (!policy.insuredSubjectsUrl && !result) {
      return false;
    }
    if (result && result.result === 'ok') {
      return true;
    }
    if (result && result.result === 'ko') {
      return false;
    }
  }

  private isEnabled(policy: Policy): boolean {
    if (!policy) {
      return false;
    }
    if (!policy.product) {
      return false;
    }
    return policy.product.product_code === 'pmi-rbm-pandemic';
  }

  private getUploadComponentInitialState() {
    return {
      isUploadDisabled: false
      , loading: false
    };
  }

  getDownloadComponentInitialState(policy) {
    return {
      linkFile: policy.insuredEntities.insureds_excel
    };
  }

  public setSelectedFileForUploading(file: File) {
    const state = {
      showUpload: true
      , showDownload: false
      , enabled: true
      , uploadComponent: {
        isUploadDisabled: false
        , loading: false
        , selectedFile: file
      }
    };
    this.uploadDownloadStateSubject.next(state);
  }

  private getUploadFileRequest(file: File, policy: Policy) {
    const uploadFileRequest: UploadFileRequest = {
      policyNumber: policy.id as number,
      file: file
    };
    return uploadFileRequest;
  }

  uploadFile(file: File, policy: Policy) {
    const loadingState = {
      showUpload: true
      , showDownload: false
      , enabled: true
      , uploadComponent: {
        isUploadDisabled: true
        , loading: true
        , selectedFile: file
      }
    };
    this.uploadDownloadStateSubject.next(loadingState);
    const uploadRequest = this.getUploadFileRequest(file, policy);
    this.insurancesService.uploadFileToPolicy(uploadRequest.policyNumber, uploadRequest.file).subscribe(
      (response) => this.uploadedFile(response)
      , (error) => this.errorUploadedFile(error));
  }

  private uploadedFile(response) {
    const loadingState = {
      showUpload: true
      , showDownload: true
      , enabled: true
      , uploadComponent: {
        isUploadDisabled: true
        , loading: false
        , resultUploadedFile: {
          result: 'ok',
          successMessage: 'file loaded'
        }
      }
      , downloadComponent: {
        linkFile: response.insured_entities.insureds_excel
      }
    };
    this.uploadDownloadStateSubject.next(loadingState);
  }
  errorUploadedFile(error) {
    let errors = error.error;
    if (!Array.isArray(errors)) {
      errors = [{errorValidationCode: error.statusText}];
    }
    const state = {
      showUpload: true
      , showDownload: false
      , enabled: true
      , uploadComponent: {
        isUploadDisabled: false
        , loading: false
        , resultUploadedFile: {
          result: 'ko',
          errors: errors
        }
      }
    };
    this.uploadDownloadStateSubject.next(state);
  }

}
