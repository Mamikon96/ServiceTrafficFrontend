import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServicesComponent } from './components/services/services.component';
import { ServiceComponent } from './components/service/service.component';
import { HeaderComponent } from './components/header/header.component';
import {MaterialModule} from "./modules/material/material.module";
import { TableComponent } from './components/table/table.component';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { ServiceTableComponent } from './components/service-table/service-table.component';
import { RateTableComponent } from './components/rate-table/rate-table.component';
import { TrafficTableComponent } from './components/traffic-table/traffic-table.component';
import { ConsumptionTableComponent } from './components/consumption-table/consumption-table.component';
import { CustomerTableComponent } from './components/customer-table/customer-table.component';
import { ContentComponent } from './components/content/content.component';
import { FooterComponent } from './components/footer/footer.component';

@NgModule({
  declarations: [
    AppComponent,
    ServicesComponent,
    ServiceComponent,
    HeaderComponent,
    TableComponent,
    ServiceTableComponent,
    RateTableComponent,
    TrafficTableComponent,
    ConsumptionTableComponent,
    CustomerTableComponent,
    ContentComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
