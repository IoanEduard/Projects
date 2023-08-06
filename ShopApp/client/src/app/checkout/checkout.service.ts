import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, map } from 'rxjs';
import { IDeliveryMethod } from '../shared/models/IDeliveryMethod';
import { IOrderToCreate } from '../shared/models/IOrder';
import { IUser } from '../shared/models/IUser';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  baseUrl = 'https://localhost:7046/api/';

  constructor(private http: HttpClient) { }

  creatOrder(order: IOrderToCreate) {
    return this.http.post<IOrderToCreate>(this.baseUrl + 'orders', order);
  }

  getDeliveryMethods() {
    return this.http.get<IDeliveryMethod[]>(this.baseUrl + 'orders/deliveryMethods').pipe(
      map((dm: IDeliveryMethod[]) => {
        return dm.sort((a, b) => b.price - a.price);
      })
    );
  }
}
