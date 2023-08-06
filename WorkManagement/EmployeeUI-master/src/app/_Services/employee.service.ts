import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { Employee } from '../_Models/Employee';
import { SpreadSheet } from '../_Models/SpreadSheet';
import { Day } from '../_Models/Day';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(private http: HttpClient) { }

  private EmployeeUrl = 'http://localhost:50182/api/Employee';
  private SpreadSheetUrl = 'http://localhost:50182/api/SpreadSheet/GetSpreadSheet';
  private DayUrl = 'http://localhost:50182/api/Day/PutWorkDay';
  //'http://localhost:8080/api/employee;

  getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.EmployeeUrl);
  }

  getEmployee(id: number): Observable<Employee> {
    const url = `${this.EmployeeUrl}/${id}`;

    return this.http.get<Employee>(url);
  }

  getSpreadSheet(emp: Employee | number, month: number, year: number): Observable<SpreadSheet> {
    const id = typeof emp === 'number' ? emp : emp.ID;
    const url = `${this.SpreadSheetUrl}/${id}/${month}/${year}`;

    return this.http.get<SpreadSheet>(url);
  }

  putDay(day: Day | number, startWorkInterval: number, endWorkInterval: number): Observable<any> {
    const id = typeof day === 'number' ? day : day.ID;
    const url = `${this.DayUrl}/${id}/${startWorkInterval}/${endWorkInterval}`;

    return this.http.put(url, day, httpOptions);

  }

  addEmployee(emp: Employee): Observable<Employee> {
    return this.http.post<Employee>(this.EmployeeUrl, emp, httpOptions);
  }

  putEmployee(emp: Employee | number): Observable<any> {
    const id = typeof emp === 'number' ? emp : emp.ID;
    const url = `${this.EmployeeUrl}/${id}`;

    return this.http.put(url, emp, httpOptions);
  }

  deleteEmployee(emp: Employee | number): Observable<Employee> {
    const id = typeof emp === 'number' ? emp : emp.ID;
    const url = `${this.EmployeeUrl}/${id}`;

    return this.http.delete<Employee>(url, httpOptions);
  }
}
