import {Component, OnDestroy, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {ServicesService} from "./services/services.service";
import {Service} from "./models/Service";
import {Subscription} from "rxjs";
import {MatTableDataSource} from "@angular/material/table";

export interface ServiceElement {
    position: number;
    name: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

    public rowCount: number = 0;
    private services: Service[];

    displayedColumns: string[] = ['position', 'name'];
    dataSource: MatTableDataSource<ServiceElement>;
    serviceElements: ServiceElement[];

    private getServicesSub: Subscription;


    constructor(private servicesService: ServicesService) {
    }

    ngOnInit(): void {
        this.dataSource = new MatTableDataSource<ServiceElement>();
        this.serviceElements = [];

        /*this.getServicesSub = this.servicesService.getServices()
        .subscribe((data: Service[]) => {
            this.rowCount = data.length;
            this.services = data;

            for (let i = 0; i < data.length; i++) {
                this.serviceElements.push({
                    position: i,
                    name: data[i].serviceName
                });
            }

            this.updateTable(this.serviceElements);
        });*/
    }

    ngOnDestroy(): void {
        this.getServicesSub && this.getServicesSub.unsubscribe();
    }


    updateTable(serviceElements: ServiceElement[]): void {
        this.dataSource.data = serviceElements;
    }

    editElement(): void {}
}
