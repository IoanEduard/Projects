import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
	{
		path: 'today-tasks',
		loadChildren: () => import('./today-tasks/today-tasks.module').then((mod) => mod.TodayTasksModule)
	},
	{
		path: 'upcoming-tasks',
		loadChildren: () => import('./upcoming-tasks/upcoming-tasks.module').then((mod) => mod.UpcomingTasksModule)
	}
];

@NgModule({
	declarations: [],
	imports: [ RouterModule.forChild(routes) ],
	exports: [ RouterModule ]
})
export class TasksRoutingModule {}
