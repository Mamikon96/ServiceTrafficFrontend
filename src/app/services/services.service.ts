import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { Service } from '../models/Service';
import {environment} from "../../environments/environment";
import {BehaviorSubject, Observable, of} from "rxjs";
import {catchError} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class ServicesService {

    private servicesUrl: string = `${environment.backendApi}${environment.servicesEndpoint}`;

    private servicesSubject = new BehaviorSubject<Service[]>([]);
    public servicesObservable =this.servicesSubject.asObservable();

    constructor(private httpClient: HttpClient) {
        this.loadAll();
    }

    /*public getServices(): Observable<any> {
        const headers = new HttpHeaders();
        headers.append('Access-Control-Allow-Headers', 'Content-Type');
        headers.append('Access-Control-Allow-Methods', 'GET');
        headers.append('Access-Control-Allow-Origin', '*');

        return this.httpClient.get(this.servicesUrl, {headers: headers});
    }*/

    public getServices(): void {
        this.loadAll();
    }

    /*public addService(service: Service): Observable<any> {
        const headers = new HttpHeaders();
        headers.append('Access-Control-Allow-Headers', 'Content-Type');
        headers.append('Access-Control-Allow-Methods', 'GET');
        headers.append('Access-Control-Allow-Origin', '*');

        return this.httpClient.post(
            this.servicesUrl,
            service,
            {
                headers: headers
            }
        );
    }*/

    public addService(service: Service): Observable<any> {
        const headers = new HttpHeaders();
        headers.append('Access-Control-Allow-Headers', 'Content-Type');
        headers.append('Access-Control-Allow-Methods', 'GET');
        headers.append('Access-Control-Allow-Origin', '*');

        return this.httpClient.post(this.servicesUrl, service, {headers: headers});
    }

    public updateService(service: Service): Observable<any> {
        const headers = new HttpHeaders();
        headers.append('Access-Control-Allow-Headers', 'Content-Type');
        headers.append('Access-Control-Allow-Methods', 'GET');
        headers.append('Access-Control-Allow-Origin', '*');

        return this.httpClient.put(this.servicesUrl, service, {headers: headers});
    }

    public deleteService(serviceId: number): Observable<any> {
        const headers = new HttpHeaders();
        headers.append('Access-Control-Allow-Headers', 'Content-Type');
        headers.append('Access-Control-Allow-Methods', 'GET');
        headers.append('Access-Control-Allow-Origin', '*');

        return this.httpClient.delete(`${this.servicesUrl}/${serviceId}`, {headers: headers});
    }

    public loadAll(): void {
        const headers = new HttpHeaders();
        headers.append('Access-Control-Allow-Headers', 'Content-Type');
        headers.append('Access-Control-Allow-Methods', 'GET');
        headers.append('Access-Control-Allow-Origin', '*');

        this.httpClient.get<Service[]>(this.servicesUrl, {headers: headers})
          .subscribe((data: Service[]) => {
              this.servicesSubject.next(data);
          });
    }
}
