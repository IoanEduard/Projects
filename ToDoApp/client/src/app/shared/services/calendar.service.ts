import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
  })
  export class CalendarService {
    url: string = 'https://localhost:7284/api/calendar';
    
    constructor(private http: HttpClient) { }

    getProjects() {
        return this.http.get<any[]>(this.url);
      }
  }  