import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { PagingHeaderComponent } from './components/paging-header/paging-header.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PagerComponent } from './components/paging-header/pager/pager.component';
import { OrderSummaryComponent } from './components/order-summary/order-summary.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { StepperComponent } from './stepper/stepper.component';
import { OrderTotalsComponent } from './components/order-totals/order-totals.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    PagingHeaderComponent,
    PagerComponent,
    OrderSummaryComponent,
    StepperComponent,
    OrderTotalsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PaginationModule.forRoot(),
    CarouselModule.forRoot(),
    BsDropdownModule.forRoot(),
    CdkStepperModule,
    RouterModule
  ],
  exports: [
    PaginationModule,
    PagingHeaderComponent,
    PagerComponent,
    CarouselModule,
    OrderSummaryComponent,
    ReactiveFormsModule,
    BsDropdownModule,
    CdkStepperModule,
    StepperComponent,
    OrderTotalsComponent
  ]
})
export class SharedModule { }
