import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ServicesService} from "../../services/services.service";
import {Service} from "../../models/Service";

@Component({
  selector: 'web-service-dialog',
  templateUrl: './service-dialog.component.html',
  styleUrls: ['./service-dialog.component.css']
})
export class ServiceDialogComponent implements OnInit {

    form: FormGroup;
    service: Service;

    data;
    title;

    public _showError: boolean = false;

    constructor(private fb: FormBuilder,
                private dialogRef: MatDialogRef<ServiceDialogComponent>,
                private servicesService: ServicesService,
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
        this.service = this.extractService();
        this.servicesService.addService(this.service).subscribe(data => {
            this.servicesService.loadAll();
            this.dialogRef.close(true);
        }, error => {
            this._showError = true;
        });
    }

    update() {
        this.service = this.extractService();
        this.service.serviceId = this.data.service.serviceId;
        this.servicesService.updateService(this.service).subscribe(data => {
            this.servicesService.loadAll();
            this.dialogRef.close(true);
        }, error => {
           this._showError = true;
        });
    }

    close() {
        this.dialogRef.close(false);
    }

    private extractService(): Service {
        return {
            serviceName: this.form.get('serviceName').value,
            traffics: []
        };
    }

    private generateAddForm(): FormGroup {
        return this.fb.group({
            serviceName: ['', []]
        });
    }

    private generateEditForm(): FormGroup {
        return this.fb.group({
            serviceName: [this.data.service.serviceName, []]
        });
    }
}
