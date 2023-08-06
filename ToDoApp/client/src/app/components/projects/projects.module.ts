import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ProjectsRoutingModule } from './projects-routing.module';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProjectsComponent } from './projects.component';
import { ProjectsListComponent } from './projects-list/projects-list.component';
import { ProjectDetailsComponent } from './projects-list/project-details/project-details.component';
import { ProjectsFormModalComponent } from './projects-list/projects-form-modal/projects-form-modal.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { InactiveTasksListComponent } from './projects-list/projects-form-modal/inactive-tasks-list/inactive-tasks-list.component';
import { ProjectTrashTasksListComponent } from './projects-list/project-trash-tasks-list/project-trash-tasks-list.component';
import { FilterPipe } from 'src/app/shared/pipes/filterPipe.pipe';

@NgModule({
  declarations: [ProjectsComponent, ProjectDetailsComponent, ProjectsListComponent, ProjectsFormModalComponent, InactiveTasksListComponent, ProjectTrashTasksListComponent, FilterPipe],
  imports: [
    CommonModule,
    ModalModule.forRoot(),
    TypeaheadModule.forRoot(),
    AccordionModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    ProjectsRoutingModule,
    BsDatepickerModule.forRoot(),
  ],
  exports: [ProjectsComponent, ProjectDetailsComponent, FilterPipe]
})
export class ProjectsModule { }
