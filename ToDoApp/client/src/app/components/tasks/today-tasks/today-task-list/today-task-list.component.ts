import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ITodayTask } from 'src/app/shared/models/ITodayTasks';
import { TodayTaskService } from '../../tasks.service';
import { ITaskEdit } from '../../../../shared/models/temporary-objects/ITaskEdit';

@Component({
	selector: 'app-today-task-list',
	templateUrl: './today-task-list.component.html',
	styleUrls: ['./today-task-list.component.scss']
})
export class TodayTaskListComponent implements OnInit {
	@Output() taskEditEvent: EventEmitter<ITaskEdit> = new EventEmitter<ITaskEdit>();

	todayTasks: ITodayTask[] = [];
	showCommentComponent: any[] = [];

	constructor(private todayTaskService: TodayTaskService) { }

	ngOnInit(): void {
		this.initializeItems();
	}

	removeTask(index: number) {
		this.todayTasks.splice(index, 1);
		this.todayTaskService.updateTodayTask(this.todayTasks);
	}

	displayCommentsComponent(index: number) {
		this.showCommentComponent[index] = !this.showCommentComponent[index];
	}

	enableEditTask(task: ITodayTask, index: number) {
		this.taskEditEvent.emit(<ITaskEdit>{
			task: task,
			index: index,
			tasks: this.todayTasks
		});
	}

	private initializeItems() {
		this.todayTasks = this.todayTaskService.getTodayTasks();
	}
}


