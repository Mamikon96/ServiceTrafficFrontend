import { Component, OnInit } from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {Subscription} from "rxjs";
import {TrafficsService} from "../../services/traffics.service";
import {Traffic} from "../../models/Traffic";

@Component({
  selector: 'traffic-table',
  templateUrl: './traffic-table.component.html',
  styleUrls: ['./traffic-table.component.css']
})
export class TrafficTableComponent implements OnInit {

    displayedColumns: string[] = ['position', 'rateName', 'serviceName', 'traffic'];
    dataSource: MatTableDataSource<TrafficElement>;
    trafficElements: TrafficElement[];

    private getDataSubscription: Subscription;


    constructor(private trafficsService: TrafficsService) {
    }

    ngOnInit(): void {
        this.dataSource = new MatTableDataSource<TrafficElement>();
        this.trafficElements = [];

        this.getDataSubscription = this.trafficsService.getTraffics()
        .subscribe((data: Traffic[]) => {
            for (let i = 0; i < data.length; i++) {
                this.trafficElements.push({
                    position: i,
                    rateName: data[i].rate.rateName,
                    serviceName: data[i].service.serviceName,
                    traffic: data[i].traffic + ' MB'
                });
            }
            this.updateTable(this.trafficElements);
        });
    }

    ngOnDestroy(): void {
        this.getDataSubscription && this.getDataSubscription.unsubscribe();
    }

    updateTable(trafficElements: TrafficElement[]): void {
        this.dataSource.data = trafficElements;
    }

    editElement(): void {}

}

export interface TrafficElement {
    position: number;
    rateName: string;
    serviceName: string;
    traffic: string;
}
