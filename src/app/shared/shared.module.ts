import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { PagerComponent } from './pager/pager.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PagerHeaderComponent } from './pager-header/pager-header.component';
import { ShoppingCartSummaryComponent } from './shoppingcart/shoppingcart-summary/shoppingcart-summary.component';
import { BookOrdersComponent } from './shoppingcart/bookorders/book-orders.component';
import { StepperComponent } from './stepper/stepper.component';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { RouterModule } from '@angular/router';
import { ErrorBadRequestComponent } from './error/errorbadrequest/errorbadrequest.component';

@NgModule({
  declarations: [
    PagerHeaderComponent,
    PagerComponent,
    ShoppingCartSummaryComponent,
    ErrorBadRequestComponent,
    BookOrdersComponent,
    StepperComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    BsDropdownModule.forRoot(),
    PaginationModule.forRoot(),
    CdkStepperModule,
    RouterModule
  ],
  exports: [
    PaginationModule,
    PagerHeaderComponent,
    PagerComponent,
    ShoppingCartSummaryComponent,
    ErrorBadRequestComponent,
    BookOrdersComponent,
    StepperComponent,
    CdkStepperModule,
    BsDropdownModule
  ]
})
export class SharedModule { }
