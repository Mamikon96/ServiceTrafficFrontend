import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {Subscription} from "rxjs";
import {TrafficsService} from "../../services/traffics.service";
import {Traffic} from "../../models/Traffic";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";

@Component({
  selector: 'traffic-table',
  templateUrl: './traffic-table.component.html',
  styleUrls: ['./traffic-table.component.css']
})
export class TrafficTableComponent implements OnInit, AfterViewInit {

    @ViewChild(MatPaginator)
    paginator: MatPaginator;
    @ViewChild(MatSort)
    sort: MatSort;

    displayedColumns: string[] = ['position', 'rateName', 'serviceName', 'traffic'];
    dataSource: MatTableDataSource<TrafficElement>;
    trafficElements: TrafficElement[];

    private getDataSubscription: Subscription;


    constructor(private trafficsService: TrafficsService) {
    }

    ngOnInit(): void {
      console.log("init traffics");
      this.dataSource = new MatTableDataSource<TrafficElement>();
        this.trafficElements = [];

        this.getDataSubscription = this.trafficsService.getTraffics()
        .subscribe((data: Traffic[]) => {
            for (let i = 0; i < data.length; i++) {
                this.trafficElements.push({
                    position: i + 1,
                    rateName: data[i].rate.rateName,
                    serviceName: data[i].service.serviceName,
                    traffic: data[i].traffic + ' MB'
                });
            }
            this.updateTable(this.trafficElements);
        });
    }

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    ngOnDestroy(): void {
        this.getDataSubscription && this.getDataSubscription.unsubscribe();
    }

    updateTable(trafficElements: TrafficElement[]): void {
        this.dataSource.data = trafficElements;
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    editElement(): void {}

}

export interface TrafficElement {
    position: number;
    rateName: string;
    serviceName: string;
    traffic: string;
}
