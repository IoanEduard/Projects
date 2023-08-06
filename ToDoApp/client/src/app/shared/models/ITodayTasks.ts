import { IComment } from './IComment';
import { ITask } from './ITask';

export interface ITodayTask extends ITask {
  timeAdded: number;
  dueDate: Date;
  completed: boolean;
  description: string;

  comments: IComment[];
}
