import { Component, OnInit } from '@angular/core';
import {Subscription} from "rxjs";
import {ServicesService} from "../../services/services.service";
import {DATA_TYPE} from "../../DataTypeUtil";
import {MatTabChangeEvent} from "@angular/material/tabs";
import {Service} from "../../models/Service";

@Component({
  selector: 'web-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit {

    public dataType: string;
    public tableElements: any[];

    public tableOpts = {
        dataType: "",
        tableElements: []
    };

    public _isLoaded: boolean = true;

    private getDataSub: Subscription;

    /** @internal */
    public _tabsTitles: string[] = [
        'Services',
        'Rates',
        'Traffics',
        'Consumptions',
        'Customers'
    ];

    constructor(private servicesService: ServicesService) { }

    ngOnInit(): void {
        this.dataType = DATA_TYPE[0];
        this.changeTableData();
        this.tableOpts = {
            dataType: this.dataType,
            tableElements: this.tableElements
        };
    }

    ngOnDestroy(): void {
        this.getDataSub && this.getDataSub.unsubscribe();
    }

    public handleTabClick(event: MatTabChangeEvent): void {
        this._isLoaded = false;
        console.log(DATA_TYPE[event.index]);
        this.dataType = DATA_TYPE[event.index];
        this.changeTableData();
    }

    private changeTableData(): void {
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
                    this.tableElements = null;
                    this.tableElements = [...tempTableElements];
                });
            break;
        }
    }

}
