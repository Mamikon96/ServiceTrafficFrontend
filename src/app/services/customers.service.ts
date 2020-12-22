import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {Client} from "../models/Client";

@Injectable({
  providedIn: 'root'
})
export class CustomersService {

    private customersUrl: string = `${environment.backendApi}${environment.customersEndpoint}`;

    private customersSubject = new BehaviorSubject<Client[]>([]);
    public customersObservable =this.customersSubject.asObservable();

    constructor(private httpClient: HttpClient) {
        this.loadAll();
    }

    public getCustomers(): Observable<any> {
        const headers = new HttpHeaders();
        headers.append('Access-Control-Allow-Headers', 'Content-Type');
        headers.append('Access-Control-Allow-Methods', 'GET');
        headers.append('Access-Control-Allow-Origin', '*');

        return this.httpClient.get(
          environment.backendApi + environment.customersEndpoint,
          {headers: headers}
        );
    }

    public addCustomer(customer: Client): Observable<any> {
        const headers = new HttpHeaders();
        headers.append('Access-Control-Allow-Headers', 'Content-Type');
        headers.append('Access-Control-Allow-Methods', 'GET');
        headers.append('Access-Control-Allow-Origin', '*');

        return this.httpClient.post(this.customersUrl, customer, {headers: headers});
    }

    public updateCustomer(customer: Client): Observable<any> {
        const headers = new HttpHeaders();
        headers.append('Access-Control-Allow-Headers', 'Content-Type');
        headers.append('Access-Control-Allow-Methods', 'GET');
        headers.append('Access-Control-Allow-Origin', '*');

        return this.httpClient.put(this.customersUrl, customer, {headers: headers});
    }

    public deleteCustomer(customerId: number): Observable<any> {
        const headers = new HttpHeaders();
        headers.append('Access-Control-Allow-Headers', 'Content-Type');
        headers.append('Access-Control-Allow-Methods', 'GET');
        headers.append('Access-Control-Allow-Origin', '*');

        return this.httpClient.delete(`${this.customersUrl}/${customerId}`, {headers: headers});
    }

    public loadAll(): void {
        const headers = new HttpHeaders();
        headers.append('Access-Control-Allow-Headers', 'Content-Type');
        headers.append('Access-Control-Allow-Methods', 'GET');
        headers.append('Access-Control-Allow-Origin', '*');

        this.httpClient.get<Client[]>(this.customersUrl, {headers: headers})
        .subscribe((data: Client[]) => {
            this.customersSubject.next(data);
        });
    }
}
