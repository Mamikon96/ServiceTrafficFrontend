import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {ServiceElement} from "../../app.component";
import {Subscription} from "rxjs";
import {ServicesService} from "../../services/services.service";
import {Service} from "../../models/Service";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {SelectionModel} from "@angular/cdk/collections";

@Component({
  selector: 'service-table',
  templateUrl: './service-table.component.html',
  styleUrls: ['./service-table.component.css']
})
export class ServiceTableComponent implements OnInit, AfterViewInit {

    @ViewChild(MatPaginator)
    paginator: MatPaginator;
    @ViewChild(MatSort)
    sort: MatSort;

    displayedColumns: string[] = ['select', 'position', 'name'];
    dataSource: MatTableDataSource<ServiceElement>;
    selection = new SelectionModel<ServiceElement>(true, []);
    serviceElements: ServiceElement[];

    private getServicesSub: Subscription;


    constructor(private servicesService: ServicesService) {
    }

    ngOnInit(): void {
      console.log("init services");
      this.dataSource = new MatTableDataSource<ServiceElement>();
        this.serviceElements = [];

        this.getServicesSub = this.servicesService.getServices()
        .subscribe((data: Service[]) => {
            for (let i = 0; i < data.length; i++) {
                this.serviceElements.push({
                    position: i + 1,
                    name: data[i].serviceName
                });
            }
            this.updateTable(this.serviceElements);
        });
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

    masterToggle() {
        this.isAllSelected() ?
            this.selection.clear() :
            this.dataSource.data.forEach(row => this.selection.select(row));
    }

    checkboxLabel(row?: ServiceElement): string {
        if (!row) {
            return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
        }
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
    }

    updateTable(serviceElements: ServiceElement[]): void {
        this.dataSource.data = serviceElements;
    }

    editElement(): void {}

}
