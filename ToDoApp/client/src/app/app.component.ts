import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ITodayTask } from './shared/models/ITodayTasks';
import { AuthService } from './shared/services/auth.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: [ './app.component.scss' ]
})
export class AppComponent implements OnInit {
	jwtHelperService = new JwtHelperService();

	hours = 24;
	timeNow = new Date().getTime();
	todayTasksTime: ITodayTask[] = JSON.parse(localStorage.getItem('todayTasks') || '[]');

	constructor(private authService: AuthService) {}

	ngOnInit(): void {
		this.decodeToken();
		this.removeTodayTasksAfterOneHour();
	}

	private removeTodayTasksAfterOneHour() {
		if (this.todayTasksTime.length > 0) {
			const getTaskTime = this.todayTasksTime[0].timeAdded;
			if (this.timeNow - getTaskTime > this.hours * 60 * 60 * 1000) {
				localStorage.removeItem('todayTasks');
			}
		}
	}

	private decodeToken() {
		const token = localStorage.getItem('token');
		if (token) {
			this.authService.isLoggedIn.next(true);
			this.authService.decodedToken = this.jwtHelperService.decodeToken(token);
		}
	}
}
