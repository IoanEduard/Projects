import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { ITodayTask } from 'src/app/shared/models/ITodayTasks';

@Injectable({
	providedIn: 'root'
})
export class TodayTaskService {
	items: any[] = [];

	constructor() {
		this.getTodayTasks();
	}

	getTodayTasks() {
		this.items = JSON.parse(localStorage.getItem('todayTasks') || '[]');
		return this.items;
	}

	addTodayTask(todayTask: ITodayTask): Observable<string> {
		if (this.items.length > 10) return throwError(() => new Error('Maximum of tasks for today exceeded'));

		this.items.push(todayTask);
		localStorage.setItem('todayTasks', JSON.stringify(this.items));

		return of('Task Added');
	}

	updateTodayTask(newTodayTasks: ITodayTask[]): Observable<string> {
		localStorage.setItem('todayTasks', JSON.stringify(newTodayTasks));

		return of('Task edited successfully');
	}

}
