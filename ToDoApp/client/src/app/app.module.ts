import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavComponent } from './shared/shared-components/nav/nav.component';
import { SidebarComponent } from './shared/shared-components/sidebar/sidebar.component';
import { LoginComponent } from './components/user-account/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from './shared/services/auth.service';
import { RegisterComponent } from './components/user-account/register/register.component';
import { ErrorInterceptor } from './shared/interceptors/error.interceptor';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OurToastrService } from './shared/services/toastr.service';
import { JwtModule } from '@auth0/angular-jwt';
import { TasksModule } from './components/tasks/tasks.module';
import { ProjectsModule } from './components/projects/projects.module';
import { ActivityComponent } from './components/activity/activity.component';
import { ActivityFeedComponent } from './components/activity-feed/activity-feed.component';
import { NotFoundPageComponent } from './components/not-found-page/not-found-page.component';

export function tokenGetter() {
	return localStorage.getItem('token');
}
@NgModule({
	declarations: [AppComponent, NavComponent, SidebarComponent, LoginComponent, RegisterComponent, ActivityComponent, ActivityFeedComponent, NotFoundPageComponent],
	imports: [
		BrowserModule,
		AppRoutingModule,
		HttpClientModule,
		FormsModule,
		ReactiveFormsModule,
		BrowserAnimationsModule,
		ToastrModule.forRoot({
			timeOut: 1000,
			positionClass: 'toast-bottom-left',
			preventDuplicates: true
		}),
		JwtModule.forRoot({
			config: {
				tokenGetter: tokenGetter
			}
		}),
		TasksModule,
		ProjectsModule
	],
	providers: [AuthService, ErrorInterceptor, OurToastrService],
	bootstrap: [AppComponent]
})
export class AppModule { }
