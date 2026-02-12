import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { HttpClient } from '@angular/common/http';
import { StatusRequest, StatusResponse } from './change-status.interface';
import moment from 'moment';
import { ResponseOrder } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class ChangeStatusService {

  private _statusRequest: StatusRequest;
  private _statusResponse: StatusResponse;
  private _responseOrder: ResponseOrder;
  product: any;
  contoSelected: any;

  constructor(
    protected http: HttpClient,
    protected dataService: DataService
  ) {
    this.product = this.dataService.getResponseProduct();
  }

  public setStatusRequest(statusRequest: StatusRequest): void {
    this._statusRequest = statusRequest;
  }

  public getStatusRequest(): StatusRequest {
    return this._statusRequest;
  }

  public setStatusResponse(statusResponse: StatusResponse): void {
    this._statusResponse = statusResponse;
  }

  public getStatusResponse(): StatusResponse {
    return this._statusResponse;
  }

  public setResponseOrder(responseOrder: ResponseOrder): void {
    this._responseOrder = responseOrder;
  }

  public setConto(selectedConto): void {
    this.contoSelected = selectedConto;
  }

  buildChangeStatusPayload(): void {
    const payload: StatusRequest = Object.assign({
      entity_type: 'change_status',
      status: 'PREVENTIVO',
      idOperation: null,
      insuranceFactor: {
        amount: String(this._responseOrder.total),
        dExpiration: null,
        dOperation: moment().toISOString(),
        dEffect: null,
        duration: null,
        nrPolicy: null,
        product: this.product.id,
        questionnaire: null,
        sogInsured: null
      },
      pdf: null
    });
    this.changeStatus(payload);
  }


  changeStatusToProposal() {
    const payload = Object.assign({
      entity_type: 'change_status',
      status: 'PROPOSTA',
      idOperation: this._statusResponse.idOperation,
      insuranceFactor: {
        amount: String(this._responseOrder.total),
        dExpiration: this._responseOrder.line_items[0].expiration_date,
        dOperation: moment().toISOString(),
        dEffect: this._responseOrder.line_items[0].start_date,
        duration: this._responseOrder.line_items[0].quantity,
        nrPolicy: this._responseOrder.number,
        product: this.product.id,
        contoSelected: null,
        questionnaire: [
          {
            code: 'PF_comp_nucleo',
            description: 'Quante persone compongono il suo nucleo familiare?',
            answer: '1',
            type: 'DROPBOX',
            valoriDrop: [
              {
                code: 'PF_comp_nucleo',
                description: 'test'
              }
            ]
          },
          {
            code: 'PF_an2data_nascita',
            description: 'Data di nascita:',
            answer: '09/05/1969',
            type: 'TEXT',
            valoriDrop: [
              {
                code: 'PF_an2data_nascita',
                description: 'test'
              }
            ]
          }
        ],
        sogInsured: [
          {
            name: this._responseOrder.bill_address.firstname,
            surname: this._responseOrder.bill_address.lastname,
            cf: this._responseOrder.bill_address.taxcode,
            dBirth: moment(this._responseOrder.bill_address.birth_date).toISOString()
          }
        ]
      },
      pdf: null
    });
    this.changeStatus(payload);
  }

  changeStatus(payload: StatusRequest): void {
    throw new Error("changeStatus")
  }

}
