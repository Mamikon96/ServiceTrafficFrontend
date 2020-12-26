import {Component, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {DATA_TYPE} from "../../DataTypeUtil";
import {MatTabChangeEvent} from "@angular/material/tabs";

@Component({
    selector: 'web-content',
    templateUrl: './content.component.html',
    styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit {

    public dataType: string;

    /** @internal */
    public _isLoaded: boolean = true;
    /** @internal */
    public _tabsTitles: string[] = [
        'Services',
        'Rates',
        'Traffics',
        'Consumptions',
        'Customers'
    ];

    private getDataSub: Subscription;

    constructor() {
    }

    ngOnInit(): void {
        this.dataType = DATA_TYPE[0];
    }

    ngOnDestroy(): void {
        this.getDataSub && this.getDataSub.unsubscribe();
    }

    public switchSpinner(): void {
        this._isLoaded = !this._isLoaded;
    }

    public handleTabClick(event: MatTabChangeEvent): void {
        this._isLoaded = false;
        console.log(DATA_TYPE[event.index]);
        this.dataType = DATA_TYPE[event.index];
    }

}
