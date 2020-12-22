import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Traffic} from "../../models/Traffic";
import {TrafficsService} from "../../services/traffics.service";
import {TrafficElement} from "../../components/traffic-table/traffic-table.component";
import {RatesService} from "../../services/rates.service";
import {Rate} from "../../models/Rate";
import {Subscription} from "rxjs";
import {Service} from "../../models/Service";
import {ServicesService} from "../../services/services.service";

@Component({
  selector: 'app-traffic-dialog',
  templateUrl: './traffic-dialog.component.html',
  styleUrls: ['./traffic-dialog.component.css']
})
export class TrafficDialogComponent implements OnInit {

    form: FormGroup;
    traffic: Traffic;

    data;
    title;

    public _rates: Rate[];
    public _services: Service[];
    public _showError: boolean = false;

    private ratesSub: Subscription;
    private servicesSub: Subscription;

    constructor(private fb: FormBuilder,
                private dialogRef: MatDialogRef<TrafficDialogComponent>,
                private trafficsService: TrafficsService,
                private ratesService: RatesService,
                private servicesService: ServicesService,
                @Inject(MAT_DIALOG_DATA) data) {
        this.data = data;
    }

    ngOnInit(): void {
        this.ratesService.loadAll();
        this.servicesService.loadAll();
        this.initSubscriptios();


        this.title = this.data.title;
        if (this.data.action === "add") {
            this.form = this.generateAddForm();
        } else {
            this.form = this.generateEditForm();
        }
    }

    save() {
        this.traffic = this.extractTrafficForCreate();
        this.traffic.trafficId = {
            rateId: this.traffic.rate.rateId,
            serviceId: this.traffic.service.serviceId
        };
        this.trafficsService.addTraffic(this.traffic).subscribe(data => {
            this.trafficsService.loadAll();
            this.dialogRef.close(true);
        }, error => {
            this._showError = true;
        });
    }

    update() {
        this.traffic = this.extractTrafficForUpdate();
        this.traffic.trafficId = this.data.traffic.trafficId;
        this.trafficsService.updateTraffic(this.traffic).subscribe(data => {
            this.trafficsService.loadAll();
            this.dialogRef.close(true);
        }, error => {
            this._showError = true;
        });
    }

    close() {
        this.dialogRef.close(false);
    }

    private extractTrafficForCreate(): Traffic {
        return {
            rate: this._rates[this.form.get('rateName').value],
            service: this._services[this.form.get('serviceName').value],
            traffic: this.form.get('traffic').value
        };
    }

    private extractTrafficForUpdate(): Traffic {
        return {
            rate: this._rates[this.form.get('rateName').value],
            service: this._services[this.form.get('serviceName').value],
            traffic: this.form.get('traffic').value
        };
    }

    private generateAddForm(): FormGroup {
        return this.fb.group({
            rateName: ['', []],
            serviceName: ['', []],
            traffic: ['', []]
        });
    }

    private generateEditForm(): FormGroup {
        return this.fb.group({
            rateName: new FormControl({
                value: this.data.traffic.rate.rateName,
                disabled: true
            }),
            serviceName: new FormControl({
                value: this.data.traffic.service.serviceName,
                disabled:true
            }),
            traffic: [this.data.traffic.traffic]
        });
    }

    private initSubscriptios(): void {
        this.ratesSub = this.ratesService.ratesObservable
        .subscribe((data: Rate[]) => {
            this._rates = [...data];
        });
        this.servicesSub = this.servicesService.servicesObservable
        .subscribe((data: Service[]) => {
            this._services = [...data];
        });
    }

}
