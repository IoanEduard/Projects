import { ITodayTask } from 'src/app/shared/models/ITodayTasks';
import { TaskEditItemsIndexes } from './TaskEditItemsIndexes';


export class TaskToUpdateInList {
  task: ITodayTask;
  taskIndexesToUpdate: TaskEditItemsIndexes;
  oldDate: string;
  dateSubmitted: string;
}
