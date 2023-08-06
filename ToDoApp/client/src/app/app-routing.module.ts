import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActivityFeedComponent } from './components/activity-feed/activity-feed.component';
import { ActivityComponent } from './components/activity/activity.component';
import { NotFoundPageComponent } from './components/not-found-page/not-found-page.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { LoginComponent } from './components/user-account/login/login.component';
import { RegisterComponent } from './components/user-account/register/register.component';

const routes: Routes = [
	{ path: '', component: LoginComponent },
	{
		path: 'tasks',
		loadChildren: () => import('./components/tasks/tasks.module').then((mod) => mod.TasksModule)
	},
	{
		path: 'projects',
		loadChildren: () => import('./components/projects/projects.module').then((mod) => mod.ProjectsModule)
	},
	{
		path: 'login', component: LoginComponent
	},
	{
		path: 'register', component: RegisterComponent
	},
	{
		path: 'activity', component: ActivityComponent
	},
	{
		path: 'activity-feed', component: ActivityFeedComponent
	},
	{
		path: '**', component: NotFoundPageComponent
	}
];
@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
