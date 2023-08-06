import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IComment } from 'src/app/shared/models/IComment';
import { ITodayTask } from 'src/app/shared/models/ITodayTasks';
import { OurToastrService } from 'src/app/shared/services/toastr.service';
import { TodayTaskService } from '../../../tasks.service';

@Component({
	selector: 'app-today-task-comments-list',
	templateUrl: './today-task-comments-list.component.html',
	styleUrls: [ './today-task-comments-list.component.scss' ]
})
export class TodayTaskCommentsListComponent implements OnInit, OnChanges {
	@Input() taskComments: { tasks: ITodayTask[]; taskIndex: number };
	@Output() closeTaskCommentSection: EventEmitter<number> = new EventEmitter();

	commentForm: FormGroup;
	commentFormInitial: FormGroup;
	editMode: boolean;
	taskIndex: number;
	commentIndex: number;

	constructor(
		private taskService: TodayTaskService,
		private fb: FormBuilder,
		private toastrService: OurToastrService
	) {}

	ngOnInit(): void {
		this.createForm();
	}

	ngOnChanges(): void {
		this.taskIndex = this.taskComments.taskIndex;
	}

	get commentText() {
		return this.commentForm.get('commentText');
	}

	onSubmit() {
		if (!this.taskComments.tasks[this.taskIndex].comments) {
			this.taskComments.tasks[this.taskIndex].comments = [];
		}

		if (!this.editMode) {
			this.taskComments.tasks[this.taskIndex].comments.push(this.commentForm.value);
		} else {
			this.taskComments.tasks[this.taskIndex].comments[this.commentIndex] = this.commentForm.value;
		}

		this.taskService.updateTodayTask(this.taskComments.tasks).subscribe((result) => {
			this.editMode = false;
			this.commentForm.reset(this.commentFormInitial);
			this.toastrService.showSuccess(result);
		});
	}

	removeCommentFromTask(commentIndex: number) {
		this.taskComments.tasks[this.taskIndex].comments.splice(commentIndex, 1);
		this.taskService.updateTodayTask(this.taskComments.tasks);
	}

	enableEditComment(index: number) {
		this.editMode = true;
		this.commentIndex = index;
		this.patchForm(this.taskComments.tasks[this.taskIndex].comments[index]);
	}

	cancelAddComment() {
		this.closeTaskCommentSection.emit(this.taskComments.taskIndex);
	}

	cancelEditMode() {
		this.editMode = false;
		this.commentForm.reset(this.commentFormInitial);
	}

	private patchForm(comment: IComment) {
		this.commentForm.patchValue(comment);
	}

	private createForm() {
		this.commentForm = this.fb.group({
			commentText: [ '', [ Validators.required, Validators.minLength(3) ] ]
		});

		this.commentFormInitial = this.commentForm.value;
	}
}
