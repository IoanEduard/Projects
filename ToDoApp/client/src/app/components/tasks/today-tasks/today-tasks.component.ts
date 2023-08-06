import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { Label } from 'src/app/shared/models/enums/label';
import { ITodayTask } from 'src/app/shared/models/ITodayTasks';
import { OurToastrService } from 'src/app/shared/services/toastr.service';
import { UpcomingTasksService } from 'src/app/shared/services/upcoming-tasks.service';
import { TodayTaskService } from '../tasks.service';

@Component({
  selector: 'app-today-tasks',
  templateUrl: './today-tasks.component.html',
  styleUrls: ['./today-tasks.component.scss'],
})
export class TodayTasksComponent implements OnInit {
  taskForm: FormGroup;
  taskFormInitial: any;
  editMode: boolean = false;
  currentDate = new Date();
  priorityEnum = Label;
  keys: any[];
  todayTask: ITodayTask;
  todayTasks: ITodayTask[] = [];
  selectedDate: any;
  enableUpcomingTask: boolean = false;
  todayTaskToEdit: ITodayTask;
  todayTaskToEditIndex: number;
  backendErrorMessageDateToComplete: any;
  minDate: Date;

  constructor(
    private fb: FormBuilder,
    private upcomingTasksService: UpcomingTasksService,
    private toastrService: OurToastrService,
    private todayTaskService: TodayTaskService
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
    this.todayTask = this.taskForm.value;
    this.todayTask.timeAdded = new Date().getTime();
    this.todayTask.comments = [];
    this.todayTask.dateToComplete = this.selectedDate;

    if (this.todayTask.dateToComplete && this.enableUpcomingTask) {
      this.upcomingTasksService.addOrUpdate(this.todayTask).subscribe(
        (response) => {
          this.taskForm.reset(this.taskFormInitial);
          this.selectedDate = undefined;
          this.editMode = false;
          this.backendErrorMessageDateToComplete = '';
          this.toastrService.showSuccess('Upcoming Task added succesfully');
        },
        (error) =>
          (this.backendErrorMessageDateToComplete =
            error.error.errors.DateToComplete[0])
      );
    } else {
      this.todayTaskService.addTodayTask(this.todayTask).subscribe(
        (result) => {
          this.toastrService.showSuccess(result);
          this.taskForm.reset(this.taskFormInitial);
          this.editMode = false;
        },
        (error) => {
          this.toastrService.showError(error);
        }
      );
    }
  }

  selectDate(d: any) {
    if (d) {
      if (this.editMode || !this.dateToComplete?.pristine)
        this.selectedDate = moment(d, 'YYYY-MM-DD').toDate();
    }
  }

  editTask() {
    this.todayTasks[this.todayTaskToEditIndex] = this.taskForm.value;
    this.todayTaskToEdit.dateToComplete = this.selectedDate;

    if (!this.todayTaskToEdit.dateToComplete) {
      this.updateLocalStorageTodayTasks();
    } else {
      this.upcomingTasksService
        .addOrUpdate(this.todayTasks[this.todayTaskToEditIndex])
        .subscribe(
          (result) => {
            this.editMode = false;
            this.enableUpcomingTask = false;
            this.todayTasks.splice(this.todayTaskToEditIndex, 1);
            this.updateLocalStorageTodayTasks();
            this.toastrService.showSuccess('Upcoming Task added succesfully');
          },
          (error) => {
            this.backendErrorMessageDateToComplete =
              error.error.errors.DateToComplete[0];
          }
        );
    }
    this.taskForm.reset(this.taskFormInitial);
  }

  getObjectToEdit(event: any) {
    this.backendErrorMessageDateToComplete = '';
    this.editMode = true;
    this.todayTaskToEdit = event.task;
    this.todayTasks = event.tasks;
    this.todayTaskToEditIndex = event.index;

    this.patchForm(this.todayTaskToEdit);
  }

  toggleDateInput() {
    this.enableUpcomingTask = !this.enableUpcomingTask;
  }

  cancelEditMode() {
    this.editMode = false;
    this.taskForm.reset(this.taskFormInitial);
  }

  private updateLocalStorageTodayTasks() {
    this.todayTaskService
      .updateTodayTask(this.todayTasks)
      .subscribe((result) => {
        this.editMode = false;
        this.toastrService.showSuccess(result);
      });
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
