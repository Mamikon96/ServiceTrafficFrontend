import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {Rate} from "../models/Rate";

@Injectable({
  providedIn: 'root'
})
export class RatesService {

    private ratesUrl: string = `${environment.backendApi}${environment.ratesEndpoint}`;

    private ratesSubject = new BehaviorSubject<Rate[]>([]);
    public ratesObservable =this.ratesSubject.asObservable();

    constructor(private httpClient: HttpClient) {
        this.loadAll();
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

    public addRate(rate: Rate): Observable<any> {
        const headers = new HttpHeaders();
        headers.append('Access-Control-Allow-Headers', 'Content-Type');
        headers.append('Access-Control-Allow-Methods', 'GET');
        headers.append('Access-Control-Allow-Origin', '*');

        return this.httpClient.post(this.ratesUrl, rate, {headers: headers});
    }

    public updateRate(rate: Rate): Observable<any> {
        const headers = new HttpHeaders();
        headers.append('Access-Control-Allow-Headers', 'Content-Type');
        headers.append('Access-Control-Allow-Methods', 'GET');
        headers.append('Access-Control-Allow-Origin', '*');

        return this.httpClient.put(this.ratesUrl, rate, {headers: headers});
    }

    public deleteRate(rateId: number): Observable<any> {
        const headers = new HttpHeaders();
        headers.append('Access-Control-Allow-Headers', 'Content-Type');
        headers.append('Access-Control-Allow-Methods', 'GET');
        headers.append('Access-Control-Allow-Origin', '*');

        return this.httpClient.delete(`${this.ratesUrl}/${rateId}`, {headers: headers});
    }

    public loadAll(): void {
        const headers = new HttpHeaders();
        headers.append('Access-Control-Allow-Headers', 'Content-Type');
        headers.append('Access-Control-Allow-Methods', 'GET');
        headers.append('Access-Control-Allow-Origin', '*');

        this.httpClient.get<Rate[]>(this.ratesUrl, {headers: headers})
        .subscribe((data: Rate[]) => {
            this.ratesSubject.next(data);
        });
    }
}
