import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommentDto } from '../models/dtos/CommentDto';
import { IComment } from '../models/IComment';

@Injectable({
	providedIn: 'root'
})
export class CommentService {
	url = 'https://localhost:7284/api/comment/';

	constructor(private http: HttpClient) { }

	getCommentsForTask(taskId: number) { }

	deleteCommentFromTask(commentId: number) {
		return this.http.delete(this.url + commentId);
	}

	addOrUpdate(commentDto: CommentDto) {
		return this.http.post<any>(this.url + 'addOrUpdate', commentDto);
	}

	getCommentById() { }
}
