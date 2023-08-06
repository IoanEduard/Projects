import { IBase } from "./IBase";
import { ITask } from "./ITask";

export interface IProject extends IBase {
    description: string;
    completed: boolean;
    inactiveIcon: boolean;
    trashIcon: boolean;

    tasks: ITask[];
}