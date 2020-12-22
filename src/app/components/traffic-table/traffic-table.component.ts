import {AfterViewInit, Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {forkJoin, Observable, Subscription} from "rxjs";
import {TrafficsService} from "../../services/traffics.service";
import {Traffic} from "../../models/Traffic";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {SelectionModel} from "@angular/cdk/collections";
import {ServiceElement} from "../../app.component";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {ServiceDialogComponent} from "../../forms/service-dialog/service-dialog.component";
import {TrafficId} from "../../models/TrafficId";
import {TrafficDialogComponent} from "../../forms/traffic-dialog/traffic-dialog.component";

@Component({
  selector: 'traffic-table',
  templateUrl: './traffic-table.component.html',
  styleUrls: ['./traffic-table.component.css']
})
export class TrafficTableComponent implements OnInit, AfterViewInit {

    @Output()
    isLoaded: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output()
    selectedItemsEmitter: EventEmitter<number> = new EventEmitter<number>();

    @ViewChild(MatPaginator)
    paginator: MatPaginator;
    @ViewChild(MatSort)
    sort: MatSort;

    displayedColumns: string[] = ['select', 'position', 'rateName', 'serviceName', 'traffic'];
    dataSource: MatTableDataSource<TrafficElement>;
    selection = new SelectionModel<TrafficElement>(true, []);
    trafficElements: TrafficElement[];
    trafficsList: Traffic[];

    public _isDisabledDelete: boolean = true;
    public _isDisabledEdit: boolean = true;

    private getDataSubscription: Subscription;


    constructor(private trafficsService: TrafficsService,
                private dialog: MatDialog) {
    }

    ngOnInit(): void {
        this.dataSource = new MatTableDataSource<TrafficElement>();
        this.trafficElements = [];

        this.getDataSubscription = this.trafficsService.trafficsObservable
        .subscribe((data: Traffic[]) => {
            this.trafficsList = [...data];
            let tempTraffics: TrafficElement[] = [];
            for (let i = 0; i < data.length; i++) {
                tempTraffics.push({
                    position: i + 1,
                    rateName: data[i].rate.rateName,
                    serviceName: data[i].service.serviceName,
                    traffic: data[i].traffic + ' MB'
                });
            }
            this.trafficElements = tempTraffics;
            this.updateTable(this.trafficElements);
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

    toggle(row: TrafficElement): void {
        this.selection.toggle(row);
        this.updateButtonsStates(this.selection.selected.length);
    }

    checkboxLabel(row?: TrafficElement): string {
        if (!row) {
            return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
        }
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
    }

    public openDialog(action: string) {
      const dialogConfig = this.initDialogConfig(action);
      const dialogRef = this.dialog.open(TrafficDialogComponent, dialogConfig);

      dialogRef.afterClosed().subscribe(data => {
          data && this.selection.clear();
      });
    }

    public deleteTraffics(): void {
      let trafficId: TrafficId;
      let observables: Observable<any>[] = [];
      for (let i = 0; i < this.selection.selected.length; i++) {
          trafficId = this.trafficsList[this.selection.selected[i].position - 1].trafficId;
          observables.push(this.trafficsService.deleteTraffic(trafficId));
      }
      forkJoin(observables).subscribe(() => {
          this.selection.clear();
          this.trafficsService.loadAll();
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

    private initDialogConfig(action: string): MatDialogConfig {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;

        if (action === "edit") {
            dialogConfig.data = {
                traffic: this.trafficsList[this.selection.selected[0].position - 1],
                title: "Edit Traffic"
            };
        } else {
            dialogConfig.data = {
                title: "New Traffic"
            };
        }
        dialogConfig.data = {
            action: action,
            ...dialogConfig.data
        };

        return dialogConfig;
    }
}

export interface TrafficElement {
    position?: number;
    rateName: string;
    serviceName: string;
    traffic: string;
}
