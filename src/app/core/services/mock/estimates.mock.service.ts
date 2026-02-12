import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable()
export class EstimatesMockService {

  constructor(private http: HttpClient) { }

  getMockedQuotes() {
    throw new Error("getMockedQuotes")
  }
}
