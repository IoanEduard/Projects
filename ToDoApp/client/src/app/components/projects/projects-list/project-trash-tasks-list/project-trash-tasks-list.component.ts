import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-project-trash-tasks-list',
  templateUrl: './project-trash-tasks-list.component.html',
  styleUrls: ['./project-trash-tasks-list.component.scss']
})
export class ProjectTrashTasksListComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  // deleteTask(i: number) {
  //   this.taskService.deleteTask(this.project.tasks[i].id).subscribe(_ => {
  //   }, error => {
  //     console.log(error);
  //   }, () => {
  //     this.projectTasks.removeAt(i)
  //   })
  // }


  // get the list of tasks that belong to trash. 
  // perform delete, assign to task, move to inactive
}
