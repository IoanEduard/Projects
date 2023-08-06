import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, noop, Observable, Subject, tap } from 'rxjs';
import { BasicResponse } from '../models/dtos/BasicResponse';
import { ISearchResponse } from '../models/dtos/ISearchProjectResponse';
import { IProject } from '../models/IProject';
@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  url: string = 'https://localhost:7284/api/projects';
  urlTask: string = 'https://localhost:7284/api/task';

  newProjectAddedInModal: Subject<IProject> = new Subject();
  projectUpdatedInModel: Subject<{ indexProjectWasEdited: number, project: IProject }> = new Subject();

  constructor(private http: HttpClient) { }

  getProjects() {
    return this.http.get<IProject[]>(this.url);
  }

  getProjectById(id: number): Observable<IProject> {
    return this.http.get<IProject>(`${this.url}/${id}`);
  }

  addProject(project: IProject) {
    return this.http.post<IProject>(this.url, project);
  }

  updateProject(projectId: number, project: IProject) {
    return this.http.put<IProject>(`${this.url}/${projectId}`, project);
  }

  deleteProject(projectId: number) {
    return this.http.delete(`${this.url}/${projectId}`);
  }

  searchProjectByName(query: string) {
    return this.http.get<ISearchResponse>(
      'https://localhost:7284/api/projects/searchProject', {
      params: { searchText: query }
    }).pipe(
      map((data: ISearchResponse) => (data && data.items || [])),
      tap(() => noop, err => {
        // in case of http error
        return err && err.message || 'Something goes wrong';
      })
    );
  }

  markAsComplete(projectId: number, completed: boolean) {
    return this.http.put<any>(`${this.url}/completeProject/${projectId}/${completed}`, {});
  }

  assignTaskToProject(taskId: number, projectId: number) {
    return this.http.post<any>(this.urlTask + `/addTaskToProject/${taskId}/${projectId}`, {});
  }

  makeMultipleTasksInactive(taskIds: number[]) {
    return this.http.put<any>(this.url + `/markTasksInactive`, taskIds);

  }
}
