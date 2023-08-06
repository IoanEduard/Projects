import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { TodayTasksComponent } from "./today-tasks.component";

const routes: Routes = [
	{
		path: '',
		component: TodayTasksComponent,
	}
];

@NgModule({
	declarations: [],
	imports: [ RouterModule.forChild(routes) ],
	exports: [ RouterModule ]
})
export class TodayTasksRoutingModule {}
