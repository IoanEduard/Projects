import { Rank } from './Rank';
import { MyDate } from './MyDate';
import { SpreadSheet } from './SpreadSheet';

export class Employee {
    ID: number;
    FirstName: string;
    Lastname: string;
    BirthDate: string;
    Gender: string;

    RankId: number;
    Rank: Rank;

    MyDate: MyDate;

    SpreadSheet: Array<SpreadSheet>;
}