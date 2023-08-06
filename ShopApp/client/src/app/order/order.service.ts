import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IOrder } from '../shared/models/IOrder';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  baseUrl = 'https://localhost:7046/api/';
  
  constructor(private http: HttpClient) { }

  getOrdersForUser() {
    return this.http.get<IOrder[]>(this.baseUrl + 'orders');
  }

  getOrderDetailed(id: number) {
    return this.http.get<IOrder>(this.baseUrl + 'orders/' + id);
  }
}
