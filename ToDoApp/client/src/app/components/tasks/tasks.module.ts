import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TasksRoutingModule } from './tasks-routing.module';
import { TasksComponent } from './tasks.component';
import { TodayTasksModule } from './today-tasks/today-tasks.module';
import { UpcomingTasksModule } from './upcoming-tasks/upcoming-tasks.module';

@NgModule({
	declarations: [ TasksComponent ],
	imports: [ CommonModule, TodayTasksModule, UpcomingTasksModule, TasksRoutingModule ],
	exports: [ TodayTasksModule, UpcomingTasksModule, TasksComponent ],
	providers: [],
	bootstrap: []
})
export class TasksModule {}