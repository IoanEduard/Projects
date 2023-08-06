import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommentDto } from 'src/app/shared/models/dtos/CommentDto';
import { IComment } from 'src/app/shared/models/IComment';
import { ITodayTask } from 'src/app/shared/models/ITodayTasks';
import { CommentService } from 'src/app/shared/services/comment.service';
import { OurToastrService } from 'src/app/shared/services/toastr.service';

@Component({
	selector: 'app-upcoming-tasks-comments-list',
	templateUrl: './upcoming-tasks-comments-list.component.html',
	styleUrls: ['./upcoming-tasks-comments-list.component.scss']
})
export class UpcomingTasksCommentsListComponent implements OnInit {
	@Input() taskComments: { tasks: ITodayTask; taskIndex: number };
	@Output() closeTaskCommentSection: EventEmitter<number> = new EventEmitter();

	commentForm: FormGroup;
	commentFormInitial: FormGroup;
	editMode: boolean;
	taskIndex: number;
	commentIndex: number;

	constructor(
		private commentService: CommentService,
		private fb: FormBuilder,
		private toastrService: OurToastrService
	) { }

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
		if (!this.taskComments.tasks.comments) {
			this.taskComments.tasks.comments = [];
		}

		this.commentService.addOrUpdate({
			id: this.taskComments.tasks.comments[this.commentIndex]?.id,
			commentText: this.commentText?.value,
			taskId: this.taskComments.tasks.id
		} as CommentDto).subscribe(result => {
			if (!this.taskComments.tasks.comments[this.commentIndex]?.id) {
				this.taskComments.tasks.comments.push(result);
				this.toastrService.showSuccess('Comment Added');
			} else {
				this.taskComments.tasks.comments[this.commentIndex].commentText = this.commentText?.value;
				this.toastrService.showSuccess('Comment Updated');

			}
			this.editMode = false;
			this.commentForm.reset(this.commentFormInitial);
		}, (error: any) => {
			this.toastrService.showError(error);
		});
	}

	removeCommentFromTask(commentIndex: number) {
		this.commentService.deleteCommentFromTask(this.taskComments.tasks.comments[commentIndex].id).subscribe(_ => {
			this.taskComments.tasks.comments.splice(commentIndex, 1);
			this.toastrService.showSuccess('Comment Deleted');
		})
	}

	enableEditComment(index: number) {
		this.editMode = true;
		this.commentIndex = index;
		this.patchForm(this.taskComments.tasks.comments[index]);
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
			commentText: ['', [Validators.required, Validators.minLength(3)]]
		});

		this.commentFormInitial = this.commentForm.value;
	}
}
