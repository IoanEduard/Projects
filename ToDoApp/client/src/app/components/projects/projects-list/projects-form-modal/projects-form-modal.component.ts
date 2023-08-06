import { ThisReceiver } from '@angular/compiler';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, Pipe, PipeTransform } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { debounceTime, map, Observable, Observer, of, startWith, switchMap, tap } from 'rxjs';
import { BasicResponse } from 'src/app/shared/models/dtos/BasicResponse';
import { Label } from 'src/app/shared/models/enums/label';
import { IProject } from 'src/app/shared/models/IProject';
import { ITask } from 'src/app/shared/models/ITask';
import { TasksGroup } from 'src/app/shared/models/temporary-objects/TasksGroup';
import { TaskTrashDto } from 'src/app/shared/models/temporary-objects/TaskTrashDto';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ProjectService } from 'src/app/shared/services/project.service';
import { UpcomingTasksService } from 'src/app/shared/services/upcoming-tasks.service';

@Component({
  selector: 'app-projects-form-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './projects-form-modal.component.html',
  styleUrls: ['./projects-form-modal.component.scss']
})
export class ProjectsFormModalComponent implements OnInit {
  @Input() project: IProject;
  @Input() editMode: boolean;
  @Input() editProjectAtIndex: number;
  @Input() projectIdToEdit: number;

  projectForm: FormGroup;
  projectFormInitial: FormGroup;
  priorityEnum = Label;
  keys: any[];
  backendErrorMessageDateToComplete: any;
  selectedDate: any;
  minDate: Date;
  todayDate: Date = new Date();

  search?: string;
  suggestions$?: Observable<BasicResponse[]>;
  errorMessage?: string;

  searchTask?: string;
  suggestionsTasks$?: Observable<BasicResponse[]>;
  errorMessageTasks?: string;

  tasksIdsArray: number[] = [];
  taskControlsIndexes: number[] = [];
  allTasksSelected: boolean = false;
  searchText: string;

  displayInactiveTasks: boolean = false;

  constructor(private changes: ChangeDetectorRef, private fb: FormBuilder, private projectService: ProjectService, public bsModalRef: BsModalRef, private taskService: UpcomingTasksService, private authService: AuthService) {
    this.keys = Object.keys(this.priorityEnum).filter((f) => !isNaN(Number(f)));
    this.minDate = new Date();
    this.minDate.setDate(this.minDate.getDate() + 1);
  }

  ngOnInit(): void {
    this.createForm();

    if (this.editMode) {
      this.projectForm = this.fb.group({
        name: this.project.name,
        description: this.project.description,
        tasks: this.fb.array(this.project.tasks.map(t => this.generateTasksFormArray(t)))
      })
    }

    if (this.projectTasks.length === 0) this.projectTasks.controls = [];

    this.typeAhead();
    this.typeAheadAssignTaskToProject();
  }

  get projectName() {
    return this.projectForm.get('name');
  }

  get projectDescription() {
    return this.projectForm.get('description');
  }

  get projectTasks(): FormArray {
    return <FormArray>this.projectForm.get('tasks');
  }

  get taskName() {
    return this.projectForm.get('tasks.name');
  }

  onSubmit() {
    if (!this.editMode) {
      this.projectService.addProject(this.projectForm.value).subscribe(result => {
        this.projectService.newProjectAddedInModal.next(result);
      });
    }
    else {
      let projectToUpdate: IProject = {} as IProject;

      projectToUpdate = this.projectForm.value;
      projectToUpdate.tasks = this.projectTasks.value;

      this.projectService.updateProject(this.projectIdToEdit, projectToUpdate).subscribe(result => {
        this.projectService.projectUpdatedInModel.next({ indexProjectWasEdited: this.editProjectAtIndex, project: result });
      })
    }
  }

  removeTaskFromProject(taskId: number, i: number) {
    this.taskService.moveTaskToTrash(<TaskTrashDto>{ id: taskId, trash: true }).subscribe(_ => {
      this.projectTasks.removeAt(i);
      this.changes.detectChanges();
    }, (error: any) => console.log(error));
  }

  removeMultipleTasksFromProject() {
    this.taskService.removeMultipleTasksFromProject(this.projectIdToEdit, this.tasksIdsArray)
      .subscribe(result => {
        console.log(result)
      }, error => console.log(error),
        () => {
          let sortedIndexes = [...new Set(this.taskControlsIndexes.sort((n1, n2) => n1 - n2))];
          for (var i = sortedIndexes.length - 1; i >= 0; i--) {
            if (sortedIndexes[i] !== -1)
              this.projectTasks.removeAt(sortedIndexes[i]);
          }
          this.tasksIdsArray = [];
          this.taskControlsIndexes = [];

          this.changes.detectChanges();
        });
  }

  makeMultipleTasksInactive() {
    // this.projectService.makeMultipleTasksInactive(this.tasksIdsArray).subscribe();

    this.taskService.makeMultipleTasksInactive(this.projectIdToEdit, this.tasksIdsArray)
      .subscribe(result => {
        console.log(result)
      }, error => console.log(error),
        () => {
          let sortedIndexes = [...new Set(this.taskControlsIndexes.sort((n1, n2) => n1 - n2))];
          for (var i = sortedIndexes.length - 1; i >= 0; i--) {
            if (sortedIndexes[i] !== -1)
              this.projectTasks.removeAt(sortedIndexes[i]);
          }
          this.tasksIdsArray = [];
          this.taskControlsIndexes = [];

          this.changes.detectChanges();
        });
  }

  displayInactiveTasksEvent() {
    this.displayInactiveTasks = !this.displayInactiveTasks;
  }

  onSelectUser(event: any, taskId: number) {
    // this.taskService.assignUserToTask(taskId, event.item.id).subscribe(result => {
    //   console.log(result);
    // }, (error: any) => console.log(error), () => {
    // })
  }

  onSelectTask(event: any) {
    this.projectService.assignTaskToProject(event.item.id, this.projectIdToEdit).subscribe(result => {
      let taskFormGroup = this.generateTasksFormArray(result);
      if (this.projectTasks.length === 0)
        this.projectTasks.controls = [];
      this.projectTasks.push(taskFormGroup);
    }, (error: any) => console.log(error), () => {
      this.searchTask = '';
      this.changes.detectChanges();
    })
  }

  onChange(id: number, isChecked: any, controlIndex: number) {
    if ((<HTMLInputElement>isChecked.target).checked) {
      this.tasksIdsArray.push(id);

      if (this.taskControlsIndexes[controlIndex] === -1) {
        this.taskControlsIndexes[controlIndex] = controlIndex;
      } else {
        this.taskControlsIndexes.push(controlIndex);
      }
    } else {
      let index = this.tasksIdsArray.indexOf(id);
      this.tasksIdsArray.splice(index, 1);
      this.taskControlsIndexes[controlIndex] = -1;
    }
  }

  selectAll() {
    this.allTasksSelected = !this.allTasksSelected;

    if (this.allTasksSelected) {
      this.projectTasks.controls.forEach((c: AbstractControl, index: number) => {
        c.get('isSelected')?.setValue(true);

        let value = c.get('id')?.value;
        if (!this.tasksIdsArray.includes(value)) {
          this.tasksIdsArray.push(value);
          this.taskControlsIndexes.push(index);
        }
      })
    }
    else {
      this.tasksIdsArray = [];
      this.projectTasks.controls.forEach(c => {
        c.get('isSelected')?.setValue(false);
      });
      this.tasksIdsArray = [];
      this.taskControlsIndexes = [];
    }
  }

  addTask() {
    const task = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      dateToComplete: ['', [Validators.required]],
      label: ['', [Validators.required]],
      isSelected: ['', [Validators.required]],
    })

    this.projectTasks.push(task);
  }

  private createForm() {
    this.projectForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(3)]],
      tasks: this.fb.array([])
    });

    this.projectFormInitial = this.projectForm.value;
  }

  private generateTasksFormArray(task: ITask) {
    return this.fb.group({
      id: task.id,
      name: task.name,
      dateToComplete: task.dateToComplete,
      label: task.label,
      isSelected: task.isSelected
    });
  }

  private typeAhead() {
    this.suggestions$ = new Observable((observer: Observer<string | undefined>) => {
      observer.next(this.search);
    }).pipe(
      switchMap((query: string) => {
        if (query) {
          return this.authService.getUsersByName(query);
        }
        return of([]);
      })
    );
  }

  private typeAheadAssignTaskToProject() {
    this.suggestionsTasks$ = new Observable((observer: Observer<string | undefined>) => {
      observer.next(this.searchTask);
    }).pipe(
      switchMap((query: string) => {
        if (query) {
          return this.taskService.getTasksToAssign(query, this.projectIdToEdit);
        }
        return of([]);
      })
    );
  }

  selectDate(d: any) {
    if (d) {
      if (this.editMode)
        this.selectedDate = moment(d, 'YYYY-MM-DD').toDate();
    }
  }

  getDate(d: any) {
    if (d) return new Date(d)

    return new Date();
  }

  // lockInput() {
  //   return false;
  // }
}

// delete will behave like this:
//  -- direct call to the server for delete
//  -- direct call from removing the task from the project

// edit will behave like this:
//  -- hopefully EntityState.Changed will take care of removing, editing and adding new tasks to a project, will take care of the array
