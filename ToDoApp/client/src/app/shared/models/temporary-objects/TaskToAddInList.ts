import { ITodayTask } from 'src/app/shared/models/ITodayTasks';


export class TaskToAddInList {
  convertedDate: string;
  task: ITodayTask;
  isNewTask: boolean;
}
