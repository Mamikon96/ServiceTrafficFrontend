import {AfterViewInit, Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {forkJoin, Observable, Subscription} from "rxjs";
import {CustomersService} from "../../services/customers.service";
import {Client} from "../../models/Client";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {SelectionModel} from "@angular/cdk/collections";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {CustomerDialogComponent} from "../../forms/customer-dialog/customer-dialog.component";

@Component({
  selector: 'customer-table',
  templateUrl: './customer-table.component.html',
  styleUrls: ['./customer-table.component.css']
})
export class CustomerTableComponent implements OnInit, AfterViewInit {

    @Output()
    isLoaded: EventEmitter<boolean> = new EventEmitter<boolean>();

    @ViewChild(MatPaginator)
    paginator: MatPaginator;
    @ViewChild(MatSort)
    sort: MatSort;

    displayedColumns: string[] = [
        'select',
        'position',
        'clientName',
        'rateName',
        'connectionDate',
        'paymentDate',
        'discount'
    ];
    dataSource: MatTableDataSource<CustomerElement>;
    selection = new SelectionModel<CustomerElement>(true, []);
    customerElements: CustomerElement[];
    customersList: Client[];

    public _isDisabledDelete: boolean = true;
    public _isDisabledEdit: boolean = true;

    private getDataSubscription: Subscription;


    constructor(private customersService: CustomersService,
                private dialog: MatDialog) {
    }

    ngOnInit(): void {
        this.dataSource = new MatTableDataSource<CustomerElement>();
        this.customerElements = [];

        this.getDataSubscription = this.customersService.customersObservable
        .subscribe((data: Client[]) => {
            this.customersList = [...data];
            let tempCustomers: CustomerElement[] = [];
            for (let i = 0; i < data.length; i++) {
                tempCustomers.push({
                    position: i + 1,
                    clientName: data[i].clientName,
                    rateName: data[i].rate.rateName,
                    connectionDate: data[i].connectionDate,
                    paymentDate: data[i].paymentDate,
                    discount: data[i].discount + ' %'
                });
            }
            this.customerElements = tempCustomers;
            this.updateTable(this.customerElements);
            this.isLoaded.emit(true);
        });
    }

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    ngOnDestroy(): void {
        this.getDataSubscription && this.getDataSubscription.unsubscribe();
    }

    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.data.length;
        return numSelected === numRows;
    }

    masterToggle(): void {
        this.isAllSelected() ?
            this.selection.clear() :
            this.dataSource.data.forEach(row => this.selection.select(row));
        this.updateButtonsStates(this.selection.selected.length);
    }

    toggle(row: CustomerElement): void {
        this.selection.toggle(row);
        this.updateButtonsStates(this.selection.selected.length);
    }

    checkboxLabel(row?: CustomerElement): string {
        if (!row) {
            return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
        }
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
    }

    public openDialog(action: string) {
        const dialogConfig = this.initDialogConfig(action);
        const dialogRef = this.dialog.open(CustomerDialogComponent, dialogConfig);

        dialogRef.afterClosed().subscribe(data => {
            data && this.selection.clear();
        });
    }

    public deleteCustomers(): void {
        let customerId: number;
        let observables: Observable<any>[] = [];
        for (let i = 0; i < this.selection.selected.length; i++) {
          customerId = this.customersList[this.selection.selected[i].position - 1].clientId;
            observables.push(this.customersService.deleteCustomer(customerId));
        }
        forkJoin(observables).subscribe(() => {
            this.selection.clear();
            this.customersService.loadAll();
        })
    }

    public updateButtonsStates(event: number): void {
        if (event == 0) {
            this._isDisabledEdit = true;
            this._isDisabledDelete = true;
        } else if (event > 1) {
            this._isDisabledEdit = true;
            this._isDisabledDelete = false;
        } else {
            this._isDisabledEdit = false;
            this._isDisabledDelete = false;
        }
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

    private initDialogConfig(action: string): MatDialogConfig {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;

        if (action === "edit") {
            dialogConfig.data = {
                customer: this.customersList[this.selection.selected[0].position - 1],
                title: "Edit Customer"
            };
        } else {
            dialogConfig.data = {
                title: "New Customer"
            };
        }
        dialogConfig.data = {
            action: action,
            ...dialogConfig.data
        };

        return dialogConfig;
    }
}

export interface CustomerElement {
    position: number;
    clientName: string;
    rateName: string;
    connectionDate: Date;
    paymentDate: Date;
    discount: string;
}
