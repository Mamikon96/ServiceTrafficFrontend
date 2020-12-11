import { Component, OnInit } from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {ServiceElement} from "../../app.component";
import {Subscription} from "rxjs";
import {ServicesService} from "../../services/services.service";
import {Service} from "../../models/Service";

@Component({
  selector: 'service-table',
  templateUrl: './service-table.component.html',
  styleUrls: ['./service-table.component.css']
})
export class ServiceTableComponent implements OnInit {

    displayedColumns: string[] = ['position', 'name'];
    dataSource: MatTableDataSource<ServiceElement>;
    serviceElements: ServiceElement[];

    private getServicesSub: Subscription;


    constructor(private servicesService: ServicesService) {
    }

    ngOnInit(): void {
        this.dataSource = new MatTableDataSource<ServiceElement>();
        this.serviceElements = [];

        this.getServicesSub = this.servicesService.getServices()
        .subscribe((data: Service[]) => {
            for (let i = 0; i < data.length; i++) {
                this.serviceElements.push({
                    position: i,
                    name: data[i].serviceName
                });
            }
            this.updateTable(this.serviceElements);
        });
    }

    ngOnDestroy(): void {
        this.getServicesSub && this.getServicesSub.unsubscribe();
    }

    updateTable(serviceElements: ServiceElement[]): void {
        this.dataSource.data = serviceElements;
    }

    editElement(): void {}

}
