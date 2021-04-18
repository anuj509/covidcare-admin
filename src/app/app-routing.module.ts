import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DefaultComponent } from './components/default/default.component';
import { LogInComponent } from './components/log-in/log-in.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AuthGuard } from './helpers/auth.guard';


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
      // {
      //   path: 'songs',
      //   component: SongsComponent,
      //   canActivate: [AuthGuard]
      // },
      // {
      //   path: 'songs/create',
      //   component: CreateSongComponent,
      //   canActivate: [AuthGuard]
      // },
      // {
      //   path: 'songs/edit/:id',
      //   component: EditSongComponent,
      //   canActivate: [AuthGuard]
      // }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
