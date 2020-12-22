import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {Traffic} from "../models/Traffic";
import {TrafficId} from "../models/TrafficId";

@Injectable({
  providedIn: 'root'
})
export class TrafficsService {

    private trafficsUrl: string = `${environment.backendApi}${environment.trafficsEndpoint}`;

    private trafficsSubject = new BehaviorSubject<Traffic[]>([]);
    public trafficsObservable =this.trafficsSubject.asObservable();

    constructor(private httpClient: HttpClient) {
        this.loadAll();
    }

    public getTraffics(): Observable<any> {
        const headers = new HttpHeaders();
        headers.append('Access-Control-Allow-Headers', 'Content-Type');
        headers.append('Access-Control-Allow-Methods', 'GET');
        headers.append('Access-Control-Allow-Origin', '*');

        return this.httpClient.get(
          environment.backendApi + environment.trafficsEndpoint,
          {headers: headers}
    );
    }

    public addTraffic(traffic: Traffic): Observable<any> {
        const headers = new HttpHeaders();
        headers.append('Access-Control-Allow-Headers', 'Content-Type');
        headers.append('Access-Control-Allow-Methods', 'GET');
        headers.append('Access-Control-Allow-Origin', '*');

        return this.httpClient.post(this.trafficsUrl, traffic, {headers: headers});
    }

    public updateTraffic(traffic: Traffic): Observable<any> {
        const headers = new HttpHeaders();
        headers.append('Access-Control-Allow-Headers', 'Content-Type');
        headers.append('Access-Control-Allow-Methods', 'GET');
        headers.append('Access-Control-Allow-Origin', '*');

        return this.httpClient.put(this.trafficsUrl, traffic, {headers: headers});
    }

    public deleteTraffic(trafficId: TrafficId): Observable<any> {
        const headers = new HttpHeaders();
        headers.append('Access-Control-Allow-Headers', 'Content-Type');
        headers.append('Access-Control-Allow-Methods', 'GET');
        headers.append('Access-Control-Allow-Origin', '*');

        return this.httpClient.delete(
            `${this.trafficsUrl}/rate/${trafficId.rateId}/service/${trafficId.serviceId}`,
            {headers: headers}
          );
    }

    public loadAll(): void {
        const headers = new HttpHeaders();
        headers.append('Access-Control-Allow-Headers', 'Content-Type');
        headers.append('Access-Control-Allow-Methods', 'GET');
        headers.append('Access-Control-Allow-Origin', '*');

        this.httpClient.get<Traffic[]>(this.trafficsUrl, {headers: headers})
        .subscribe((data: Traffic[]) => {
            this.trafficsSubject.next(data);
        });
    }
}
