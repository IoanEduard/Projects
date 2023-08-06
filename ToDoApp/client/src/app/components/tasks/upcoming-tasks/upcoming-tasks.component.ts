import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { Label } from 'src/app/shared/models/enums/label';
import { ITodayTask } from 'src/app/shared/models/ITodayTasks';
import { OurToastrService } from 'src/app/shared/services/toastr.service';
import { UpcomingTasksService } from 'src/app/shared/services/upcoming-tasks.service';
import { TaskEditItemsIndexes } from '../../../shared/models/temporary-objects/TaskEditItemsIndexes';
import { TaskToUpdateInList } from '../../../shared/models/temporary-objects/TaskToUpdateInList';
import { TaskToAddInList } from '../../../shared/models/temporary-objects/TaskToAddInList';

@Component({
  selector: 'app-upcoming-tasks',
  templateUrl: './upcoming-tasks.component.html',
  styleUrls: ['./upcoming-tasks.component.scss'],
})
export class UpcomingTasksComponent implements OnInit {
  taskForm: FormGroup;
  taskFormInitial: any;
  editMode: boolean = false;
  currentDate = new Date();
  priorityEnum = Label;
  keys: any[];
  selectedDate: any;
  backendErrorMessageDateToComplete: any;
  minDate: Date;

  tasksGrouppedByDate: Array<any>;
  taskToEditFormValues: ITodayTask = {} as ITodayTask;
  taskToEdit: ITodayTask = {} as ITodayTask;

  taskOriginIndexesInGrouppedList: TaskEditItemsIndexes =
    {} as TaskEditItemsIndexes;
  taskToUpdateInList: TaskToUpdateInList = {} as TaskToUpdateInList;
  taskToUpdateInListOlDate: Date;

  taskToAddInGrouppedList: TaskToAddInList = {} as TaskToAddInList;

  constructor(
    private fb: FormBuilder,
    private upcomingTasksService: UpcomingTasksService,
    private toastrService: OurToastrService
  ) {
    this.keys = Object.keys(this.priorityEnum).filter((f) => !isNaN(Number(f)));
    this.minDate = new Date();
    this.minDate.setDate(this.minDate.getDate() + 1);
  }

  ngOnInit(): void {
    this.createForm();
  }

  get name() {
    return this.taskForm.get('name');
  }

  get label() {
    return this.taskForm.get('label');
  }

  get dateToComplete() {
    return this.taskForm.get('dateToComplete');
  }

  onSubmit() {
    let taskToAdd: ITodayTask = this.taskForm.value;

    this.upcomingTasksService.addOrUpdate(taskToAdd).subscribe(
      (response) => {
        var date = this.convertDate(taskToAdd.dateToComplete);

        taskToAdd.id = response.id;
        taskToAdd.name = response.name;
        taskToAdd.dateToComplete = response.dateToComplete;
        taskToAdd.label = response.label;
        taskToAdd.completed = response.completed;
        taskToAdd.comments = response.comments;

        this.taskToAddInGrouppedList = {
          convertedDate: date,
          task: taskToAdd,
          isNewTask: true,
        };
      },
      (error) => console.log(error),
      () => {
        this.toastrService.showSuccess('Upcoming Task added succesfully');
        this.taskForm.reset(this.taskFormInitial);
        this.editMode = false;
      }
    );
  }

  editTask() {
    this.taskToEdit = this.taskForm.value;
    this.taskToEdit.id = this.taskToEditFormValues.id;

    this.upcomingTasksService.addOrUpdate(this.taskToEdit).subscribe(
      (_) => {
        this.taskToUpdateInList = {
          task: this.taskToEdit,
          taskIndexesToUpdate: this.taskOriginIndexesInGrouppedList,
          oldDate: this.convertDate(this.taskToUpdateInListOlDate),
          dateSubmitted: this.convertDate(this.taskToEdit.dateToComplete)
        };
      },
      (error) => {
        this.backendErrorMessageDateToComplete =
          error.error.errors.DateToComplete[0];
      },
      () => {
        this.editMode = false;
        this.taskForm.reset(this.taskFormInitial);
        this.toastrService.showSuccess('Upcoming Task added succesfully');
      }
    );
  }

  cancelEditMode() {
    this.editMode = false;
    this.taskForm.reset(this.taskFormInitial);
  }

  getObjectToEdit(event: any) {
    this.backendErrorMessageDateToComplete = undefined;
    this.editMode = true;

    this.taskOriginIndexesInGrouppedList = {
      groupIndex: event.taskOriginIndexesInGrouppedList.groupIndex,
      itemIndexInList: event.taskOriginIndexesInGrouppedList.itemIndexInList,
    } as TaskEditItemsIndexes;

    this.upcomingTasksService.getTaskById(event.id).subscribe(
      (result) => {
        this.taskToEditFormValues = result;
        this.taskToUpdateInListOlDate = result.dateToComplete
      },
      (error) => {
        this.toastrService.showError('No task was found'), console.log(error);
      },
      () => this.patchForm(this.taskToEditFormValues)
    );
  }

  selectDate(d: any) {
    if (d) {
      if (this.editMode || !this.dateToComplete?.pristine)
        this.selectedDate = moment(d, 'YYYY-MM-DD').toDate();
    }
  }

  private convertDate(d: Date): string {
    return moment(d, 'YYYY-MM-DD')
      // .utcOffset(0)
      .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
      .format('YYYY-MM-DD[T]HH:mm:ss')
      .toString();
  }

  private patchForm(task: ITodayTask) {
    this.taskForm.patchValue(task);
  }

  private createForm() {
    this.taskForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      dateToComplete: [''],
      label: ['', [Validators.required]],
    });

    this.taskFormInitial = this.taskForm.value;
  }
}


