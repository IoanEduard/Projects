import { Component, OnInit } from '@angular/core';
import { IOrder } from '../shared/models/IOrder';
import { OrderService } from './order.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {

  orders!: IOrder[];

  constructor(private orderService: OrderService) { }

  ngOnInit() {
    this.getOrders();
  }

  getOrders() {
    this.orderService.getOrdersForUser().subscribe((orders: IOrder[]) => {
      this.orders = orders;
    }, error => {
      console.log(error);
    });
  }

}
