import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {Service} from "../../models/Service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ServicesService} from "../../services/services.service";
import {Client} from "../../models/Client";
import {Rate} from "../../models/Rate";
import {RatesService} from "../../services/rates.service";
import {Subscription} from "rxjs";
import {CustomersService} from "../../services/customers.service";

@Component({
  selector: 'app-customer-dialog',
  templateUrl: './customer-dialog.component.html',
  styleUrls: ['./customer-dialog.component.css']
})
export class CustomerDialogComponent implements OnInit {

    form: FormGroup;
    customer: Client;

    data;
    title;

    public _rates: Rate[];
    public _showError: boolean = false;

    private ratesSub: Subscription;

    constructor(private fb: FormBuilder,
                private dialogRef: MatDialogRef<CustomerDialogComponent>,
                private customersService: CustomersService,
                private ratesService: RatesService,
                @Inject(MAT_DIALOG_DATA) data) {
        this.data = data;
    }

    ngOnInit(): void {
        this.ratesService.loadAll();
        this.initSubscriptios();

        this.title = this.data.title;
        if (this.data.action === "add") {
            this.form = this.generateAddForm();
        } else {
            this.form = this.generateEditForm();
            this.form.get('rateName').setValue(this.data.customer.rate.rateName);
        }
    }

    save() {
        this.customer = this.extractCustomer();
        this.customersService.addCustomer(this.customer).subscribe(data => {
            this.customersService.loadAll();
            this.dialogRef.close(true);
        }, error => {
            this._showError = true;
        });
    }

    update() {
        this.customer = this.extractCustomer();
        this.customer.clientId = this.data.customer.clientId;
        this.customersService.updateCustomer(this.customer).subscribe(data => {
            this.customersService.loadAll();
            this.dialogRef.close(true);
        }, error => {
            this._showError = true;
        });
    }

    close() {
        this.dialogRef.close(false);
    }

    private extractCustomer(): Client {
        return {
            clientName: this.form.get('customerName').value,
            rate: this._rates[this.form.get('rateName').value],
            connectionDate: this.form.get('connectionDate').value,
            paymentDate: this.form.get('paymentDate').value,
            discount: this.form.get('discount').value,
        };
    }

    private generateAddForm(): FormGroup {
        return this.fb.group({
            customerName: ['', []],
            rateName: ['', []],
            connectionDate: ['', []],
            paymentDate: ['', []],
            discount: ['', []]
        });
    }

    private generateEditForm(): FormGroup {
        return  this.fb.group({
            customerName: [this.data.customer.clientName, []],
            rateName: [this.data.customer.rate.rateName, []],
            connectionDate: new FormControl({
                value: this.data.customer.connectionDate,
                disabled: true
            }),
            paymentDate: [this.data.customer.paymentDate, []],
            discount: [this.data.customer.discount, []]
        });
    }

    private initSubscriptios(): void {
        this.ratesSub = this.ratesService.ratesObservable
        .subscribe((data: Rate[]) => {
            this._rates = [...data];
        });
      }

}
