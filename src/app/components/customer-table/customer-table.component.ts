import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {Subscription} from "rxjs";
import {CustomersService} from "../../services/customers.service";
import {Client} from "../../models/Client";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";

@Component({
  selector: 'customer-table',
  templateUrl: './customer-table.component.html',
  styleUrls: ['./customer-table.component.css']
})
export class CustomerTableComponent implements OnInit, AfterViewInit {

    @ViewChild(MatPaginator)
    paginator: MatPaginator;
    @ViewChild(MatSort)
    sort: MatSort;

    displayedColumns: string[] = [
        'position',
        'clientName',
        'rateName',
        'connectionDate',
        'paymentDate',
        'discount'
    ];
    dataSource: MatTableDataSource<CustomerElement>;
    customerElements: CustomerElement[];

    private getDataSubscription: Subscription;


    constructor(private customersService: CustomersService) {
    }

    ngOnInit(): void {
      console.log("init customers");
      this.dataSource = new MatTableDataSource<CustomerElement>();
        this.customerElements = [];

        this.getDataSubscription = this.customersService.getCustomers()
        .subscribe((data: Client[]) => {
            for (let i = 0; i < data.length; i++) {
                this.customerElements.push({
                    position: i + 1,
                    clientName: data[i].clientName,
                    rateName: data[i].rate.rateName,
                    connectionDate: data[i].connectionDate,
                    paymentDate: data[i].paymentDate,
                    discount: data[i].discount + ' %'
                });
            }
            this.updateTable(this.customerElements);
        });
    }

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    ngOnDestroy(): void {
        this.getDataSubscription && this.getDataSubscription.unsubscribe();
    }

    updateTable(customerElements: CustomerElement[]): void {
        this.dataSource.data = customerElements;
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

export interface CustomerElement {
    position: number;
    clientName: string;
    rateName: string;
    connectionDate: Date;
    paymentDate: Date;
    discount: string;
}
