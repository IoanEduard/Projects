import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { ITask } from 'src/app/shared/models/ITask';
import { UpcomingTasksService } from 'src/app/shared/services/upcoming-tasks.service';

@Component({
  selector: 'app-inactive-tasks-list',
  templateUrl: './inactive-tasks-list.component.html',
  styleUrls: ['./inactive-tasks-list.component.scss']
})
export class InactiveTasksListComponent implements OnInit {
  @Input() projectId: number;

  tasks: ITask[] = [];

  constructor(private taskService: UpcomingTasksService, private changes: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.initializeItems();
  }

  initializeItems() {
    this.taskService.getInactiveTasks(this.projectId).subscribe(result => {
      this.tasks = result;
      this.changes.detectChanges();
    });
  }

  makeTaskActive() {
    //call api to activate
    // push it inside the form array of tasks
  }
}
