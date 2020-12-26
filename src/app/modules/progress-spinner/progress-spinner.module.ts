import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {ProgressSpinnerComponent} from "./progress-spinner.component";



@NgModule({
  declarations: [ProgressSpinnerComponent],
  exports: [
    ProgressSpinnerComponent
  ],
  imports: [
    CommonModule,
    MatProgressSpinnerModule
  ]
})
export class ProgressSpinnerModule { }
