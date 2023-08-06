import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http'; 
import {NgbModule, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EmployeeComponent } from './_Components/EmployeeComponents/employee/employee.component';
import { RankComponent } from './_Components/RankComponents/rank/rank.component';
import { HomepageComponent } from './_Components/_homepage/homepage.component';
import { ManagementComponent } from './_Components/management/management.component';
import { EmployeeService } from './_Services/employee.service';
import { RankService } from './_Services/rank.service';
import { FormsModule } from '@angular/forms';
import { OrderModule } from 'ngx-order-pipe';
import {DatePipe} from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    EmployeeComponent,
    RankComponent,
    ManagementComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule,
    FormsModule,
    OrderModule,
  ],
  providers: [EmployeeService, RankService, DatePipe, NgbActiveModal],
  bootstrap: [AppComponent]
})
export class AppModule { }
