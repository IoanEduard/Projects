import { ITodayTask } from 'src/app/shared/models/ITodayTasks';


export class TasksGroup {
  date: string;
  count: number;
  tasks: ITodayTask[];
}
