import { Component, OnInit, ViewChildren } from '@angular/core';
import { Employee } from 'src/app/_Models/Employee';
import { EmployeeService } from 'src/app/_Services/employee.service';
import { RankService } from 'src/app/_Services/rank.service';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Rank } from 'src/app/_Models/Rank';
import { SpreadSheet } from 'src/app/_Models/SpreadSheet';
import { MyDate } from 'src/app/_Models/MyDate';
import { Day } from 'src/app/_Models/Day';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss'],
})

export class EmployeeComponent implements OnInit {
  @ViewChildren('startWork') inputs;
  @ViewChildren('endWork') inputs2;
  name:string;

  employees: Employee[];
  employeesWithRanks: Employee[];
  employeeForm: boolean;
  isNewForm: boolean;
  newEmployee: any = {};

  spreadSheetEmployee: any;
  defaultSpreadSheet: any = {};
  newSpreadSheet: any = {};
  
  workStart: number;
  workEnd: number;

  month: number;
  year: number;

  myRanks: Rank[];

  order: string = 'FirstName';
  order2: string = 'LastName';
  reverse: boolean = false;

  genders: string[] = ["Male", "Female"];
  radioSelected:string;
  radioSelectedString:string;

  constructor(
    private EmployeeService: EmployeeService,
    private modalService: NgbModal,
    private rankService: RankService,
    public activeModal: NgbActiveModal
  ) { 
  }

  ngOnInit() {
    this.getEmployees();
    this.getRanks();
  }

  getRanks(): void {
    this.rankService.getRanks()
      .subscribe(ranks => {
        this.myRanks = ranks;
      });
  }

  getEmployees(): void {
    this.EmployeeService.getEmployees()
      .subscribe(employees => {
        this.employees = employees;
      });
  }

  getSpreadSheet(employee: Employee, spreadSheet: SpreadSheet): void {
      this.EmployeeService.getSpreadSheet(employee, spreadSheet.Month, spreadSheet.Year)
        .subscribe(sp => {
          this.newSpreadSheet = sp;
        });
  }

  delete(employee: Employee): void {
    this.employees = this.employees.filter(j => j !== employee);
    this.EmployeeService.deleteEmployee(employee).subscribe();
  }

  showAddEmployeeForm() {
    if (this.employees.length) {
      this.newEmployee = {};
    }
    this.employeeForm = true;
    this.isNewForm = true;
  }

  showEditEmployeeForm(employee: Employee) {
    if (!employee) {
      this.employeeForm = false;
      return;
    }

    this.employeeForm = true;
    this.isNewForm = false;
    this.newEmployee = employee;
  }

  saveEmployee(employee: Employee) {
    let date = this.dateBuilderToCSharp(employee.MyDate);
    employee.BirthDate = date;

    if (this.isNewForm) {
      this.EmployeeService.addEmployee(employee).subscribe(_ => this.getEmployees());
    }
    else {
      this.EmployeeService.putEmployee(employee).subscribe();
    }
    
    this.modalService.dismissAll();
    this.employeeForm = false;
  }

  openAddEmployee(content) {
    this.modalService.open(content, { size: 'sm', centered: true });

    if (this.employees.length) {
      this.newEmployee = {};
    }
    this.employeeForm = true;
    this.isNewForm = true;
  }

  openEditEmployee(employee: Employee, content) {
    this.modalService.open(content, { size: 'sm', centered: true });

    let rank = this.getRankById(employee.RankId);
    employee.Rank = rank;

    let date = this.getDateInDatePickerFormat(employee.BirthDate);
    employee.MyDate = date;

    if (!employee) {
      this.employeeForm = false;
      return;
    }
    
    this.employeeForm = true;
    this.isNewForm = false;
    this.newEmployee = employee;
  }

  openSpreadSheet(employee: Employee, contentSpreadSheet) {
    this.modalService.open(contentSpreadSheet, { size: 'lg' });

    var d = new Date();
    var Month = d.getMonth() + 1; 
    var Year = d.getFullYear();

    this.defaultSpreadSheet = { Month, Year };
    this.spreadSheetEmployee = employee;
    this.newSpreadSheet.Day = this.getSpreadSheet(employee, this.defaultSpreadSheet);
  }

  openEditWorkInterval(day: Day, contentSpreadSheetOpenWorkInterval) {
    this.modalService.open(contentSpreadSheetOpenWorkInterval, { centered: true });
  }

  saveWorkInterval(day: Day, startInterval: number, endInterval: number, employee: Employee, contentSpreadSheet) {
    this.EmployeeService.putDay(day, startInterval, endInterval).subscribe();
  }

  setOrderFirstName(value: string) {
    if (this.order === value) {
      this.reverse = !this.reverse;
    }

    this.order = value;
  }

  setOrderLastName(value: string) {
    if (this.order === value) {
      this.reverse = !this.reverse;
    }

    this.order = value;
  }

  getRankById(id: number): Rank {
    let rank = this.myRanks.find(j => j.ID === id);

    return rank;
  }

  getDateInDatePickerFormat(date: string): MyDate {
    var d = new MyDate();
    var dArr = date.split("/");

    d.month = +dArr[0];
    d.day = +dArr[1];
    d.year = +dArr[2];

    return d;
  }

  dateBuilderToCSharp(date: MyDate): string {
    let day = date.month;
    let month = date.day;
    let year = date.year;

    return `${day}/${day}/${year}`;
  }
}