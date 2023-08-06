import { Employee } from './Employee';
import { Day } from './Day';

export class SpreadSheet {
    ID: number;
    Month: number;
    Year: number;

    Employee: Employee;
    Day: Array<Day>;
}

