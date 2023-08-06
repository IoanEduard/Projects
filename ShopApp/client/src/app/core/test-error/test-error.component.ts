import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-test-error',
  templateUrl: './test-error.component.html',
  styleUrls: ['./test-error.component.scss']
})
export class TestErrorComponent implements OnInit {
  baseUrl = 'https://localhost:7046/api/';
  validationErrors: any;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
  }

  get404Error() {
    this.http.get(this.baseUrl + 'product/45').subscribe(response => {
      console.log(response);
    },error => {
      console.log(error);
    })
  }

  get400ValidationError() {
    this.http.get(this.baseUrl + 'product/somestringinsteadint').subscribe(response => {
      console.log(response);
    },error => {
      console.log(error);
      this.validationErrors = error.errors;
    })
  }

  get400Error() {
    this.http.get(this.baseUrl + 'errortest/badrequest').subscribe(response => {
      console.log(response);
    },error => {
      console.log(error);
    })
  }

  get500Error() {
    this.http.get(this.baseUrl + 'errortest/servererror').subscribe(response => {
      console.log(response);
    },error => {
      console.log(error);
    })
  }

}
