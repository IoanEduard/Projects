import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TodayTasksComponent } from './today-tasks.component';
import { TodayTaskCommentsListComponent } from './today-task-list/today-task-comments-list/today-task-comments-list.component';
import { TodayTaskListComponent } from './today-task-list/today-task-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TodayTasksRoutingModule } from './today-tasks-routing.module';

@NgModule({
	declarations: [ TodayTasksComponent, TodayTaskListComponent, TodayTaskCommentsListComponent ],
	imports: [ CommonModule, FormsModule, ReactiveFormsModule, BsDatepickerModule.forRoot(), TodayTasksRoutingModule ],
	exports: [ TodayTasksComponent, TodayTaskListComponent, TodayTaskCommentsListComponent ],
	providers: []
})
export class TodayTasksModule {}
