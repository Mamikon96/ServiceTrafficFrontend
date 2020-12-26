import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {Rate} from "../../models/Rate";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {RatesService} from "../../services/rates.service";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-rate-dialog',
  templateUrl: './rate-dialog.component.html',
  styleUrls: ['./rate-dialog.component.css']
})
export class RateDialogComponent implements OnInit {

    form: FormGroup;
    rate: Rate;

    data;
    title;

    public _showError: boolean = false;

    constructor(private fb: FormBuilder,
                private dialogRef: MatDialogRef<RateDialogComponent>,
                private ratesService: RatesService,
                private datePipe: DatePipe,
                @Inject(MAT_DIALOG_DATA) data) {
        this.data = data;
    }

    ngOnInit(): void {
        this.title = this.data.title;
        if (this.data.action === "add") {
            this.form = this.generateAddForm();
        } else {
            this.form = this.generateEditForm();
        }
    }

    save() {
        this.rate = this.extractRate();
        this.ratesService.addRate(this.rate).subscribe(data => {
            this.ratesService.loadAll();
            this.dialogRef.close(true);
        }, error => {
            this._showError = true;
        });
    }

    update() {
        this.rate = this.extractRate();
        this.rate.rateId = this.data.rate.rateId;
        this.ratesService.updateRate(this.rate).subscribe(data => {
            this.ratesService.loadAll();
            this.dialogRef.close(true);
        }, error => {
            this._showError = true;
        });
    }

    close() {
        this.dialogRef.close(false);
    }

    private extractRate(): Rate {
        return {
            rateName: this.form.get('rateName').value,
            price: this.form.get('price').value,
            expirationDate: this.form.get('expirationDate').value
        };
    }

    private generateAddForm(): FormGroup {
        return this.fb.group({
            rateName: ['', []],
            price: ['', []],
            expirationDate: ['', []]
        });
    }

    private generateEditForm(): FormGroup {
        return this.fb.group({
            rateName: [this.data.rate.rateName, []],
            price: [this.data.rate.price, []],
            expirationDate: [this.datePipe.transform(this.data.rate.expirationDate, 'yyyy-MM-dd') , []]
        });
    }

}
