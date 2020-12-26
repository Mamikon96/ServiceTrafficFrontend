import {Component, OnDestroy, OnInit} from '@angular/core';
import {DATA_TYPE} from "../../DataTypeUtil";
import {ServicesService} from "../../services/services.service";
import {Subscription} from "rxjs";
import {Router} from "@angular/router";

@Component({
  selector: 'web-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
  // encapsulation: ViewEncapsulation.None
})
export class HeaderComponent implements OnInit, OnDestroy {

    public dataType: string;
    public tableElements: any[];

    public tableOpts = {
        dataType: "",
        tableElements: []
    };

    private getDataSub: Subscription;

    constructor(private servicesService: ServicesService,
                private router: Router) { }

    ngOnInit(): void {
        this.dataType = DATA_TYPE[0];
        this.tableOpts = {
            dataType: this.dataType,
            tableElements: this.tableElements
        };
    }

    ngOnDestroy(): void {
        this.getDataSub && this.getDataSub.unsubscribe();
    }

    public logout(): void {
        sessionStorage.setItem('token', '');
        this.router.navigate(['/login']);
    }

}
