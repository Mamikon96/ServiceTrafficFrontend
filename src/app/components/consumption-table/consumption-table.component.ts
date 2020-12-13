import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {Subscription} from "rxjs";
import {ConsumptionsService} from "../../services/consumptions.service";
import {Consumption} from "../../models/Consumption";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";

@Component({
  selector: 'consumption-table',
  templateUrl: './consumption-table.component.html',
  styleUrls: ['./consumption-table.component.css']
})
export class ConsumptionTableComponent implements OnInit, AfterViewInit {

    @ViewChild(MatPaginator)
    paginator: MatPaginator;
    @ViewChild(MatSort)
    sort: MatSort;

    displayedColumns: string[] = ['position', 'clientName', 'serviceName', 'consumptionTraffic'];
    dataSource: MatTableDataSource<ConsumptionElement>;
    trafficElements: ConsumptionElement[];

    private getDataSubscription: Subscription;


    constructor(private consumptionsService: ConsumptionsService) {
    }

    ngOnInit(): void {
        console.log("init consumptions");
        this.dataSource = new MatTableDataSource<ConsumptionElement>();
        this.trafficElements = [];

        this.getDataSubscription = this.consumptionsService.getConsumptions()
        .subscribe((data: Consumption[]) => {
            for (let i = 0; i < data.length; i++) {
                this.trafficElements.push({
                    position: i + 1,
                    clientName: data[i].client.clientName,
                    serviceName: data[i].service.serviceName,
                    consumptionTraffic: data[i].consumptionTraffic + ' MB'
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

    updateTable(consumptionElements: ConsumptionElement[]): void {
        this.dataSource.data = consumptionElements;
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

export interface ConsumptionElement {
    position: number;
    clientName: string;
    serviceName: string;
    consumptionTraffic: string;
}
