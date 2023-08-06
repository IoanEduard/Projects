import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UpcomingTasksComponent } from './upcoming-tasks.component';
import { UpcomingTasksListComponent } from './upcoming-tasks-list/upcoming-tasks-list.component';
import { UpcomingTasksCommentsListComponent } from './upcoming-tasks-list/upcoming-tasks-comments-list/upcoming-tasks-comments-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { UpcomingTasksRoutingModule } from './upcoming-tasks-routing.module';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';

@NgModule({
	declarations: [UpcomingTasksComponent, UpcomingTasksListComponent, UpcomingTasksCommentsListComponent],
	imports: [FormsModule, ReactiveFormsModule, BsDatepickerModule.forRoot(), CommonModule, UpcomingTasksRoutingModule,
		TypeaheadModule.forRoot(),
	],
	exports: [UpcomingTasksComponent, UpcomingTasksListComponent, UpcomingTasksCommentsListComponent]
})
export class UpcomingTasksModule { }
