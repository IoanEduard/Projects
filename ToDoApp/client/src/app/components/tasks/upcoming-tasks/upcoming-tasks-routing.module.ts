import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { UpcomingTasksComponent } from "./upcoming-tasks.component";

const routes: Routes = [
	{
		path: '',
		component: UpcomingTasksComponent,
	}
];

@NgModule({
	declarations: [],
	imports: [ RouterModule.forChild(routes) ],
	exports: [ RouterModule ]
})
export class UpcomingTasksRoutingModule {}
