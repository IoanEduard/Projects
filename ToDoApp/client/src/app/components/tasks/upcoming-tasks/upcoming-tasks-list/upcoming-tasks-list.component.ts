import {
  AfterContentChecked,
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { ITodayTask } from 'src/app/shared/models/ITodayTasks';
import { TaskToCompleteDto } from 'src/app/shared/models/temporary-objects/TaskToCompleteDto';
import { TaskToEdit } from '../../../../shared/models/temporary-objects/TaskToEdit';
import { OurToastrService } from 'src/app/shared/services/toastr.service';
import { UpcomingTasksService } from 'src/app/shared/services/upcoming-tasks.service';
import { TasksGroup } from "../../../../shared/models/temporary-objects/TasksGroup";
import { TaskToAddInList } from "../../../../shared/models/temporary-objects/TaskToAddInList";
import { TaskToUpdateInList } from "../../../../shared/models/temporary-objects/TaskToUpdateInList";
import { TaskInactiveDto } from 'src/app/shared/models/temporary-objects/TaskInactiveDto';
import { TaskTrashDto } from 'src/app/shared/models/temporary-objects/TaskTrashDto';
import { BasicResponse } from 'src/app/shared/models/dtos/BasicResponse';
import { Observable, Observer, of, switchMap } from 'rxjs';
import { ProjectService } from 'src/app/shared/services/project.service';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-upcoming-tasks-list',
  templateUrl: './upcoming-tasks-list.component.html',
  styleUrls: ['./upcoming-tasks-list.component.scss'],
})
export class UpcomingTasksListComponent implements OnInit, OnChanges, AfterViewChecked, AfterContentChecked {
  @Output() taskEditEvent: EventEmitter<TaskToEdit> =
    new EventEmitter<TaskToEdit>();

  @Input() taskToUpdateInList: TaskToUpdateInList = {} as TaskToUpdateInList;
  @Input() taskToAddInList: TaskToAddInList = {} as TaskToAddInList;

  groupedByDateUpcomingTasks: Array<any>;
  showCommentComponent: any[] = [];
  groupIsOrderedAscending: boolean = true;
  groupItemsOnlyNotCompleted: boolean = true;
  groupHasNoContent: boolean = true;

  searchProject: any;
  suggestionProject$?: Observable<BasicResponse[]>;
  errorMessageTasks?: string;

  suggestionSearchInputGroupIndex: number;
  suggestionSearchInputGroupItemIndex: number;

  searchUser: any;
  suggestionUsers$?: Observable<BasicResponse[]>;
  errorUserAssign?: string;

  suggestionSearchInputGroupIndexUser: number;
  suggestionSearchInputGroupItemIndexUser: number;

  constructor(
    private upcomingTasksService: UpcomingTasksService,
    private toastrService: OurToastrService,
    private cdRef: ChangeDetectorRef,
    private projectService: ProjectService,
    private authService: AuthService,
    private taskService: UpcomingTasksService
  ) { }

  ngOnInit(): void {
    this.initializeItems();
  }

  ngOnChanges() {
    if (this.groupedByDateUpcomingTasks && !this.taskToAddInList.isNewTask)
      this.updateTasksInGroup();
    else {
      this.addTask();
    }
  }

  trackByIndex(index: number, obj: any): any {
    return index;
  }

  ngAfterContentChecked(): void {
    this.cdRef.detectChanges();
  }

  ngAfterViewChecked(): void {
    this.cdRef.detectChanges();
  }

  removeTask(i: number, j: number, id: any) {
    this.upcomingTasksService.deleteTask(id).subscribe(
      () => {
        this.removeTaskInList(i, j);
      },
      () => {
        this.toastrService.showSuccess('Task failed to deleted');
      },
      () => {
        this.toastrService.showSuccess('Task Deleted');
      }
    );
  }

  enableEditTask(id: number, groupIndex: number, itemIndex: number) {
    this.taskEditEvent.emit(<TaskToEdit>{
      id: id,
      taskOriginIndexesInGrouppedList: {
        groupIndex: groupIndex,
        itemIndexInList: itemIndex,
      },
    });
  }

  onSelectProject(taskId: number, event: any) {
    this.projectService.assignTaskToProject(taskId, event.item.id).subscribe(result => {
    }, (error: any) => console.log(error))
  }

  onSelectUser(taskId: number, event: any) {
    this.taskService.assignUserToTask(taskId, event.item.id).subscribe(result => {
    }, (error: any) => {
      this.toastrService.showError(error.error);
    },
      () => {
        this.toastrService.showSuccess('User added to task');
      }
    )
  }

  private typeAheadProjects() {
    this.suggestionProject$ = new Observable((observer: Observer<string | undefined>) => {
      observer.next(
        this.searchProject[this.suggestionSearchInputGroupIndex][this.suggestionSearchInputGroupItemIndex]);
    }).pipe(
      switchMap((query: string) => {
        if (query) {
          return this.projectService.searchProjectByName(query);
        }
        return of([]);
      })
    );
  }

  private typeAheadUsers() {
    this.suggestionUsers$ = new Observable((observer: Observer<string | undefined>) => {
      observer.next(
        this.searchUser[this.suggestionSearchInputGroupIndexUser][this.suggestionSearchInputGroupItemIndexUser]);
    }).pipe(
      switchMap((query: string) => {
        if (query) {
          return this.authService.getUsersByName(query);
        }
        return of([]);
      })
    );
  }

  searchProjectOnChange(event: any, groupIndex: number, groupItemIndex: number) {
    this.suggestionSearchInputGroupIndex = groupIndex;
    this.suggestionSearchInputGroupItemIndex = groupItemIndex;
  }

  searchUserOnChange(event: any, groupIndex: number, groupItemIndex: number) {
    this.suggestionSearchInputGroupIndexUser = groupIndex;
    this.suggestionSearchInputGroupItemIndexUser = groupItemIndex;
  }

  toggleAscendingDescendingOrderForTaskList() {
    this.groupIsOrderedAscending = !this.groupIsOrderedAscending;
    if (this.groupIsOrderedAscending) {
      this.initializeItems();
    }
    else {
      this.upcomingTasksService.getAllTasksOrderedByDateDescending().subscribe((result) => {
        this.groupedByDateUpcomingTasks = result;
      });
    }
  }

  displayCommentsComponent(index: number) {
    this.showCommentComponent[index] = !this.showCommentComponent[index];
  }

  private updateTasksInGroup() {
    let itemIndex = this.taskToUpdateInList.taskIndexesToUpdate.itemIndexInList;
    let groupIndex = this.taskToUpdateInList.taskIndexesToUpdate.groupIndex;

    if (this.taskToUpdateInList.oldDate === this.taskToUpdateInList.dateSubmitted) {
      this.groupedByDateUpcomingTasks[groupIndex].tasks[itemIndex] = this.taskToUpdateInList.task;
    } else {
      this.taskToAddInList = <TaskToAddInList>{
        convertedDate: this.taskToUpdateInList.dateSubmitted,
        task: this.taskToUpdateInList.task,
        isNewTask: false
      };

      this.removeTaskInList(itemIndex, groupIndex);
      this.addTask();
    }
  }

  private removeTaskInList(i: number, j: number) {
    this.groupedByDateUpcomingTasks[j].tasks.splice(i, 1);
    if (this.groupedByDateUpcomingTasks[j].tasks.length === 0) {
      this.groupedByDateUpcomingTasks.splice(j, 1);
    }
  }

  private addTask() {
    for (var i = 0; i < this.groupedByDateUpcomingTasks?.length; i++) {
      if (this.taskToAddInList.convertedDate === this.groupedByDateUpcomingTasks[i].date) {
        this.addTaskInExistingGroup(i);
        break;
      }
      else {
        if (i === this.groupedByDateUpcomingTasks?.length - 1) {
          this.addTaskInNewGroup(i);
          break;
        }
      }
    }
  }

  private addTaskInNewGroup(i: number) {
    let tasks: ITodayTask[] = []

    if (this.groupedByDateUpcomingTasks.length === 0) {
      this.groupedByDateUpcomingTasks = [] as TasksGroup[];
    }

    tasks.push(this.taskToAddInList.task);

    this.groupedByDateUpcomingTasks.splice(i, 0, {
      date: this.taskToAddInList.convertedDate,
      count: 1,
      tasks: tasks
    })
    this.taskToAddInList.isNewTask = false;
  }

  private addTaskInExistingGroup(i: number) {
    this.groupedByDateUpcomingTasks[i].tasks.push(this.taskToAddInList.task);
    this.groupedByDateUpcomingTasks[i].count++;
    this.taskToAddInList.isNewTask = false;
  }

  private initializeItems() {
    this.upcomingTasksService
      .getAllTasksOrderedByDateAscending()
      .subscribe((result) => {
        this.groupedByDateUpcomingTasks = result;
        this.searchProject = JSON.parse(JSON.stringify(result));
        this.searchUser = JSON.parse(JSON.stringify(result));
      }, (error: any) => {
      }, () => {
        this.typeAheadUsers();
        this.typeAheadProjects();
      });
  }

  // Overthinking BS shit
  markTaskAsDone(id: number, completed: boolean, groupIndex: number, groupItemIndex: number) {
    let taskToCompleteDto = <TaskToCompleteDto>{
      id: id,
      completed: completed = !completed
    }

    this.upcomingTasksService.markTaskAsCompleted(taskToCompleteDto).subscribe(_ => {
      this.groupedByDateUpcomingTasks[groupIndex].tasks[groupItemIndex].completed = completed;
    }, error => { }, () => { })
  }

  markTaskAsInactive(id: number, inactive: boolean, groupIndex: number, groupItemIndex: number) {
    let taskInactiveDto = <TaskInactiveDto>{
      id: id,
      inactive: inactive = !inactive
    }

    this.upcomingTasksService.markTaskAsInactive(taskInactiveDto).subscribe(_ => {
      this.groupedByDateUpcomingTasks[groupIndex].tasks[groupItemIndex].inactive = inactive;
    }, error => { }, () => { })
  }

  moveTaskToTrash(id: number, trash: boolean, groupIndex: number, groupItemIndex: number) {
    let taskToTrash = <TaskTrashDto>{
      id: id,
      trash: trash = !trash
    }

    this.upcomingTasksService.moveTaskToTrash(taskToTrash).subscribe(_ => {
      this.groupedByDateUpcomingTasks[groupIndex].tasks[groupItemIndex].trash = trash;
    }, error => { }, () => { })
  }

  // continuation onf BS 
  toggleCompletedTasksVisibility() {
    this.groupItemsOnlyNotCompleted = !this.groupItemsOnlyNotCompleted;
    if (this.groupItemsOnlyNotCompleted)
      this.initializeItems();
  }

  hideCompletedTasksElements(taskItemCompleted: boolean, groupItemIndex: number, groupIndex: number) {
    if (!this.groupItemsOnlyNotCompleted) {
      let itemIndex = groupItemIndex;
      let removed: boolean = false;

      if (!taskItemCompleted) {
        if (removed) itemIndex -= 1;

        this.groupedByDateUpcomingTasks[groupIndex].tasks.splice(itemIndex, 1);
      }
    }

    return taskItemCompleted || this.groupItemsOnlyNotCompleted;
  }

}
