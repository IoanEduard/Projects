import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomepageComponent } from './_Components/_homepage/homepage.component';

import { ManagementComponent } from './_Components/management/management.component';
import { RankComponent } from './_Components/RankComponents/rank/rank.component';
import { EmployeeComponent } from './_Components/EmployeeComponents/employee/employee.component';


const routes: Routes = [
  { path: '', redirectTo: '/homepage', pathMatch: 'full' },
  { path: 'homepage', component: HomepageComponent },
  { path: 'manangement', component: ManagementComponent,
    children: [
      { path: '', redirectTo: 'homepage', pathMatch: 'full' },
      { path: 'employee', component: EmployeeComponent, outlet: 'emp' },
      { path: 'rank', component: RankComponent, outlet: 'rank' },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule 
{ 
}
