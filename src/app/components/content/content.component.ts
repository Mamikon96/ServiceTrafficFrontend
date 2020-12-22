import { Component, OnInit } from '@angular/core';
import {Subscription} from "rxjs";
import {ServicesService} from "../../services/services.service";
import {DATA_TYPE} from "../../DataTypeUtil";
import {MatTabChangeEvent} from "@angular/material/tabs";
import {Service} from "../../models/Service";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {ServiceDialogComponent} from "../../forms/service-dialog/service-dialog.component";

@Component({
  selector: 'web-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit {

    public dataType: string;

    public servicesDataHasChanged: boolean = true;
    public ratesDataHasChanged: boolean;
    public trafficsDataHasChanged: boolean;
    public consumptionsDataHasChanged: boolean;
    public customersDataHasChanged: boolean;
    // public tableElements: any[];

    // public tableOpts = {
    //     dataType: "",
    //     tableElements: []
    // };

    public _isLoaded: boolean = true;
    public _isDisabledDelete: boolean = true;
    public _isDisabledEdit: boolean = true;
    /** @internal */
    public _tabsTitles: string[] = [
        'Services',
        'Rates',
        'Traffics',
        'Consumptions',
        'Customers'
    ];

    private getDataSub: Subscription;

    constructor(private dialog: MatDialog) { }

    ngOnInit(): void {
        this.dataType = DATA_TYPE[0];
        // this.changeTableData();
        // this.tableOpts = {
        //     dataType: this.dataType,
        //     tableElements: this.tableElements
        // };
    }

    ngOnDestroy(): void {
        this.getDataSub && this.getDataSub.unsubscribe();
    }

    public switchSpinner(): void {
        this._isLoaded = !this._isLoaded;
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

    /*public openDialog(action: string) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;

        if (action === "edit")

        const dialogRef = this.dialog.open(AddServiceDialogComponent, dialogConfig);

        dialogRef.afterClosed().subscribe(data => {
            console.log("Dialog Output:");
            console.log(data);
            this.servicesDataHasChanged = !this.servicesDataHasChanged;
        });
    }*/

    public handleTabClick(event: MatTabChangeEvent): void {
          this._isLoaded = false;
          console.log(DATA_TYPE[event.index]);
          this.dataType = DATA_TYPE[event.index];
          // this.changeTableData();
    }

    /*private changeTableData(): void {
        switch (this.dataType) {
            case "service":
                this.getDataSub = this.servicesService.getServices()
                .subscribe((data: Service[]) => {
                    let tempTableElements = [];
                    for (let i = 0; i < data.length; i++) {
                        tempTableElements.push({
                            position: i,
                            name: data[i].serviceName
                        });
                    }
                    this.tableElements = [...tempTableElements];
                });
            break;
        }
    }*/

}
