import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/shared/guards/auth.guard';
import { ProjectDetailsComponent } from './projects-list/project-details/project-details.component';
import { ProjectsListComponent } from './projects-list/projects-list.component';
import { ProjectsComponent } from './projects.component';

const routes: Routes = [
  {
    path: '', component: ProjectsComponent, children: [
      { path: 'list', component: ProjectsListComponent },
      { path: ':id', component: ProjectDetailsComponent },
    ]
  },

]
@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class ProjectsRoutingModule { }
