import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {ServiceElement} from "../../app.component";
import {Observable, Subscription, forkJoin} from "rxjs";
import {ServicesService} from "../../services/services.service";
import {Service} from "../../models/Service";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {SelectionModel} from "@angular/cdk/collections";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {ServiceDialogComponent} from "../../forms/service-dialog/service-dialog.component";

@Component({
  selector: 'service-table',
  templateUrl: './service-table.component.html',
  styleUrls: ['./service-table.component.css']
})
export class ServiceTableComponent implements OnInit, AfterViewInit {

    @Output()
    isLoadedEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output()
    selectedItemsEmitter: EventEmitter<number> = new EventEmitter<number>();

    @ViewChild(MatPaginator)
    paginator: MatPaginator;
    @ViewChild(MatSort)
    sort: MatSort;

    displayedColumns: string[] = ['select', 'position', 'name'];
    dataSource: MatTableDataSource<ServiceElement>;
    selection = new SelectionModel<ServiceElement>(true, []);
    serviceElements: ServiceElement[];
    servicesList: Service[];

    public _isDisabledDelete: boolean = true;
    public _isDisabledEdit: boolean = true;

    private getServicesSub: Subscription;


    constructor(private servicesService: ServicesService,
                private dialog: MatDialog) {
    }

    ngOnInit(): void {
        this.dataSource = new MatTableDataSource<ServiceElement>();
        this.serviceElements = [];

        this.getServicesSub = this.servicesService.servicesObservable.subscribe(
            (data: Service[]) => {
                this.servicesList = [...data];
                let tempServices: ServiceElement[] = [];
                for (let i = 0; i < data.length; i++) {
                    tempServices.push({
                        position: i + 1,
                        name: data[i].serviceName
                    });
                }
                this.serviceElements = tempServices;
                this.updateTable(this.serviceElements);
                this.isLoadedEmitter.emit(true);
            }
        );
    }

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    ngOnDestroy(): void {
        this.getServicesSub && this.getServicesSub.unsubscribe();
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
        // this.selectedItemsEmitter.emit(this.selection.selected.length);
        this.updateButtonsStates(this.selection.selected.length);
    }

    toggle(row: ServiceElement): void {
        this.selection.toggle(row);
        // this.selectedItemsEmitter.emit(this.selection.selected.length);
      this.updateButtonsStates(this.selection.selected.length);
    }

    checkboxLabel(row?: ServiceElement): string {
        if (!row) {
            return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
        }
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
    }

    public openDialog(action: string) {
        const dialogConfig = this.initDialogConfig(action);
        const dialogRef = this.dialog.open(ServiceDialogComponent, dialogConfig);

        dialogRef.afterClosed().subscribe(data => {
            data && this.selection.clear();
        });
    }

    public deleteServices(): void {
        let serviceId: number;
        let observables: Observable<any>[] = [];
        for (let i = 0; i < this.selection.selected.length; i++) {
            serviceId = this.servicesList[this.selection.selected[i].position - 1].serviceId;
            observables.push(this.servicesService.deleteService(serviceId));
        }
        forkJoin(observables).subscribe(() => {
            this.selection.clear();
            this.servicesService.loadAll();
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

    updateTable(serviceElements: ServiceElement[]): void {
        this.dataSource.data = serviceElements;
    }

    editElement(): void {}

    private initDialogConfig(action: string): MatDialogConfig {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;

        if (action === "edit") {
            dialogConfig.data = {
                service: this.servicesList[this.selection.selected[0].position - 1],
                title: "Edit Service"
            };
        } else {
            dialogConfig.data = {
                title: "New Service"
            };
        }
        dialogConfig.data = {
            action: action,
            ...dialogConfig.data
        };

        return dialogConfig;
    }
}
