import { Component, OnInit } from '@angular/core';
import { IProject } from 'src/app/shared/models/IProject';
import { ProjectService } from 'src/app/shared/services/project.service';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { ProjectsFormModalComponent } from './projects-form-modal/projects-form-modal.component';
import { map, noop, Observable, Observer, of, switchMap, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ISearchResponse } from 'src/app/shared/models/dtos/ISearchProjectResponse';
import { BasicResponse } from 'src/app/shared/models/dtos/BasicResponse';
import { Router } from '@angular/router';
import { UpcomingTasksService } from 'src/app/shared/services/upcoming-tasks.service';

@Component({
  selector: 'app-projects-list',
  templateUrl: './projects-list.component.html',
  styleUrls: ['./projects-list.component.scss']
})
export class ProjectsListComponent implements OnInit {

  search?: string;
  suggestions$?: Observable<BasicResponse[]>;
  errorMessage?: string;

  projectsList: IProject[] = [];
  bsModalRef?: BsModalRef;

  isCollapsed = true;
  tasksIdsArray: number[] = [];
  customAccordionStyles = 'custom_accordion_styles';

  constructor(private projectService: ProjectService, private modalService: BsModalService, private taskService: UpcomingTasksService) { }

  ngOnInit(): void {
    this.initializeProjects();

    this.projectService.newProjectAddedInModal.subscribe(result => {
      this.projectsList.unshift(result);
    })
  }

  removeProject(projectId: number, index: number) {
    this.projectService.deleteProject(projectId).subscribe(result => {
      this.projectsList.splice(index, 1);
    })
  }

  editProject(projectId: number, index: number) {
    this.projectService.getProjectById(projectId).subscribe(result => {
      const initialState: ModalOptions = {
        initialState: {
          project: result,
          editMode: true,
          projectIdToEdit: projectId,
          editProjectAtIndex: index
        }
      };

      this.bsModalRef = this.modalService.show(ProjectsFormModalComponent, initialState);
      this.bsModalRef.setClass('modal-lg');
      this.bsModalRef.content.closeBtnName = 'Close';
    })
  }

  markProjectAsComplete(project: IProject) {
    let projectCompleted = !project.completed;
    this.projectService.markAsComplete(project.id, projectCompleted).subscribe(_ => {
      // apply ng class in template
    }, error => {
      console.log(error);
    })
  }

  onChange(id: number, isChecked: any) {
    if ((<HTMLInputElement>isChecked.target).checked) {
      this.tasksIdsArray.push(id);
    } else {
      let index = this.tasksIdsArray.indexOf(id);
      this.tasksIdsArray.splice(index, 1);
    }
  }

  removeTasksFromProject(projectId: number) {
    this.taskService.moveMultipleTasksToTrash(this.tasksIdsArray, projectId).subscribe(_ => {

    }, (error: any) => console.log(error));
  }

  deleteTasksFromProject(projectId: number) {

  }

  private initializeProjects() {
    this.projectService.getProjects().subscribe(result => {
      this.projectsList = result;
    })
  }
}
