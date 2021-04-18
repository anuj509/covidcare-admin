import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DefaultComponent } from './default.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@app/shared/shared.module';
import { AngularMaterialModule } from '@app/angular-material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { LogInComponent } from '../log-in/log-in.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { AlertComponent } from '../alert/alert.component';
import { ToastrModule } from 'ngx-toastr';
import { TableModule } from 'ngx-easy-table';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { DeleteComponent } from '../delete/delete.component';
import { UsersComponent } from '../users/users.component';
import { ResourcesComponent } from '../resources/resources.component';
import { CreateResourceComponent } from '../resources/create-resources/create-resource.component';
import { EditResourceComponent } from '../resources/edit-resources/edit-resource.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
@NgModule({
  declarations: [
    DefaultComponent,
    LogInComponent,
    DashboardComponent,
    AlertComponent,
    DeleteComponent,
    UsersComponent,
    ResourcesComponent,
    CreateResourceComponent,
    EditResourceComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    AngularMaterialModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxMatSelectSearchModule,
    ToastrModule.forRoot(),
    TableModule,
  ],
  entryComponents:[
    DeleteComponent
  ],
  providers:[{
    provide: MatDialogRef,
    useValue: {}
  }, {
    provide: MAT_DIALOG_DATA,
    useValue: {} // Add any data you wish to test if it is passed/used correctly
  },{provide: MAT_DATE_LOCALE, useValue: 'en-GB'}],
})
export class DefaultModule { }
