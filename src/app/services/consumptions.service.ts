import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {Consumption} from "../models/Consumption";
import {ConsumptionId} from "../models/ConsumptionId";

@Injectable({
  providedIn: 'root'
})
export class ConsumptionsService {

    private consumptionsUrl: string = `${environment.backendApi}${environment.consumptionsEndpoint}`;

    private consumptionsSubject = new BehaviorSubject<Consumption[]>([]);
    public consumptionsObservable =this.consumptionsSubject.asObservable();

    constructor(private httpClient: HttpClient) {
        this.loadAll();
    }

    public getConsumptions(): Observable<any> {
        const headers = new HttpHeaders();
        headers.append('Access-Control-Allow-Headers', 'Content-Type');
        headers.append('Access-Control-Allow-Methods', 'GET');
        headers.append('Access-Control-Allow-Origin', '*');

        return this.httpClient.get(
            environment.backendApi + environment.consumptionsEndpoint,
            {headers: headers}
        );
    }

    public addConsumption(consumption: Consumption): Observable<any> {
        const headers = new HttpHeaders();
        headers.append('Access-Control-Allow-Headers', 'Content-Type');
        headers.append('Access-Control-Allow-Methods', 'GET');
        headers.append('Access-Control-Allow-Origin', '*');

        return this.httpClient.post(this.consumptionsUrl, consumption, {headers: headers});
    }

    public updateConsumption(consumption: Consumption): Observable<any> {
        const headers = new HttpHeaders();
        headers.append('Access-Control-Allow-Headers', 'Content-Type');
        headers.append('Access-Control-Allow-Methods', 'GET');
        headers.append('Access-Control-Allow-Origin', '*');

        return this.httpClient.put(this.consumptionsUrl, consumption, {headers: headers});
    }

    public deleteConsumption(consumptionId: ConsumptionId): Observable<any> {
        const headers = new HttpHeaders();
        headers.append('Access-Control-Allow-Headers', 'Content-Type');
        headers.append('Access-Control-Allow-Methods', 'GET');
        headers.append('Access-Control-Allow-Origin', '*');

        return this.httpClient.delete(
            `${this.consumptionsUrl}/client/${consumptionId.clientId}/service/${consumptionId.serviceId}`,
            {headers: headers}
          );
    }

    public loadAll(): void {
        const headers = new HttpHeaders();
        headers.append('Access-Control-Allow-Headers', 'Content-Type');
        headers.append('Access-Control-Allow-Methods', 'GET');
        headers.append('Access-Control-Allow-Origin', '*');

        this.httpClient.get<Consumption[]>(this.consumptionsUrl, {headers: headers})
        .subscribe((data: Consumption[]) => {
            this.consumptionsSubject.next(data);
        });
    }
}
