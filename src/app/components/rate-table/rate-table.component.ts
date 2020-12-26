import {AfterViewInit, Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {forkJoin, Observable, Subscription} from "rxjs";
import {RatesService} from "../../services/rates.service";
import {Rate} from "../../models/Rate";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {SelectionModel} from "@angular/cdk/collections";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {RateDialogComponent} from "../../forms/rate-dialog/rate-dialog.component";

@Component({
  selector: 'rate-table',
  templateUrl: './rate-table.component.html',
  styleUrls: ['./rate-table.component.css']
})
export class RateTableComponent implements OnInit, AfterViewInit {

    @Output()
    isLoaded: EventEmitter<boolean> = new EventEmitter<boolean>();

    @ViewChild(MatPaginator)
    paginator: MatPaginator;
    @ViewChild(MatSort)
    sort: MatSort;

    displayedColumns: string[] = ['select', 'position', 'name', 'price', 'expirationDate'];
    dataSource: MatTableDataSource<RateElement>;
    selection = new SelectionModel<RateElement>(true, []);
    rateElements: RateElement[];
    ratesList: Rate[];

    public _isDisabledDelete: boolean = true;
    public _isDisabledEdit: boolean = true;

    private getDataSubscription: Subscription;


    constructor(private ratesService: RatesService,
                private dialog: MatDialog) {
    }

    ngOnInit(): void {
        console.log("init rates");
        this.dataSource = new MatTableDataSource<RateElement>();
        this.rateElements = [];

        this.getDataSubscription = this.ratesService.ratesObservable
        .subscribe((data: Rate[]) => {
            this.ratesList = [...data];
            let tempRates: RateElement[] = [];
            for (let i = 0; i < data.length; i++) {
                tempRates.push({
                    position: i + 1,
                    name: data[i].rateName,
                    price: data[i].price + '$',
                    expirationDate: data[i].expirationDate
                });
            }
            this.rateElements = tempRates;
            this.updateTable(this.rateElements);
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

    toggle(row: RateElement): void {
        this.selection.toggle(row);
        this.updateButtonsStates(this.selection.selected.length);
    }

    checkboxLabel(row?: RateElement): string {
        if (!row) {
            return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
        }
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
    }

    public openDialog(action: string) {
        const dialogConfig = this.initDialogConfig(action);
        const dialogRef = this.dialog.open(RateDialogComponent, dialogConfig);

        dialogRef.afterClosed().subscribe(data => {
            data && this.selection.clear();
        });
    }

    public deleteRates(): void {
        let rateId: number;
        let observables: Observable<any>[] = [];

        for (let i = 0; i < this.selection.selected.length; i++) {
          rateId = this.ratesList[this.selection.selected[i].position - 1].rateId;
            observables.push(this.ratesService.deleteRate(rateId));
        }
        forkJoin(observables).subscribe(() => {
            this.selection.clear();
            this.ratesService.loadAll();
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

    updateTable(rateElements: RateElement[]): void {
        this.dataSource.data = rateElements;
    }

    editElement(): void {}

    private initDialogConfig(action: string): MatDialogConfig {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;

        if (action === "edit") {
            dialogConfig.data = {
                rate: this.ratesList[this.selection.selected[0].position - 1],
                title: "Edit Rate"
            };
        } else {
            dialogConfig.data = {
                title: "New Rate"
            };
        }
        dialogConfig.data = {
            action: action,
            ...dialogConfig.data
        };

        return dialogConfig;
    }

}

export interface RateElement {
    position: number;
    name: string;
    price: string;
    expirationDate: Date
}
