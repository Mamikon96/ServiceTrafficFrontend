import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {Service} from "../../models/Service";
import {Subscription} from "rxjs";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ServicesService} from "../../services/services.service";
import {CustomersService} from "../../services/customers.service";
import {ConsumptionsService} from "../../services/consumptions.service";
import {Consumption} from "../../models/Consumption";
import {Client} from "../../models/Client";

@Component({
    selector: 'app-consumption-dialog',
    templateUrl: './consumption-dialog.component.html',
    styleUrls: ['./consumption-dialog.component.css']
})
export class ConsumptionDialogComponent implements OnInit, OnDestroy {

    form: FormGroup;
    consumption: Consumption;

    data;
    title;

    public _customers: Client[];
    public _services: Service[];
    public _showError: boolean = false;

    private customersSub: Subscription;
    private servicesSub: Subscription;

    constructor(private fb: FormBuilder,
                private dialogRef: MatDialogRef<ConsumptionDialogComponent>,
                private consumptionsService: ConsumptionsService,
                private customersService: CustomersService,
                private servicesService: ServicesService,
                @Inject(MAT_DIALOG_DATA) data) {
        this.data = data;
    }

    ngOnInit(): void {
        this.customersService.loadAll();
        this.servicesService.loadAll();
        this.initSubscriptios();

        this.title = this.data.title;
        if (this.data.action === "add") {
            this.form = this.generateAddForm();
        } else {
            this.form = this.generateEditForm();
        }
    }

    ngOnDestroy(): void {
        this.customersSub && this.customersSub.unsubscribe();
        this.servicesSub && this.servicesSub.unsubscribe();
    }

    save() {
        this.consumption = this.extractConsumptionForCreate();
        this.consumption.consumptionId = {
            clientId: this.consumption.client.clientId,
            serviceId: this.consumption.service.serviceId
        };
        this.consumptionsService.addConsumption(this.consumption).subscribe(data => {
            this.consumptionsService.loadAll();
            this.dialogRef.close(true);
        }, error => {
            this._showError = true;
        });
    }

    update() {
        this.consumption = this.extractConsumptionForUpdate();
        this.consumption.consumptionId = this.data.traffic.trafficId;
        this.consumptionsService.updateConsumption(this.consumption).subscribe(data => {
            this.consumptionsService.loadAll();
            this.dialogRef.close(true);
        }, error => {
            this._showError = true;
        });
    }

    close() {
        this.dialogRef.close(false);
    }

    private extractConsumptionForCreate(): Consumption {
        return {
            client: this._customers[this.form.get('customerName').value],
            service: this._services[this.form.get('serviceName').value],
            consumptionTraffic: this.form.get('consumptionTraffic').value
        };
    }

    private extractConsumptionForUpdate(): Consumption {
        return {
            client: this._customers[this.form.get('customerName').value],
            service: this._services[this.form.get('serviceName').value],
            consumptionTraffic: this.form.get('consumptionTraffic').value
        };
    }

    private generateAddForm(): FormGroup {
        return this.fb.group({
            customerName: ['', []],
            serviceName: ['', []],
            consumptionTraffic: ['', []]
        });
    }

    private generateEditForm(): FormGroup {
        return this.fb.group({
            customerName: new FormControl({
                value: this.data.consumption.client.clientName,
                disabled: true
            }),
            serviceName: new FormControl({
                value: this.data.consumption.service.serviceName,
                disabled: true
            }),
            consumptionTraffic: [this.data.consumption.consumptionTraffic]
        });
    }

    private initSubscriptios(): void {
        this.customersSub = this.customersService.customersObservable
        .subscribe((data: Client[]) => {
            this._customers = [...data];
        });
        this.servicesSub = this.servicesService.servicesObservable
        .subscribe((data: Service[]) => {
            this._services = [...data];
        });
    }

}
