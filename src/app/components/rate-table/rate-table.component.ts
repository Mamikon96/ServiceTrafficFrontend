import { Component, OnInit } from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {Subscription} from "rxjs";
import {RatesService} from "../../services/rates.service";
import {Rate} from "../../models/Rate";

@Component({
  selector: 'rate-table',
  templateUrl: './rate-table.component.html',
  styleUrls: ['./rate-table.component.css']
})
export class RateTableComponent implements OnInit {

    displayedColumns: string[] = ['position', 'name', 'price', 'expirationDate'];
    dataSource: MatTableDataSource<RateElement>;
    rateElements: RateElement[];

    private getDataSubscription: Subscription;


    constructor(private ratesService: RatesService) {
    }

    ngOnInit(): void {
        this.dataSource = new MatTableDataSource<RateElement>();
        this.rateElements = [];

        this.getDataSubscription = this.ratesService.getRates()
        .subscribe((data: Rate[]) => {
            for (let i = 0; i < data.length; i++) {
                this.rateElements.push({
                    position: i,
                    name: data[i].rateName,
                    price: data[i].price,
                    expirationDate: data[i].expirationDate
                });
            }
            this.updateTable(this.rateElements);
        });
    }

    ngOnDestroy(): void {
        this.getDataSubscription && this.getDataSubscription.unsubscribe();
    }

    updateTable(rateElements: RateElement[]): void {
        this.dataSource.data = rateElements;
    }

    editElement(): void {}

}

export interface RateElement {
    position: number;
    name: string;
    price: number;
    expirationDate: Date
}
