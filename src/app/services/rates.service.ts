import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class RatesService {

    private ratesUrl: string = "/rates";

    constructor(private httpClient: HttpClient) {
    }

    public getRates(): Observable<any> {
        const headers = new HttpHeaders();
        headers.append('Access-Control-Allow-Headers', 'Content-Type');
        headers.append('Access-Control-Allow-Methods', 'GET');
        headers.append('Access-Control-Allow-Origin', '*');

        return this.httpClient.get(
            environment.backendApi + this.ratesUrl,
            {headers: headers}
        );
    }
}
