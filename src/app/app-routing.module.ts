import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DefaultComponent } from './components/default/default.component';
import { LogInComponent } from './components/log-in/log-in.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AuthGuard } from './helpers/auth.guard';
import { ResourcesComponent } from './components/resources/resources.component';
import { CreateResourceComponent } from './components/resources/create-resources/create-resource.component';
import { EditResourceComponent } from './components/resources/edit-resources/edit-resource.component';
import { FeedsComponent } from './components/feeds/feeds.component';


const routes: Routes = [
  {
    path: '',
    component: DefaultComponent,
    children: [
      { 
        path: '', 
        pathMatch: 'full', 
        redirectTo: 'login' 
      },
      { 
        path: 'login', 
        component: LogInComponent 
      },
      {
        path: 'home',
        component: DashboardComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'resources',
        component: ResourcesComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'resources/create',
        component: CreateResourceComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'resources/edit/:id',
        component: EditResourceComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'feeds',
        component: FeedsComponent,
        canActivate: [AuthGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
