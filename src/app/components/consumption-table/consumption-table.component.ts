import {AfterViewInit, Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {forkJoin, Observable, Subscription} from "rxjs";
import {ConsumptionsService} from "../../services/consumptions.service";
import {Consumption} from "../../models/Consumption";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {SelectionModel} from "@angular/cdk/collections";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {ConsumptionDialogComponent} from "../../forms/consumption-dialog/consumption-dialog.component";
import {ConsumptionId} from "../../models/ConsumptionId";

@Component({
  selector: 'consumption-table',
  templateUrl: './consumption-table.component.html',
  styleUrls: ['./consumption-table.component.css']
})
export class ConsumptionTableComponent implements OnInit, AfterViewInit {

    @Output()
    isLoaded: EventEmitter<boolean> = new EventEmitter<boolean>();

    @ViewChild(MatPaginator)
    paginator: MatPaginator;
    @ViewChild(MatSort)
    sort: MatSort;

    displayedColumns: string[] = ['select', 'position', 'clientName', 'serviceName', 'consumptionTraffic'];
    dataSource: MatTableDataSource<ConsumptionElement>;
    selection = new SelectionModel<ConsumptionElement>(true, []);
    consumptionElements: ConsumptionElement[];
    consumptionsList: Consumption[];

    public _isDisabledDelete: boolean = true;
    public _isDisabledEdit: boolean = true;

    private getDataSubscription: Subscription;


    constructor(private consumptionsService: ConsumptionsService,
                private dialog: MatDialog) {
    }

    ngOnInit(): void {
        this.dataSource = new MatTableDataSource<ConsumptionElement>();
        this.consumptionElements = [];

        this.getDataSubscription = this.consumptionsService.consumptionsObservable
        .subscribe((data: Consumption[]) => {
            this.consumptionsList = [...data];
            let tempConsumptions: ConsumptionElement[] = [];
            for (let i = 0; i < data.length; i++) {
                tempConsumptions.push({
                    position: i + 1,
                    clientName: data[i].client.clientName,
                    serviceName: data[i].service.serviceName,
                    consumptionTraffic: data[i].consumptionTraffic + ' MB'
                });
            }
            this.consumptionElements = tempConsumptions;
            this.updateTable(this.consumptionElements);
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

    toggle(row: ConsumptionElement): void {
        this.selection.toggle(row);
        this.updateButtonsStates(this.selection.selected.length);
    }

    checkboxLabel(row?: ConsumptionElement): string {
        if (!row) {
            return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
        }
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
    }

    public openDialog(action: string) {
        const dialogConfig = this.initDialogConfig(action);
        const dialogRef = this.dialog.open(ConsumptionDialogComponent, dialogConfig);

        dialogRef.afterClosed().subscribe(data => {
            data && this.selection.clear();
        });
    }

    public deleteConsumptions(): void {
        let consumptionId: ConsumptionId;
        let observables: Observable<any>[] = [];
        for (let i = 0; i < this.selection.selected.length; i++) {
          consumptionId = this.consumptionsList[this.selection.selected[i].position - 1].consumptionId;
            observables.push(this.consumptionsService.deleteConsumption(consumptionId));
        }
        forkJoin(observables).subscribe(() => {
            this.selection.clear();
            this.consumptionsService.loadAll();
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

    private initDialogConfig(action: string): MatDialogConfig {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;

        if (action === "edit") {
            dialogConfig.data = {
                consumption: this.consumptionsList[this.selection.selected[0].position - 1],
                title: "Edit Consumption"
            };
        } else {
            dialogConfig.data = {
                title: "New Consumption"
            };
        }
        dialogConfig.data = {
            action: action,
            ...dialogConfig.data
        };

        return dialogConfig;
    }
}

export interface ConsumptionElement {
    position: number;
    clientName: string;
    serviceName: string;
    consumptionTraffic: string;
}
